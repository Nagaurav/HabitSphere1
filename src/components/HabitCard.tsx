
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, MoreHorizontal, Flame } from "lucide-react";
import StreakCalendar from "./StreakCalendar";
import { Habit, getCategoryIcon, calculateCompletionRate } from "@/lib/habits";
import { cn } from "@/lib/utils";
import ProgressChart from "./ProgressChart";

interface HabitCardProps {
  habit: Habit;
  onComplete: (habitId: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onComplete }) => {
  const completionRate = calculateCompletionRate(habit);
  
  return (
    <Card className={cn(
      "habit-card overflow-hidden transition-all",
      habit.completedToday && "habit-card-active"
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{getCategoryIcon(habit.category)}</span>
              <h3 className="font-medium text-lg">{habit.title}</h3>
            </div>
            
            {habit.description && (
              <p className="text-muted-foreground text-sm mb-3">{habit.description}</p>
            )}
          </div>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">
              {habit.streak} day streak
            </span>
          </div>
          
          <Button 
            variant={habit.completedToday ? "ghost" : "default"}
            size="sm"
            className={cn(
              "transition-all",
              habit.completedToday && "bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700"
            )}
            onClick={() => onComplete(habit.id)}
            disabled={habit.completedToday}
          >
            {habit.completedToday ? (
              <>
                <Check className="h-4 w-4 mr-1" /> Done
              </>
            ) : (
              "Complete"
            )}
          </Button>
        </div>
        
        <div className="flex items-center mt-4 pt-4 border-t border-border/40">
          <ProgressChart 
            percentage={completionRate} 
            size={60}
            className="mr-3"
          />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Last 7 days:</p>
            <StreakCalendar completionHistory={habit.completionHistory} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCard;
