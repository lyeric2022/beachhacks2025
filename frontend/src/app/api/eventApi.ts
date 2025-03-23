import axios from "axios";

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  description?: string;
}

const API_BASE_URL = "http://localhost:7777/api/assignments";

export const fetchEvents = async (userId: string): Promise<Event[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/events/today?user_id=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const fetchEventsByDate = async (
  userId: string,
  date: Date
): Promise<Event[]> => {
  try {
    const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const response = await axios.get(`${API_BASE_URL}/events/by-date`, {
      params: {
        user_id: userId,
        date: formattedDate,
      },
    });
    return response.data || []; // Return empty array if no data
  } catch (error) {
    console.error("Error fetching events by date:", error);
    return []; // Always return an array
  }
};
