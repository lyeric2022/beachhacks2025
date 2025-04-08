"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
type Value = Date | [Date, Date] | null; // Define Value type locally

// Add DialogHeader component
const DialogHeader = ({ children }: { children: React.ReactNode }) => (
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

export function PlanDayModal({ open, onOpenChange }: PlanDayModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [plan, setPlan] = useState<ScheduledTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create a handler function for the Calendar onChange
  const handleDateChange = (value: Value): void => {
    // Check if the value is a Date and set it
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof Date) {
      // Handle date range case (take the first date)
      setSelectedDate(value[0]);
    } else {
      // Handle null or undefined
      setSelectedDate(undefined);
    }
  };

  const generatePlan = async (): Promise<void> => {
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      // Mock data directly instead of making an API call
      console.log("Generating plan for:", selectedDate.toISOString());
      
      // Create some mock data instead of fetching
      const mockPlan: ScheduledTask[] = [
        {
          assignment: {
            title: "Physics Homework",
            points_possible: 100
          },
          timeBlock: {
            start: new Date(selectedDate.setHours(9, 0)),
            end: new Date(selectedDate.setHours(10, 30))
          },
          priority: 1
        },
        {
          assignment: {
            title: "Database Project",
            points_possible: 50
          },
          timeBlock: {
            start: new Date(selectedDate.setHours(13, 0)),
            end: new Date(selectedDate.setHours(15, 0))
          },
          priority: 2
        }
      ];
      
      setPlan(mockPlan);
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
              onChange={handleDateChange} // Use our custom handler
              value={selectedDate}
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
