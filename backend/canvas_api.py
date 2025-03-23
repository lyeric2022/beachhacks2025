import requests
import json
from datetime import datetime, timezone
from dotenv import load_dotenv
from supabase import create_client, Client
import os

# Load environment variables
load_dotenv()

# === Configuration ===
CANVAS_API_TOKEN = os.getenv('CANVAS_API_TOKEN')
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
if not CANVAS_API_TOKEN:
    raise ValueError("CANVAS_API_TOKEN not found in environment variables")
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

BASE_URL = "https://csulb.instructure.com/api/v1"
HEADERS = {"Authorization": f"Bearer {CANVAS_API_TOKEN}"}

# === Helper Functions ===

def parse_datetime(dt_str):
    """Parse an ISO date string (or return None)."""
    if not dt_str:
        return None
    try:
        return datetime.fromisoformat(dt_str.replace("Z", "+00:00"))
    except Exception:
        return None

def is_due_in_future(due_at_str):
    """Return True if due date is in the future (or not set)."""
    due = parse_datetime(due_at_str)
    if due is None:
        return True
    return due > datetime.now(timezone.utc)

def get_user_profile():
    url = f"{BASE_URL}/users/self"
    resp = requests.get(url, headers=HEADERS)
    print(f"GET {url} -> {resp.status_code}")
    if resp.status_code == 200:
        return resp.json()
    return {}

def get_courses():
    # Include the term object by adding include[]=term to the URL
    url = f"{BASE_URL}/courses?state[]=all&per_page=100&include[]=term"
    resp = requests.get(url, headers=HEADERS)
    print(f"GET {url} -> {resp.status_code}")
    if resp.status_code == 200:
        return resp.json()
    return []

def get_enrollments():
    url = f"{BASE_URL}/users/self/enrollments?per_page=100"
    resp = requests.get(url, headers=HEADERS)
    print(f"GET {url} -> {resp.status_code}")
    if resp.status_code == 200:
        return resp.json()
    return []

def get_assignment_groups(course_id):
    url = f"{BASE_URL}/courses/{course_id}/assignment_groups?include[]=assignments&per_page=100"
    resp = requests.get(url, headers=HEADERS)
    print(f"GET {url} -> {resp.status_code}")
    if resp.status_code == 200:
        groups = resp.json()
        # Return only the important fields
        return {g["id"]: {"group_name": g.get("name"), "group_weight": g.get("group_weight")}
                for g in groups if "id" in g}
    return {}

def get_assignments(course_id):
    url = f"{BASE_URL}/courses/{course_id}/assignments?per_page=100"
    resp = requests.get(url, headers=HEADERS)
    print(f"GET {url} -> {resp.status_code}")
    if resp.status_code == 200:
        return resp.json()
    return []

def get_submission_self(course_id, assignment_id):
    url = f"{BASE_URL}/courses/{course_id}/assignments/{assignment_id}/submissions/self"
    resp = requests.get(url, headers=HEADERS)
    print(f"GET {url} -> {resp.status_code}")
    if resp.status_code == 200:
        return resp.json()
    return {}

# === Main Processing ===

def main():
    output = {
        "user_profile": {},
        "courses": [],
    }
    
    # 1. Get user profile.
    profile = get_user_profile()
    output["user_profile"] = {
        "id": profile.get("id"),
        "name": profile.get("name"),
        "sortable_name": profile.get("sortable_name")
    }
    
    supabase.table("user").upsert(output["user_profile"]).execute()
    
    # 2. Get all courses and filter for Spring 2025 by checking the term.
    courses = get_courses()
    spring_courses = [
        course for course in courses 
        if course.get("term") and course["term"].get("name") == "Spring 2025"
    ]
    
    # 3. Get enrollments (for overall grade info).
    enrollments = get_enrollments()
    enrollment_map = {e["course_id"]: e.get("grades", {}) for e in enrollments if "course_id" in e}
    
    # 4. Process each Spring 2025 course.
    for course in spring_courses:
        course_id = course.get("id")
        # If not enrolled (no grade info), skip.
        if course_id not in enrollment_map:
            continue
        
        course_data = {
            "id": course_id,
            "title": course.get("name"),
            "overall_score": enrollment_map[course_id].get("current_score"),
            "assignments": {
                "upcoming": [],
                "past": []
            }
        }
        
        supabase.table("courses").upsert({
            "id": course_id,
            "title": course.get("name"),
            "overall_score": course_data["overall_score"],
            "user_id": profile.get("id")
        }).execute()
        
        # Get assignment groups (mapping by id).
        group_mapping = get_assignment_groups(course_id)
        
        # Get assignments.
        assignments = get_assignments(course_id)
        if not assignments:
            continue
        
        upcoming = []
        past = []
        for a in assignments:
            due_at = a.get("due_at")
            # Add assignment type from submission_types.
            assignment_type = a.get("submission_types")  # This is an array.
            a["assignment_type"] = assignment_type
            
            # Include group info (by assignment_group_id).
            group_id = a.get("assignment_group_id")
            group_info = group_mapping.get(group_id, {"group_name": None, "group_weight": None})
            a["assignment_group_info"] = group_info
            
            # Separate into upcoming vs. past based on due date.
            if is_due_in_future(due_at):
                upcoming.append(a)
            else:
                past.append(a)
        
        # Process upcoming assignments (include essential fields).
        for a in upcoming:
            assignment_data = {
                "id": a.get("id"),
                "title": a.get("name"),
                "due_date": a.get("due_at"),
                "points_possible": a.get("points_possible"),
                "assignment_type": json.dumps(a.get("assignment_type")),
                "group_name": a["assignment_group_info"]["group_name"],
                "group_weight": a["assignment_group_info"]["group_weight"],
                "course_id": course_id,
                "user_id": profile.get("id")
            }
            course_data["assignments"]["upcoming"].append(assignment_data)
            supabase.table("assignments").upsert(assignment_data).execute()
            
        # Process past assignments: fetch submission grade info.
        for a in past:
            submission = get_submission_self(course_id, a.get("id"))
            grade_info = {
                "score": submission.get("score"),
                "points_possible": a.get("points_possible")
            }
            if submission.get("score") is not None and a.get("points_possible"):
                try:
                    percent = (float(submission.get("score")) / float(a.get("points_possible"))) * 100
                    grade_info["percentage"] = round(percent, 2)
                except Exception:
                    grade_info["percentage"] = None
            a_entry = {
                "id": a.get("id"),
                "title": a.get("name"),
                "due_at": a.get("due_at"),
                "grade_info": grade_info,
                "assignment_type": a.get("assignment_type"),
                "assignment_group": a.get("assignment_group_info"),
            }
            course_data["assignments"]["past"].append(a_entry)
        
        output["courses"].append(course_data)
    
    # Write JSON output (for example, to later upload to Firebase).
    with open("canvas_output.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)
    print("Output written to canvas_output.json")

if __name__ == "__main__":
    main()
