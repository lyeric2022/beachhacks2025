import axios from "axios";

axios.defaults.baseURL = "http://localhost:7777/api";

export const startSession = async (assignment_id, user_id) => {
  const response = await axios.post("/session", {
    assignment_id,
    user_id,
  });
  return response.data;
};

export const checkSessionExists = async (assignment_id, user_id) => {
  const response = await axios.get("/session/active", {
    params: { assignment_id, user_id },
  });

  return response.data.session;
};

export const fetchSessionsByUser = async (user_id) => {
  console.log("user", user_id);
  const response = await axios.get("/session", {
    params: {
      user_id: user_id,
    },
  });
  return response.data;
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
  const response = await axios.patch(`/session/${session_id}`, updates);
  return response.data;
};
