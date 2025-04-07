import axios from "axios";

// Define comprehensive interface for assignment data
interface Assignment {
  id?: number;
  title: string;
  description?: string;
  due_date: string;
  user_id: number;
  course_id?: number;
  status?: string;
  courses?: { 
    id: number; 
    title: string 
  };
}

// Comment out the real API URL
// axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7777/api";

// Mock data
const mockAssignments = [
  {
    id: 1,
    title: "Physics Homework",
    description: "Complete problems 1-10",
    due_date: "2024-05-25T23:59:00Z",
    user_id: 55141,
    status: "In Progress",
    courses: { id: 1, title: "Physics 101" }
  },
  {
    id: 2,
    title: "Programming Assignment",
    description: "Build a React app",
    due_date: "2024-05-28T23:59:00Z",
    user_id: 55141,
    status: "In Progress",
    courses: { id: 2, title: "CS 401" }
  },
  {
    id: 3,
    title: "History Essay",
    description: "Write about WWII",
    due_date: "2024-05-30T23:59:00Z",
    user_id: 55141,
    status: "Completed",
    courses: { id: 3, title: "History 201" }
  }
];

export const fetchAssignmentsByUser = async (userId: number): Promise<Assignment[]> => {
  console.log("Mock: Fetching assignments for user", userId);
  return mockAssignments;
};

export const addAssignment = async (assignment: Assignment): Promise<Assignment> => {
  console.log("Mock: Adding assignment", assignment);
  return {
    ...assignment,
    id: Math.floor(Math.random() * 1000),
    courses: { id: Number(assignment.course_id) || 1, title: assignment.courses?.title || "Unknown Course" }
  };
};

export const updateAssignmentStatus = async (id: number, status: string): Promise<Assignment> => {
  console.log("Mock: Updating assignment status", id, status);
  return { 
    id, 
    status,
    title: "Updated Assignment",
    user_id: 55141,
    due_date: new Date().toISOString() 
  };
};

export const updateAssignment = async (id: number, updatedData: Partial<Assignment>): Promise<Assignment> => {
  console.log("Mock: Updating assignment", id, updatedData);
  return { 
    id, 
    ...updatedData,
    title: updatedData.title || "Updated Assignment",
    user_id: 55141,
    due_date: updatedData.due_date || new Date().toISOString()
  };
};

export const deleteAssignment = async (id: number): Promise<void> => {
  console.log("Mock: Deleting assignment", id);
};
