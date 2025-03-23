"use client";

import { useState, useEffect } from "react";

const TimerTaskCard = ({ task, onUpdate }) => {
  const [status, setStatus] = useState(task.status);
  const [startTime, setStartTime] = useState(
    task.start_time ? new Date(task.start_time) : null
  );
  const [endTime, setEndTime] = useState(
    task.end_time ? new Date(task.end_time) : null
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}h ${secs}m`;
  };

  const startTimer = () => {
    const now = new Date();
    setStatus("Running");
    setEndTime(null);

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    setIntervalId(interval);

    if (onUpdate) {
      onUpdate({
        ...task,
        start_time: task.start_time,
        end_time: null,
        is_active: true,
        status: "Running",
      });
    }
  };

  const pauseTimer = () => {
    clearInterval(intervalId);
    const now = new Date();
    setEndTime(now);
    setStatus("Paused");
    setIntervalId(null);

    if (onUpdate) {
      onUpdate({
        ...task,
        end_time: now.toISOString(),
        is_active: false,
        status: "Paused",
      });
    }
  };

  const stopTimer = () => {
    clearInterval(intervalId);
    const now = new Date();
    setEndTime(now);
    setStatus("Completed");
    setIntervalId(null);

    if (onUpdate) {
      onUpdate({
        ...task,
        end_time: now.toISOString(),
        is_active: false,
        status: "Completed",
      });
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, [intervalId]);

  return (
    <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">{task.title}</h2>
        <p className="text-sm text-gray-500">{task.course}</p>
        <p className="text-sm mt-2">
          <span className="font-medium">Started:</span>{" "}
          {startTime ? startTime.toLocaleTimeString() : "--"}
        </p>
        <p className="text-sm">
          <span className="font-medium">Duration:</span>{" "}
          {formatDuration(elapsedSeconds)}
        </p>
        <p className="text-sm">
          <span className="font-medium">Status:</span> {status}
        </p>
      </div>
      <div className="flex space-x-2">
        {status !== "Running" ? (
          <button
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg"
            onClick={startTimer}
          >
            ▶ Resume
          </button>
        ) : (
          <button
            className="bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-lg"
            onClick={pauseTimer}
          >
            ⏸ Pause
          </button>
        )}
        <button
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={stopTimer}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

export default TimerTaskCard;
