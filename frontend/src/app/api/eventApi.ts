import axios from "axios";

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  description?: string;
}

// Comment out real API base URL
// const API_BASE_URL = "http://localhost:7777/api/assignments";

// Mock events data
const mockEvents = [
  {
    id: "1",
    title: "Physics Study Session",
    start_time: "2024-05-20T10:00:00Z",
    end_time: "2024-05-20T12:00:00Z",
    description: "Review Chapter 5"
  },
  {
    id: "2",
    title: "Group Project Meeting",
    start_time: "2024-05-21T15:00:00Z",
    end_time: "2024-05-21T16:30:00Z",
    description: "Discuss database design"
  },
  {
    id: "3",
    title: "CS Midterm",
    start_time: "2024-05-22T09:00:00Z",
    end_time: "2024-05-22T11:00:00Z",
    description: "Algorithms and data structures"
  }
];

export const fetchEvents = async (userId: string): Promise<Event[]> => {
  console.log("Mock: Fetching events for user", userId);
  return mockEvents;
  
  // Original code (commented out):
  // try {
  //   const response = await axios.get(
  //     `${API_BASE_URL}/events/today?user_id=${userId}`
  //   );
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching events:", error);
  //   return [];
  // }
};

export const fetchEventsByDate = async (
  userId: string,
  date: Date
): Promise<Event[]> => {
  console.log("Mock: Fetching events by date", userId, date);
  return mockEvents;
  
  // Original code (commented out):
  // try {
  //   const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  //   const response = await axios.get(`${API_BASE_URL}/events/by-date`, {
  //     params: {
  //       user_id: userId,
  //       date: formattedDate,
  //     },
  //   });
  //   return response.data || []; // Return empty array if no data
  // } catch (error) {
  //   console.error("Error fetching events by date:", error);
  //   return []; // Always return an array
  // }
};
