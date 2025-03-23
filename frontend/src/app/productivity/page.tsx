"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import TimerTaskCard from "@/components/TaskTimerCard";
import { fetchSessionsByUser } from "../api/sessionApi";

const TIMER_PRESETS = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const page = () => {
  const [mode, setMode] = useState<"pomodoro" | "short" | "long">("pomodoro");
  const [initialTime, setInitialTime] = useState(TIMER_PRESETS[mode]);
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(true);
  const [sessions, setSessions] = useState(0);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const userId = 55141; // Replace with actual auth user ID
        const data = await fetchSessionsByUser(userId);
        setTasks(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    loadSessions();
  }, []);

  useEffect(() => {
    setInitialTime(TIMER_PRESETS[mode]);
    setRemainingTime(TIMER_PRESETS[mode]);
    setProgress(100);
    setIsPaused(true); // Pause when switching mode
  }, [mode]);

  useEffect(() => {
    let interval: any;

    if (!isPaused) {
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, mode]);

  useEffect(() => {
    const progressValue = (remainingTime / initialTime) * 100;
    setProgress(progressValue);
  }, [remainingTime, initialTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    console.log("toggling");
    setIsPaused((prev) => !prev);
  };

  const handleModeChange = (newMode: "pomodoro" | "short" | "long") => {
    setMode(newMode);
  };

  return (
    <div className={`${styles.container}`}>
      <div>
        <div className={styles.header}>Header</div>
        <div className={styles.content}>
          <div>
            <div className={styles.left}>
              <div className={styles.headerinner}>Pomodo Timer</div>
              <div className={styles.timer}>
                <div className={styles.timerInner}>
                  <CircularProgressbar
                    value={progress}
                    text={formatTime(remainingTime)}
                  />
                </div>
              </div>
              <div className={styles.breaks}>
                <Button
                  style={{ width: "25%" }}
                  variant={mode === "pomodoro" ? "default" : "ghost"}
                  onClick={() => handleModeChange("pomodoro")}
                >
                  Pomodoro
                </Button>
                <Button
                  style={{ width: "25%" }}
                  variant={mode === "short" ? "default" : "ghost"}
                  onClick={() => handleModeChange("short")}
                >
                  Short Break
                </Button>
                <Button
                  style={{ width: "25%" }}
                  variant={mode === "long" ? "default" : "ghost"}
                  onClick={() => handleModeChange("long")}
                >
                  Long Break
                </Button>
              </div>
              <div className={styles.startreset}>
                {isPaused ? (
                  <Button onClick={toggleTimer}>Start</Button>
                ) : (
                  <Button variant="outline" onClick={toggleTimer}>
                    Pause
                  </Button>
                )}
              </div>
              {mode === "pomodoro" && (
                <div className={styles.sessions}>
                  Sessions Completed: <strong>{sessions}</strong>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {tasks.map((task) => (
              <TimerTaskCard
                key={task.id}
                task={task}
                onUpdate={(updatedTask) => {
                  console.log("📝 Updated Task:", updatedTask);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
