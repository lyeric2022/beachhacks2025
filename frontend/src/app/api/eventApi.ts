import axios from "axios";

interface Event {
  id: string;
  title: string;
  start: string;  // Change from start_time
  end: string;    // Change from end_time
  description?: string;
}

// Comment out real API base URL
// const API_BASE_URL = "http://localhost:7777/api/assignments";

// Mock events data
const mockEvents = [
  {
    id: "1",
    title: "Physics Study Session",
    start: "2024-05-20T10:00:00Z", // Rename from start_time to start
    end: "2024-05-20T12:00:00Z",   // Rename from end_time to end
    description: "Review Chapter 5"
  },
  {
    id: "2",
    title: "Group Project Meeting",
    start: "2024-05-21T15:00:00Z",
    end: "2024-05-21T16:30:00Z",
    description: "Discuss database design"
  },
  {
    id: "3",
    title: "CS Midterm",
    start: "2024-05-22T09:00:00Z",
    end: "2024-05-22T11:00:00Z",
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

// Update the fetchEventsByDate function to accept an optional endDate parameter
export const fetchEventsByDate = async (
  userId: string,
  date: Date,
  endDate?: Date  // Add the optional endDate parameter
): Promise<Event[]> => {
  console.log("Mock: Fetching events by date", userId, date, endDate);
  return mockEvents;
  
  // Original code (commented out):
  // try {
  //   const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  //   const formattedEndDate = endDate ? endDate.toISOString().split("T")[0] : undefined;
  //   const response = await axios.get(`${API_BASE_URL}/events/by-date`, {
  //     params: {
  //       user_id: userId,
  //       date: formattedDate,
  //       end_date: formattedEndDate
  //     },
  //   });
  //   return response.data || []; // Return empty array if no data
  // } catch (error) {
  //   console.error("Error fetching events by date:", error);
  //   return []; // Always return an array
  // }
};
