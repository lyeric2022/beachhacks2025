# #!/usr/bin/env python3
# import json
# from supabase import create_client, Client

# SUPABASE_URL = "https://hswxavcmdruoghpgwpxf.supabase.co"
# SUPABASE_ANON_KEY = (
#     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
#     "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzd3hhdmNtZHJ1b2docGd3cHhmIiwicm9sZSI6"
#     "ImFub24iLCJpYXQiOjE3NDI2ODkzNTEsImV4cCI6MjA1ODI2NTM1MX0."
#     "ShfVq1NdpprAMyX8jlfUJj-RKf20IMTVRORqLwTtwFA"
# )

# def get_all_data():
#     supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

#     # Query your tables; adjust names as necessary
#     assignments_res = supabase.table("assignments").select("*").execute()
#     courses_res = supabase.table("courses").select("*").execute()
#     user_res = supabase.table("user").select("*").execute()

#     return {
#         "assignments": assignments_res.data,
#         "courses": courses_res.data,
#         "user": user_res.data
#     }

# if __name__ == "__main__":
#     # Print out a JSON object so the TS code can parse it
#     data = get_all_data()
#     print(json.dumps(data))
