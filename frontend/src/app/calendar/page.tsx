"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchEvents, fetchEventsByDate } from "@/app/api/eventApi";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Calendar } from "@/components/ui/calendar"
import { PlanDayModal } from "@/components/PlanDayModal";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

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

// export function PlanDayModal({ open, onOpenChange }: PlanDayModalProps) {
//   const [selectedDate, setSelectedDate] = useState<Date>();
//   const [plan, setPlan] = useState<ScheduledTask[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const generatePlan = async () => {
//     if (!selectedDate) return;

//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/assignments/daily-agenda', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: "55141",
//           date: selectedDate.toISOString()
//         })
//       });

//       const data = await response.json();
//       setPlan(data);
//     } catch (error) {
//       console.error('Failed to generate plan:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Plan My Day</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <Calendar
//             mode="single"
//             selected={selectedDate}
//             onSelect={setSelectedDate}
//             className="rounded-md border"
//           />
//           <Button
//             onClick={generatePlan}
//             disabled={!selectedDate || isLoading}
//           >
//             {isLoading ? "Generating..." : "Generate Plan"}
//           </Button>

//           {plan.length > 0 && (
//             <div className="mt-4 space-y-2">
//               <h3 className="font-medium">Your Schedule:</h3>
//               {plan.map((task, index) => (
//                 <div
//                   key={index}
//                   className="p-2 border rounded-md"
//                 >
//                   <div className="font-medium">{task.assignment.title}</div>
//                   <div className="text-sm text-muted-foreground">
//                     {new Date(task.timeBlock.start).toLocaleTimeString()} -
//                     {new Date(task.timeBlock.end).toLocaleTimeString()}
//                   </div>
//                   <div className="text-sm">Priority: {task.priority}</div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week">("month");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dayEvents, setDayEvents] = useState<{ [key: string]: Event[] }>({});
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
        const fetchedEvents = await fetchEventsByDate(
          "55141",
          startOfMonth,
          endOfMonth
        );
        // Transform the dates from strings to Date objects
        const transformedEvents = fetchedEvents.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(transformedEvents);
        console.log("Events loaded:", transformedEvents);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [currentDate]);

  useEffect(() => {
    console.log("events here");
    console.log(events);
  }, [events]);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add padding for days from previous month
    for (let i = 0; i < firstDay.getDay(); i++) {
      const date = new Date(year, month, -i);
      days.unshift({ date, isPadding: true });
    }

    // Add days of current month
    for (
      let date = new Date(firstDay);
      date <= lastDay;
      date.setDate(date.getDate() + 1)
    ) {
      days.push({ date: new Date(date), isPadding: false });
    }

    return days;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const days = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentDate]);

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  const loadDayEvents = async (date: Date) => {
    const dateKey = date.toISOString().split("T")[0];
    if (!dayEvents[dateKey]) {
      try {
        const events = await fetchEventsByDate("55141", date);
        const transformedEvents = events.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setDayEvents((prev) => ({
          ...prev,
          [dateKey]: transformedEvents,
        }));
      } catch (error) {
        console.error("Error loading day events:", error);
        setDayEvents((prev) => ({
          ...prev,
          [dateKey]: [],
        }));
      }
    }
  };

  useEffect(() => {
    if (view === "month") {
      daysInMonth.forEach(({ date }) => loadDayEvents(date));
    } else {
      weekDays.forEach((date) => loadDayEvents(date));
    }
  }, [view, currentDate]);

  const getDayEvents = (date: Date): Event[] => {
    const dateKey = date.toISOString().split("T")[0];
    return dayEvents[dateKey] || [];
  };

  return (
    <div className="container mx-auto p-6">
      <div className="border rounded-lg shadow-sm bg-background p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  view === "month"
                    ? navigateMonth("prev")
                    : navigateWeek("prev")
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  view === "month"
                    ? navigateMonth("next")
                    : navigateWeek("next")
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-x-2">
            <Button variant="default" onClick={() => setIsPlanModalOpen(true)}>
              Plan My Day
            </Button>
            <Button
              variant={view === "month" ? "default" : "outline"}
              onClick={() => setView("month")}
            >
              Month
            </Button>
            <Button
              variant={view === "week" ? "default" : "outline"}
              onClick={() => setView("week")}
            >
              Week
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="bg-background p-2 text-center font-medium"
            >
              {day}
            </div>
          ))}

          {view === "month"
            ? daysInMonth.map(({ date, isPadding }, index) => (
                <div
                  key={date.toISOString()}
                  className={`min-h-[100px] bg-background p-2 ${
                    isPadding ? "text-muted-foreground" : ""
                  } ${
                    date.toDateString() === new Date().toDateString()
                      ? "bg-muted"
                      : ""
                  }`}
                >
                  <div className="font-medium">{date.getDate()}</div>
                  <div className="space-y-1 mt-1">
                    {getDayEvents(date).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs bg-primary/10 text-primary p-1 rounded"
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : weekDays.map((date) => (
                <div
                  key={date.toISOString()}
                  className={`min-h-[600px] bg-background p-2 ${
                    date.toDateString() === new Date().toDateString()
                      ? "bg-muted"
                      : ""
                  }`}
                >
                  <div className="font-medium">{date.getDate()}</div>
                  <div className="space-y-1 mt-1">
                    {getDayEvents(date).map((event) => (
                      <div
                        key={event.id}
                        className="text-xs bg-primary/10 text-primary p-1 rounded"
                      >
                        {event.title}
                        <div className="text-muted-foreground">
                          {event.start.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
        </div>
      </div>

      <PlanDayModal open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen} />
    </div>
  );
}
