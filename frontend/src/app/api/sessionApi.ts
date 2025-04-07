import axios from "axios";

// Define Session interface
interface Session {
  id: number;
  assignment_id: number;
  user_id: number;
  start_time: string;
  end_time?: string | null;
  duration?: number;
  is_active: boolean;
  status?: string;
  assignments?: {
    title: string;
    courses: {
      title: string;
    }
  };
}

export const startSession = async (assignment_id: number, user_id: number): Promise<Session> => {
  console.log("Mock: Starting session", assignment_id, user_id);
  return {
    id: Math.floor(Math.random() * 1000),
    assignment_id,
    user_id,
    start_time: new Date().toISOString(),
    is_active: true,
    status: "In Progress"
  };
};

export const checkSessionExists = async (assignment_id: number, user_id: number): Promise<Session | null> => {
  console.log("Mock: Checking session", assignment_id, user_id);
  return {
    id: Math.floor(Math.random() * 1000),
    assignment_id,
    user_id,
    start_time: new Date().toISOString(),
    is_active: false
  };
};

export const fetchSessionsByUser = async (user_id: number): Promise<Session[]> => {
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
};

interface SessionUpdate {
  status?: string;
  is_active?: boolean;
  end_time?: string;
  duration?: number;
}

export const updateSession = async (
  session_id: number,
  updates: SessionUpdate
): Promise<Session> => {
  console.log("Mock: Updating session", session_id, updates);
  return {
    id: session_id,
    assignment_id: 0,
    user_id: 55141,
    start_time: new Date().toISOString(),
    is_active: updates.is_active ?? false,
    ...updates
  };
};
