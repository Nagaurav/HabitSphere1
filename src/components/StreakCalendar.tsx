
import React from "react";
import { CompletionRecord } from "@/lib/habits";
import { cn } from "@/lib/utils";

interface StreakCalendarProps {
  completionHistory: CompletionRecord[];
  limit?: number;
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({ 
  completionHistory,
  limit = 7
}) => {
  // Only show the most recent records up to the limit
  const recentHistory = [...completionHistory]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return (
    <div className="flex items-center justify-between mt-2 gap-1">
      {recentHistory.map((record, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className={cn(
              "streak-dot",
              record.completed ? "streak-dot-completed" : "streak-dot-missed"
            )}
            title={`${record.date}: ${record.completed ? 'Completed' : 'Missed'}`}
          />
          <span className="text-xs text-muted-foreground mt-1">
            {new Date(record.date).getDate()}
          </span>
        </div>
      ))}
      
      {/* Fill in empty spaces if we don't have enough history */}
      {Array.from({ length: Math.max(0, limit - recentHistory.length) }).map((_, i) => (
        <div key={`empty-${i}`} className="flex flex-col items-center">
          <div className="streak-dot streak-dot-future" />
          <span className="text-xs text-muted-foreground mt-1">-</span>
        </div>
      ))}
    </div>
  );
};

export default StreakCalendar;
