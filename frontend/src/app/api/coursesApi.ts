import axios from "axios";

// Comment out real API base URL
// axios.defaults.baseURL = "http://localhost:7777/api";

export const fetchCourses = async () => {
  // Return mock data
  return [
    { id: 1, title: "Physics 101" },
    { id: 2, title: "CS 401" },
    { id: 3, title: "History 201" },
    { id: 4, title: "MATH 250" },
    { id: 5, title: "CHEM 110" }
  ];
  
  // Original code (commented out):
  // const response = await axios.get("/courses");
  // return response.data;
};
