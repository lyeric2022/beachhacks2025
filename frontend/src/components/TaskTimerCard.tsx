"use client";

import { updateSession } from "@/app/api/sessionApi";
import { useState, useEffect, useRef } from "react";

const TimerTaskCard = ({ task, onUpdate }) => {
  const [status, setStatus] = useState(task.status);
  const [startTime, setStartTime] = useState(
    task.start_time ? new Date(task.start_time) : null
  );
  const [endTime, setEndTime] = useState(
    task.end_time ? new Date(task.end_time) : null
  );

  const [baseElapsedSeconds, setBaseElapsedSeconds] = useState(
    task.duration || 0
  );
  const [liveElapsed, setLiveElapsed] = useState(0); // Live ticking
  const intervalRef = useRef(null);

  useEffect(() => {
    console.log("⏱️ Timer Debug Info:");
    console.log("status:", status);
    console.log("baseElapsedSeconds:", baseElapsedSeconds);
    console.log("liveElapsed:", liveElapsed);
    console.log("total:", baseElapsedSeconds + liveElapsed);
    console.log("intervalRef.current:", intervalRef.current !== null);
  }, [status, liveElapsed, baseElapsedSeconds]);

  useEffect(() => {
    // Reset interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only start ticking if active
    if (task.is_active && task.status === "In Progress") {
      const start = new Date(task.start_time).getTime();
      const now = Date.now();
      const resumeSeconds = Math.floor((now - start) / 1000);

      setLiveElapsed(resumeSeconds);

      intervalRef.current = setInterval(() => {
        setLiveElapsed((prev) => {
          const next = prev + 1;
          return next;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [task.is_active, task.status, task.start_time]);

  useEffect(() => {
    console.log("live", liveElapsed);
    const total = baseElapsedSeconds + liveElapsed;
    console.log(total);
    if (liveElapsed > 0 && liveElapsed % 30 == 0) {
      console.log("updating");
      updateSession(task.id, { duration: total }).catch((err) =>
        console.error("Failed to update duration:", err)
      );
    }
  }, [liveElapsed]);

  // useEffect(() => {
  //   let total = task.duration || 0;

  //   if (task.start_time) {
  //     const start = new Date(task.start_time);
  //     setStartTime(start);

  //     // 🧠 If the task is currently active, calculate how much time has passed since start_time
  //     if (task.is_active && task.status === "In Progress") {
  //       const now = Date.now();
  //       const elapsedSinceStart = Math.floor((now - start.getTime()) / 1000);
  //       setLiveElapsed(elapsedSinceStart);

  //       // Start ticking
  //       if (!intervalId) {
  //         const interval = setInterval(() => {
  //           setLiveElapsed((prev) => prev + 1);
  //         }, 1000);
  //         setIntervalId(interval);
  //       }
  //     }
  //   }
  //   if (task.end_time) {
  //     setEndTime(new Date(task.end_time));
  //   }

  //   setBaseElapsedSeconds(total);
  // }, [task]);

  // useEffect(() => {
  //   const hasActive = task.sessions?.some((s) => s.is_active);
  //   if (hasActive && status === "In Progress" && !intervalId) {
  //     const interval = setInterval(() => {
  //       setLiveElapsed((prev) => prev + 1);
  //     }, 1000);
  //     setIntervalId(interval);
  //   }
  // }, [task.sessions, status, intervalId]);

  // useEffect(() => {
  //   return () => clearInterval(intervalRef.current);
  // }, []);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const startTimer = async () => {
    const now = new Date();
    setStatus("In Progress");
    setEndTime(null);
    setStartTime(now);
    setLiveElapsed(0);

    if (intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setLiveElapsed((prev) => prev + 1);
      }, 1000);
    }

    if (onUpdate) {
      await onUpdate(
        {
          ...task,
          end_time: null,
          is_active: true,
          status: "In Progress",
        },
        task.id
      );
    }
  };

  const pauseTimer = async () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    const now = new Date();
    const total = baseElapsedSeconds + liveElapsed;
    setBaseElapsedSeconds(total);
    setLiveElapsed(0);
    setStatus("Paused");
    setEndTime(now);

    if (onUpdate) {
      await onUpdate(
        {
          ...task,
          status: "Paused",
          end_time: now.toISOString(),
          duration: total,
        },
        task.id
      );
    }
  };

  const stopTimer = async () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    const now = new Date();
    const total = baseElapsedSeconds + liveElapsed;
    setBaseElapsedSeconds(total);
    setLiveElapsed(0);
    setStatus("Completed");
    setEndTime(now);

    if (onUpdate) {
      await onUpdate(
        {
          ...task,
          status: "Completed",
          is_active: false,
          end_time: now.toISOString(),
          duration: total,
        },
        task.id
      );
    }
  };

  return (
    <div className="bg-[#FBFBFB] border-b p-6 mr-2 flex justify-between items-center">
      <div className="w-3/4">
        <h2 className="text-lg font-semibold">{task.assignments.title}</h2>
        <p className="text-sm text-gray-500">
          {task.assignments.courses.title}
        </p>
        <p className="text-sm">
          <span className="font-medium">Duration:</span>{" "}
          {formatDuration(baseElapsedSeconds + liveElapsed)}
        </p>
        <p className="text-sm">
          <span className="font-medium">Status:</span> {status}
        </p>
      </div>
      <div className="flex space-x-2 w-1/4">
        {status !== "In Progress" ? (
          <button
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer"
            onClick={startTimer}
          >
            Resume
          </button>
        ) : (
          <button
            className="bg-zinc-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg cursor-pointer"
            onClick={pauseTimer}
          >
            Pause
          </button>
        )}
        <button
          className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer"
          onClick={stopTimer}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default TimerTaskCard;
