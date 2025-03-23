// components/Dashboard.jsx
"use client";
import { useEffect, useState } from "react";
import WeeklyProductivityChart from "@/components/WeeklyProductivityChart";

const Dashboard = () => {
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [today, setToday] = useState([]);

  useEffect(() => {
    // fetchWeeklyStats()
    // fetchUpcomingAssignments()
    // fetchTodayAgenda()
  }, []);

  const weekData = [
    { day: "Mon", hours: 4.2 },
    { day: "Tue", hours: 3.1 },
    { day: "Wed", hours: 2.5 },
    { day: "Thu", hours: 5.0 },
    { day: "Fri", hours: 3.8 },
    { day: "Sat", hours: 2.0 },
    { day: "Sun", hours: 1.2 },
  ];

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
        <ul className="space-y-4">
          {today.length === 0 ? (
            <p className="text-zinc-400">No sessions planned today</p>
          ) : (
            today.map((task) => (
              <li key={task.id} className="border-b pb-2">
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-zinc-500">
                  {task.course} · Started:{" "}
                  {new Date(task.start_time).toLocaleTimeString()}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
