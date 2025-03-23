// components/Dashboard.jsx
"use client";
import { useEffect, useState } from "react";
import WeeklyProductivityChart from "@/components/WeeklyProductivityChart";
import { Calendar, Clock, BookOpen, AlertCircle, TrendingUp } from "lucide-react";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [upcoming, setUpcoming] = useState([
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
  const [today, setToday] = useState([
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
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // fetchWeeklyStats()
    // fetchUpcomingAssignments()
    // fetchTodayAgenda()
    
    return () => clearTimeout(timer);
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

  // Format time function
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Update the status badge in the agenda items
  const getStatusBadge = (status) => {
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Dashboard</h1>
        <p className="text-zinc-600 mt-2">Track your productivity and upcoming tasks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Productivity Chart */}
        <div className={`col-span-1 lg:col-span-2 ${styles.card}`} style={{borderTop: "4px solid #3b82f6"}}>
          <h2 className={styles.cardTitle}>
            <Calendar className={styles.icon} size={20} />
            Weekly Overview
          </h2>
          <div className="h-[300px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse bg-blue-100 rounded-md h-[250px] w-full"></div>
              </div>
            ) : (
              <WeeklyProductivityChart data={weekData} showTitle={false} />
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className={styles.card} style={{borderTop: "4px solid #ef4444"}}>
          <h2 className={styles.cardTitle} style={{color: "#b91c1c"}}>
            <AlertCircle className={styles.icon} size={20} />
            Upcoming Deadlines
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-red-50 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-red-50 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-4 divide-y divide-zinc-100">
              {upcoming.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-zinc-500 mb-2">No upcoming deadlines</p>
                  <p className="text-zinc-400 text-sm">Enjoy your free time!</p>
                </div>
              ) : (
                upcoming.map((item) => (
                  <li key={item.id} className="pt-3 pb-3 group transition-all hover:translate-x-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium group-hover:text-red-600 transition-colors">{item.title}</h3>
                      <span className="text-xs font-medium px-2 py-1 bg-red-50 text-red-600 rounded-full">
                        {new Date(item.due_date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Due: {new Date(item.due_date).toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Today's Agenda */}
      <div className={`${styles.card} mt-8`} style={{borderTop: "4px solid #10b981"}}>
        <h2 className={styles.cardTitle} style={{color: "#047857"}}>
          <BookOpen className={styles.icon} size={20} />
          Today's Agenda
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
