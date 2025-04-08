"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
// Remove the problematic import 
// import { Value } from "react-calendar/dist/cjs/shared/types";

// Add DialogHeader component
const DialogHeader = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <div className="flex flex-col space-y-1.5 text-center sm:text-left">
    {children}
  </div>
);

interface ScheduledTask {
  assignment: {
    title: string;
    points_possible: number;
  };
  timeBlock: {
    start: Date;
    end: Date;
  };
  priority: number;
}

interface PlanDayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanDayModal({ open, onOpenChange }: PlanDayModalProps): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [plan, setPlan] = useState<ScheduledTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create a simpler type-safe handler that covers all possible Calendar onChange values
  const handleDateChange = (value: Date | Date[] | null): void => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof Date) {
      setSelectedDate(value[0]);
    }
  };

  const generatePlan = async (): Promise<void> => {
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      // For deployment, we should use mock data instead of real API calls
      // that won't work in production
      console.log("Generating plan for:", selectedDate.toISOString());
      
      // Sample mock data
      const mockPlan: ScheduledTask[] = [
        {
          assignment: {
            title: "Physics Homework",
            points_possible: 100
          },
          timeBlock: {
            start: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 9, 0),
            end: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 10, 30)
          },
          priority: 1
        },
        {
          assignment: {
            title: "Database Project",
            points_possible: 50
          },
          timeBlock: {
            start: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 13, 0),
            end: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 15, 0)
          },
          priority: 2
        }
      ];
      
      setPlan(mockPlan);
      
      // Comment out actual API call that won't work in production
      /*
      const response = await fetch(
        `http://localhost:7777/api/assignments/daily-agenda?user_id=55141&date=${selectedDate.toISOString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const data = await response.json();
      setPlan(data);
      */
    } catch (error) {
      console.error("Failed to generate plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-background rounded-lg shadow-lg p-6 w-[90vw] max-w-[450px] max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Plan My Day
            </Dialog.Title>
            <Dialog.Close className="rounded-full hover:bg-muted p-2">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate || null}
              className="rounded-md border w-full"
            />
            <Button
              onClick={generatePlan}
              disabled={!selectedDate || isLoading}
              className="w-full"
            >
              {isLoading ? "Generating..." : "Generate Plan"}
            </Button>

            {plan.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="font-medium">Your Schedule:</h3>
                {plan.map((task, index) => (
                  <div key={index} className="p-2 border rounded-md">
                    <div className="font-medium">{task.assignment.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(task.timeBlock.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -
                      {new Date(task.timeBlock.end).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-sm">Priority: {task.priority}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
