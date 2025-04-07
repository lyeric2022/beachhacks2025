"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import TimerTaskCard from "@/components/TaskTimerCard";
import { fetchSessionsByUser, updateSession } from "../api/sessionApi";

const TIMER_PRESETS = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

interface SessionTask {
  id: number;
  assignment_id: number;
  user_id: number;
  duration: number;
  start_time?: string;
  end_time?: string;
  status: string;
  is_active: boolean;
  assignments?: {
    title: string;
    courses?: {
      title: string;
    }
  }
}

const ProductivityPage = (): React.JSX.Element => {
  const [mode, setMode] = useState<"pomodoro" | "short" | "long">("pomodoro");
  const [initialTime, setInitialTime] = useState(TIMER_PRESETS[mode]);
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(true);
  const [tasks, setTasks] = useState<SessionTask[]>([]);

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
              start_time: existing.start_time && session.start_time
                ? new Date(
                    Math.min(
                      new Date(existing.start_time).getTime(),
                      new Date(session.start_time).getTime()
                    )
                  ).toISOString()
                : existing.start_time || session.start_time,
              end_time: existing.end_time && session.end_time
                ? new Date(
                    Math.max(
                      new Date(existing.end_time).getTime(),
                      new Date(session.end_time).getTime()
                    )
                  ).toISOString()
                : existing.end_time || session.end_time,
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
    let interval: NodeJS.Timeout | undefined;

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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const toggleTimer = (): void => {
    console.log("toggling");
    setIsPaused((prev) => !prev);
  };

  const handleModeChange = (newMode: "pomodoro" | "short" | "long"): void => {
    setMode(newMode);
  };

  return (
    <div className="container mx-10 my-10 overflow-scroll">
      <div>
        <div className="font-bold text-2xl my-8">Productivity Tool</div>
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
              .filter((task: SessionTask) => task.status !== "Completed")
              .map((task: SessionTask) => (
                <TimerTaskCard
                  key={task.id}
                  task={task}
                  onUpdate={async (updatedTask: SessionTask, id: number) => {
                    try {
                      await updateSession(id, {
                        status: updatedTask.status,
                        is_active: updatedTask.is_active,
                        end_time: updatedTask.end_time,
                        duration: updatedTask.duration,
                      });
                    } catch (err) {
                      console.error("Failed to update session:", err);
                    }

                    setTasks((prev: SessionTask[]) =>
                      prev.map((t: SessionTask) =>
                        t.id === id ? updatedTask : t
                      )
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

export default ProductivityPage;
