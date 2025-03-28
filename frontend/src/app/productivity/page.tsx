"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import TimerTaskCard from "@/components/TaskTimerCard";
import { fetchSessionsByUser } from "../api/sessionApi";
import { updateSession } from "../api/sessionApi";

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
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const userId = 55141;
        const rawData = await fetchSessionsByUser(userId);

        // 🔁 Group and aggregate by assignment_id
        const taskMap = new Map();

        rawData.forEach((session) => {
          const key = session.assignment_id;
          const duration = session.duration || 0;

          if (!taskMap.has(key)) {
            taskMap.set(key, {
              ...session,
              duration: duration,
            });
          } else {
            const existing = taskMap.get(key);
            taskMap.set(key, {
              ...existing,
              duration: existing.duration + duration,
              start_time: existing.start_time
                ? new Date(
                    Math.min(
                      new Date(existing.start_time).getTime(),
                      new Date(session.start_time).getTime()
                    )
                  ).toISOString()
                : session.start_time,
              end_time: existing.end_time
                ? new Date(
                    Math.max(
                      new Date(existing.end_time).getTime(),
                      new Date(session.end_time).getTime()
                    )
                  ).toISOString()
                : session.end_time,
              status: session.is_active ? "In Progress" : existing.status,
              is_active: session.is_active || existing.is_active,
            });
          }
        });

        setTasks(Array.from(taskMap.values()));
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
  }, [remainingTime]);

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
    <div className="container mx-10 my-10 overflow-scroll">
      <div>
        <div className="font-bold text-2xl my-8">Productivitiy Tool</div>
        <div className={styles.content}>
          <div>
            <div className={styles.left}>
              <div className={styles.headerinner}>Pomodoro Timer</div>
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
            </div>
          </div>
          <div className="space-y-4 overflow-scroll">
            {tasks
              .filter((task) => task.status !== "Completed") // ✅ Filter out completed tasks
              .map((task) => (
                <TimerTaskCard
                  key={task.id}
                  task={task}
                  onUpdate={async (updatedTask, id) => {
                    try {
                      await updateSession(id, {
                        status: updatedTask.status,
                        is_active: updatedTask.is_active,
                        end_time: updatedTask.end_time,
                        duration: updatedTask.duration, // ✅ add this line
                      });
                    } catch (err) {
                      console.error("Failed to update session:", err);
                    }

                    setTasks((prev) =>
                      updatedTask.status === "Completed"
                        ? prev.filter((t) => t.id !== id)
                        : prev.map((t) => (t.id === id ? updatedTask : t))
                    );
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
