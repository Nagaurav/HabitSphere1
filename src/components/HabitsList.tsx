
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
      <div className="text-center py-12">
        <p className="text-muted-foreground">No habits found. Start creating new habits!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 animate-slide-in">
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
