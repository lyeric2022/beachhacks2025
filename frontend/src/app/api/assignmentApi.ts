import axios from "axios";

// Set the default base URL once
axios.defaults.baseURL = "http://localhost:7777/api";

export const fetchAssignmentsByUser = async (userId) => {
  const response = await axios.get(`/assignments?user_id=${userId}`);
  return response.data;
};

export const addAssignment = async (assignment) => {
  const response = await axios.post(`/assignments`, assignment);
  return response.data;
};

export const updateAssignmentStatus = async (id, status) => {
  const response = await axios.put(`/assignments/${id}`, { status });
  return response.data;
};

export const updateAssignment = async (id, updatedData) => {
  const response = await axios.put(`/assignments/${id}`, updatedData);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await axios.delete(`/assignments/${id}`);
  return response.data;
};
