import axios from "axios";

// Comment out real API base URL
// axios.defaults.baseURL = "http://localhost:7777/api";

// Add TypeScript types to fix build errors
export const startSession = async (assignment_id: number, user_id: number) => {
  // Return mock data instead of making API call
  console.log("Mock: Starting session", assignment_id, user_id);
  return {
    id: Math.floor(Math.random() * 1000),
    assignment_id,
    user_id,
    start_time: new Date().toISOString(),
    is_active: true,
    status: "In Progress"
  };
  
  // Original code (commented out):
  // const response = await axios.post("/session", {
  //   assignment_id,
  //   user_id,
  // });
  // return response.data;
};

export const checkSessionExists = async (assignment_id: number, user_id: number) => {
  // Return mock data
  console.log("Mock: Checking session", assignment_id, user_id);
  return {
    id: Math.floor(Math.random() * 1000),
    assignment_id,
    user_id,
    start_time: new Date().toISOString(),
    is_active: false
  };
  
  // Original code (commented out):
  // const response = await axios.get("/session/active", {
  //   params: { assignment_id, user_id },
  // });
  // return response.data.session;
};

export const fetchSessionsByUser = async (user_id: number) => {
  // Return mock data
  console.log("Mock: Fetching sessions for user", user_id);
  return [
    {
      id: 1,
      assignment_id: 101,
      user_id,
      start_time: new Date().toISOString(),
      end_time: null,
      duration: 1200,
      is_active: true,
      status: "In Progress",
      assignments: {
        title: "Physics Homework",
        courses: { title: "PHYS 151" }
      }
    },
    {
      id: 2,
      assignment_id: 102,
      user_id,
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      duration: 600,
      is_active: false,
      status: "Paused",
      assignments: {
        title: "Database Project",
        courses: { title: "CECS 323" }
      }
    }
  ];
  
  // Original code (commented out):
  // console.log("user", user_id);
  // const response = await axios.get("/session", {
  //   params: {
  //     user_id: user_id,
  //   },
  // });
  // return response.data;
};

export const updateSession = async (
  session_id: number,
  updates: Partial<{
    status: string;
    is_active: boolean;
    end_time: string;
    duration: number;
  }>
) => {
  // Just log and return the updates
  console.log("Mock: Updating session", session_id, updates);
  return {
    id: session_id,
    ...updates
  };
  
  // Original code (commented out):
  // const response = await axios.patch(`/session/${session_id}`, updates);
  // return response.data;
};
