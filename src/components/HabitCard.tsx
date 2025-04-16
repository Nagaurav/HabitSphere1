
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, MoreHorizontal, Flame, Calendar } from "lucide-react";
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
      "overflow-hidden transition-all duration-200 hover:shadow-md",
      habit.completedToday 
        ? "border-primary/30 bg-primary/5" 
        : "border-border bg-card hover:border-muted"
    )}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg p-1.5 rounded-full bg-muted/50">{getCategoryIcon(habit.category)}</span>
              <h3 className="font-semibold text-lg">{habit.title}</h3>
            </div>
            
            {habit.description && (
              <p className="text-muted-foreground text-sm mb-3 mt-1">{habit.description}</p>
            )}
          </div>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 bg-muted/30 px-2.5 py-1 rounded-full">
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
              habit.completedToday 
                ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={() => onComplete(habit.id)}
            disabled={habit.completedToday}
          >
            {habit.completedToday ? (
              <>
                <Check className="h-4 w-4 mr-1" /> Completed
              </>
            ) : (
              "Complete"
            )}
          </Button>
        </div>
        
        <div className="flex items-center mt-4 pt-4 border-t border-border/40">
          <ProgressChart 
            percentage={completionRate} 
            size={56}
            className="mr-3"
          />
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
              <p className="text-xs text-muted-foreground">Last 7 days:</p>
            </div>
            <StreakCalendar completionHistory={habit.completionHistory} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCard;
