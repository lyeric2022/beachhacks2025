import axios from "axios";

axios.defaults.baseURL = "http://localhost:7777/api";

export const fetchCourses = async () => {
  const response = await axios.get("/courses");
  return response.data;
};
