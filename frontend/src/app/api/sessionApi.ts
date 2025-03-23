import axios from "axios";

export const startSession = async (assignment_id, user_id) => {
  const response = await axios.post("/session", {
    assignment_id,
    user_id,
  });
  return response.data;
};

export const checkSessionExists = async (
  assignment_id: number,
  user_id: number
) => {
  const response = await axios.get("/session/active", {
    params: { assignment_id, user_id },
  });
  return response.data.sessionExists;
};

export const fetchSessionsByUser = async (user_id) => {
  const response = await axios.get(`/session`, {
    params: { user_id },
  });
  return response.data;
};
