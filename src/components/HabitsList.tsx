
import React from "react";
import HabitCard from "./HabitCard";
import { Habit } from "@/lib/habits";

interface HabitsListProps {
  habits: Habit[];
  onCompleteHabit: (habitId: string) => void;
}

const HabitsList: React.FC<HabitsListProps> = ({ habits, onCompleteHabit }) => {
  if (habits.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-muted">
        <p className="text-muted-foreground">No habits found. Start by creating new habits!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 animate-fade-in">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onComplete={onCompleteHabit}
        />
      ))}
    </div>
  );
};

export default HabitsList;
