// components/Dashboard.jsx
"use client";
import { useEffect, useState } from "react";
import WeeklyProductivityChart from "@/components/WeeklyProductivityChart";
import { BookOpen, Clock } from "lucide-react";

const formatTime = (timeString: string): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
};

interface WeeklyStats {
  day: string;
  hours: number;
}

const Dashboard: React.FC = () => {
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [upcoming, setUpcoming] = useState<Array<{
    id: number;
    title: string;
    due_date: string;
    course: string;
  }>>([
    {
      id: 1,
      title: "Physics Homework",
      due_date: "2024-03-25T23:59:00",
      course: "PHYS 151"
    },
    {
      id: 2,
      title: "Database Project",
      due_date: "2024-03-26T15:00:00",
      course: "CECS 323"
    },
    {
      id: 3,
      title: "Final Essay",
      due_date: "2024-03-27T12:00:00",
      course: "ENGL 100"
    }
  ]);
  const [today, setToday] = useState<Array<{
    id: number;
    title: string;
    course: string;
    start_time: string;
    end_time: string;
    status: string;
  }>>([
    {
      id: 1,
      title: "Study Session - Physics",
      course: "PHYS 151",
      start_time: "2024-03-23T09:00:00",
      end_time: "2024-03-23T10:30:00",
      status: "active"
    },
    {
      id: 2,
      title: "Group Project Meeting",
      course: "CECS 323",
      start_time: "2024-03-23T13:00:00",
      end_time: "2024-03-23T14:30:00",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Essay Writing",
      course: "ENGL 100",
      start_time: "2024-03-23T15:00:00",
      end_time: "2024-03-23T16:30:00",
      status: "upcoming"
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement these API calls when backend is ready
    // fetchWeeklyStats()
    // fetchUpcomingAssignments()
    // fetchTodayAgenda()
    
    // For now, just simulate data loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const weekData: WeeklyStats[] = [
    { day: "Mon", hours: 4.2 },
    { day: "Tue", hours: 3.1 },
    { day: "Wed", hours: 2.5 },
    { day: "Thu", hours: 5.0 },
    { day: "Fri", hours: 3.8 },
    { day: "Sat", hours: 2.0 },
    { day: "Sun", hours: 1.2 },
  ];

  // Update the status badge in the agenda items
  const getStatusBadge = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-10 my-10 overflow-scroll">
      <div className="my-8">
        <h1 className="text-2xl font-bold text-zinc-800 mb-6">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
          <WeeklyProductivityChart data={weekData} />
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
          <h2 className="text-xl font-semibold mb-4 text-zinc-700">
            Upcoming Deadlines
          </h2>
          <ul className="space-y-4">
            {upcoming.length === 0 ? (
              <p className="text-zinc-400">No upcoming deadlines</p>
            ) : (
              upcoming.map((item) => (
                <li key={item.id} className="border-b pb-2">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-zinc-500">
                    Due: {new Date(item.due_date).toLocaleString()}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Today’s Agenda */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 mt-6">
        <h2 className="text-xl font-semibold mb-4 text-zinc-700">
          Today’s Agenda
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border rounded-lg p-4">
                <div className="h-4 bg-green-50 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-green-50 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {today.length === 0 ? (
              <div className="col-span-full py-8 text-center rounded-lg border-2 border-dashed border-green-200 bg-green-50 bg-opacity-30">
                <p className="text-zinc-600 mb-2">No sessions planned today</p>
                <button className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium px-4 py-2 rounded-full border border-green-200 hover:bg-green-100 transition-all">
                  + Add Study Session
                </button>
              </div>
            ) : (
              today.map((task) => (
                <li key={task.id} className="border rounded-lg p-4 hover:border-green-300 hover:bg-green-50 transition-all hover:-translate-y-1 duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-zinc-800">{task.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {task.course}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(task.start_time)} - {formatTime(task.end_time)}
                  </p>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
