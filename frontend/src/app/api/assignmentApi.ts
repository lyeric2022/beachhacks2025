import axios from "axios";

// Define interface for assignment data
interface Assignment {
  id?: number;
  title: string;
  description?: string;
  due_date: string;
  user_id: number;
  course?: string;
  priority?: string;
  status?: string;
  completion?: number;
}

// Set the default base URL once
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7777/api";

export const fetchAssignmentsByUser = async (userId: number): Promise<Assignment[]> => {
  const response = await axios.get(`/assignments?user_id=${userId}`);
  return response.data;
};

export const addAssignment = async (assignment: Assignment): Promise<Assignment> => {
  const response = await axios.post(`/assignments`, assignment);
  return response.data;
};

export const updateAssignmentStatus = async (id: number, status: string): Promise<Assignment> => {
  const response = await axios.put(`/assignments/${id}`, { status });
  return response.data;
};

export const updateAssignment = async (id: number, updatedData: Partial<Assignment>): Promise<Assignment> => {
  const response = await axios.put(`/assignments/${id}`, updatedData);
  return response.data;
};

export const deleteAssignment = async (id: number): Promise<void> => {
  const response = await axios.delete(`/assignments/${id}`);
  return response.data;
};
