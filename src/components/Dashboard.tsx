
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Flame, Calendar, TrendingUp, Sparkles, Trophy } from "lucide-react";
import HabitsList from "./HabitsList";
import AddHabitModal from "./AddHabitModal";
import { Habit, TimeOfDay, HabitCategory, HabitFrequency, sampleHabits } from "@/lib/habits";
import ProgressChart from "./ProgressChart";
import HabitRecommendations from "./HabitRecommendations";
import HabitGameElements from "./HabitGameElements";

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(sampleHabits);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showGameElements, setShowGameElements] = useState(false);
  const { toast } = useToast();

  // Toggle states for AI and gamification features
  useEffect(() => {
    // Show AI recommendations after 2 seconds for a better UX flow
    const timer = setTimeout(() => {
      setShowRecommendations(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCompleteHabit = (habitId: string) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === habitId
          ? { 
              ...habit, 
              completedToday: true,
              streak: habit.streak + 1,
              longestStreak: Math.max(habit.longestStreak, habit.streak + 1),
              completionHistory: [
                { date: new Date().toISOString().split('T')[0], completed: true },
                ...habit.completionHistory
              ]
            }
          : habit
      )
    );

    // Show gamification elements after completing a habit
    setShowGameElements(true);

    toast({
      title: "Habit completed!",
      description: "Keep up the good work and build that streak!",
    });
  };

  const handleAddHabit = (habitData: {
    title: string;
    description: string;
    category: HabitCategory;
    frequency: HabitFrequency;
    timeOfDay: TimeOfDay;
  }) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title: habitData.title,
      description: habitData.description,
      category: habitData.category,
      frequency: habitData.frequency,
      timeOfDay: habitData.timeOfDay,
      createdAt: new Date(),
      streak: 0,
      longestStreak: 0,
      completedToday: false,
      completionHistory: []
    };

    setHabits(prevHabits => [newHabit, ...prevHabits]);
    
    toast({
      title: "New habit created!",
      description: "You've added a new habit to track.",
    });
  };

  // Calculate overall stats
  const completedToday = habits.filter(h => h.completedToday).length;
  const completionRate = habits.length > 0 
    ? (completedToday / habits.length) * 100 
    : 0;
  const totalHabits = habits.length;
  const averageStreak = habits.length > 0
    ? habits.reduce((sum, h) => sum + h.streak, 0) / habits.length
    : 0;

  // Calculate XP for gamification (simple formula: completed habits * 10 + total streak days)
  const totalStreakDays = habits.reduce((sum, h) => sum + h.streak, 0);
  const playerXP = (completedToday * 10) + totalStreakDays;
  const playerLevel = Math.floor(playerXP / 100) + 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track and manage your habits to build consistency
          </p>
        </div>
        <AddHabitModal onAddHabit={handleAddHabit} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ProgressChart percentage={completionRate} size={60} className="mr-4" />
              <div>
                <div className="text-2xl font-bold">{completedToday}/{totalHabits}</div>
                <p className="text-xs text-muted-foreground">habits completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageStreak.toFixed(1)} days</div>
            <p className="text-xs text-muted-foreground">across all habits</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {showGameElements ? "Current Level" : "Total Habits"}
            </CardTitle>
            {showGameElements ? 
              <Trophy className="h-4 w-4 text-muted-foreground" /> : 
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            }
          </CardHeader>
          <CardContent>
            {showGameElements ? (
              <div>
                <div className="text-2xl font-bold">Level {playerLevel}</div>
                <p className="text-xs text-muted-foreground">{playerXP} XP earned</p>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold">{totalHabits}</div>
                <p className="text-xs text-muted-foreground">habits being tracked</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Habits</TabsTrigger>
              <TabsTrigger value="today">Today's Habits</TabsTrigger>
              <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <HabitsList 
                habits={habits}
                onCompleteHabit={handleCompleteHabit}
              />
            </TabsContent>
            
            <TabsContent value="today" className="space-y-4">
              <HabitsList 
                habits={habits.filter(h => 
                  h.frequency === 'daily' || 
                  (h.frequency === 'weekly' && new Date().getDay() === 1)
                )}
                onCompleteHabit={handleCompleteHabit}
              />
            </TabsContent>
            
            <TabsContent value="incomplete" className="space-y-4">
              <HabitsList 
                habits={habits.filter(h => !h.completedToday)}
                onCompleteHabit={handleCompleteHabit}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {showRecommendations && (
            <HabitRecommendations onAddHabit={handleAddHabit} />
          )}
          
          {showGameElements && (
            <HabitGameElements 
              xp={playerXP}
              level={playerLevel}
              streak={Math.max(...habits.map(h => h.streak))}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
