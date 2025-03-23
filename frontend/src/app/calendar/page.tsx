'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  const events: Event[] = [
    {
      id: '1',
      title: 'Study Session',
      start: new Date(2025, 2, 24, 10, 0),
      end: new Date(2025, 2, 24, 12, 0),
    },
  ];

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
    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
      return newDate;
    });
  };

  const getDayEvents = (date: Date) => {
    console.log(date.toDateString());
    console.log(events.map(event => event.start.toDateString()));
    return events.filter(event => 
      event.start.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="border rounded-lg shadow-sm bg-background p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">
              {currentDate.toLocaleString('default', { 
                month: 'long',
                year: 'numeric'
              })}
            </h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => view === 'month' ? navigateMonth('prev') : navigateWeek('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => view === 'month' ? navigateMonth('next') : navigateWeek('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-x-2">
            <Button
              variant={view === 'month' ? 'default' : 'outline'}
              onClick={() => setView('month')}
            >
              Month
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'outline'}
              onClick={() => setView('week')}
            >
              Week
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-background p-2 text-center font-medium">
              {day}
            </div>
          ))}

          {view === 'month' ? (
            daysInMonth.map(({ date, isPadding }, index) => (
              <div
                key={date.toISOString()}
                className={`min-h-[100px] bg-background p-2 ${
                  isPadding ? 'text-muted-foreground' : ''
                } ${
                  date.toDateString() === new Date().toDateString()
                    ? 'bg-muted'
                    : ''
                }`}
              >
                <div className="font-medium">{date.getDate()}</div>
                <div className="space-y-1 mt-1">
                  {getDayEvents(date).map(event => (
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
          ) : (
            weekDays.map(date => (
              <div
                key={date.toISOString()}
                className={`min-h-[600px] bg-background p-2 ${
                  date.toDateString() === new Date().toDateString()
                    ? 'bg-muted'
                    : ''
                }`}
              >
                <div className="font-medium">{date.getDate()}</div>
                <div className="space-y-1 mt-1">
                  {getDayEvents(date).map(event => (
                    <div
                      key={event.id}
                      className="text-xs bg-primary/10 text-primary p-1 rounded"
                    >
                      {event.title}
                      <div className="text-muted-foreground">
                        {event.start.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}