"use client";

import React, { useState, useEffect, useRef } from "react";
import { updateSession } from "@/app/api/sessionApi";

// Define interfaces for the component props and task object
interface Task {
  id: number;
  assignment_id: number;
  user_id: number;
  duration: number;
  start_time?: string;
  end_time?: string | null;
  status: string;
  is_active: boolean;
  assignments: {
    title: string;
    courses: {
      title: string;
    };
  };
}

interface TimerTaskCardProps {
  task: Task;
  onUpdate: (updatedTask: Task, id: number) => Promise<void>;
}

const TimerTaskCard = ({ task, onUpdate }: TimerTaskCardProps): React.ReactElement => {
  const [status, setStatus] = useState<string>(task.status);
  const [startTime, setStartTime] = useState<Date | null>(
    task.start_time ? new Date(task.start_time) : null
  );
  const [endTime, setEndTime] = useState<Date | null>(
    task.end_time ? new Date(task.end_time) : null
  );

  const [baseElapsedSeconds, setBaseElapsedSeconds] = useState<number>(
    task.duration || 0
  );
  const [liveElapsed, setLiveElapsed] = useState<number>(0); // Live ticking
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      const start = new Date(task.start_time || new Date()).getTime();
      const now = Date.now();
      const resumeSeconds = Math.floor((now - start) / 1000);

      setLiveElapsed(resumeSeconds);

      intervalRef.current = setInterval(() => {
        setLiveElapsed((prev) => prev + 1);
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
    if (liveElapsed > 0 && liveElapsed % 30 === 0) { // Use strict equality
      console.log("updating");
      updateSession(task.id, { duration: total }).catch((err) =>
        console.error("Failed to update duration:", err)
      );
    }
  }, [liveElapsed, baseElapsedSeconds, task.id]);

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const startTimer = async (): Promise<void> => {
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

  const pauseTimer = async (): Promise<void> => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

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

  const stopTimer = async (): Promise<void> => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

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
