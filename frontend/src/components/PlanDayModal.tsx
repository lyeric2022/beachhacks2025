'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [plan, setPlan] = useState<ScheduledTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generatePlan = async () => {
    if (!selectedDate) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/assignments/daily-agenda', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: "55141",
          date: selectedDate.toISOString()
        })
      });
      
      const data = await response.json();
      setPlan(data);
    } catch (error) {
      console.error('Failed to generate plan:', error);
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
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
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
                  <div 
                    key={index}
                    className="p-2 border rounded-md"
                  >
                    <div className="font-medium">{task.assignment.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(task.timeBlock.start).toLocaleTimeString()} - 
                      {new Date(task.timeBlock.end).toLocaleTimeString()}
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