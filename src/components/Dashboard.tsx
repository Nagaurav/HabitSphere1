
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Flame, Calendar, TrendingUp, Trophy } from "lucide-react";
import HabitsList from "./HabitsList";
import AddHabitModal from "./AddHabitModal";
import { Habit, TimeOfDay, HabitCategory, HabitFrequency, sampleHabits } from "@/lib/habits";
import ProgressChart from "./ProgressChart";
import HabitRecommendations, { HabitRecommendation } from "./HabitRecommendations";
import HabitGameElements from "./HabitGameElements";

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(sampleHabits);
  const [recommendations, setRecommendations] = useState<HabitRecommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [errorRecommendations, setErrorRecommendations] = useState<string | null>(null);
  const [showGameElements, setShowGameElements] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRecommendations(true);
      fetchRecommendations();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced fetchRecommendations to provide varying recommendations on each call
  const fetchRecommendations = async () => {
    setLoadingRecommendations(true);
    setErrorRecommendations(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Generate different dummy recommendations randomly from a pool
      const allDummyRecs: HabitRecommendation[] = [
        {
          title: "Read for 30 minutes",
          description: "Improve knowledge and relax by reading daily.",
          category: "learning",
          difficulty: 2,
        },
        {
          title: "Walk 10,000 steps",
          description: "Boost fitness and health with daily walking.",
          category: "fitness",
          difficulty: 3,
        },
        {
          title: "Practice meditation",
          description: "Reduce stress and improve focus with daily meditation.",
          category: "mindfulness",
          difficulty: 2,
        },
        {
          title: "Write a journal entry",
          description: "Reflect on your day and track progress regularly.",
          category: "mindfulness",
          difficulty: 2,
        },
        {
          title: "Drink water before meals",
          description: "Stay hydrated by drinking water before every meal.",
          category: "health",
          difficulty: 1,
        },
        {
          title: "Stretch for 5 minutes",
          description: "Enhance flexibility and reduce muscle tension.",
          category: "fitness",
          difficulty: 1,
        },
        {
          title: "Limit social media to 30 minutes",
          description: "Reduce distractions by limiting social media use daily.",
          category: "digital_wellness",
          difficulty: 3,
        },
        {
          title: "Review goals weekly",
          description: "Stay aligned by reviewing your goals every week.",
          category: "productivity",
          difficulty: 2,
        }
      ];

      // Shuffle and pick 3 unique recommendations each time
      const shuffled = allDummyRecs
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .slice(0, 3);

      setRecommendations(shuffled);
    } catch (err) {
      setErrorRecommendations("Failed to load recommendations");
    } finally {
      setLoadingRecommendations(false);
    }
  };

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
                { date: new Date().toISOString().split("T")[0], completed: true },
                ...habit.completionHistory
              ]
            }
          : habit
      )
    );
    setShowGameElements(true);
    toast({
      title: "Habit completed!",
      description: "Keep up the good work and build that streak!"
    });
  };

  const handleAddHabit = (habitData: {
    title: string;
    description: string;
    category: HabitCategory;
    frequency: HabitFrequency;
    timeOfDay: TimeOfDay;
  }) => {
    // Prevent adding duplicate habits with the same title (case insensitive)
    const exists = habits.some(
      (h) => h.title.toLowerCase() === habitData.title.toLowerCase()
    );
    if (exists) {
      toast({
        title: "Habit already exists",
        description: `The habit "${habitData.title}" is already in your list.`,
      });
      return;
    }

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
      description: "You've added a new habit to track."
    });
    fetchRecommendations(); // refresh recommendations after adding
  };

  // For adding habit via AI recommendations
  const handleAddHabitFromRecommendation = (habitData: {
    title: string;
    description: string;
    category: HabitCategory;
    frequency: HabitFrequency;
    timeOfDay: TimeOfDay;
  }) => {
    handleAddHabit(habitData);
  };

  const completedToday = habits.filter(h => h.completedToday).length;
  const completionRate = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;
  const totalHabits = habits.length;
  const averageStreak = habits.length > 0 ? habits.reduce((sum, h) => sum + h.streak, 0) / habits.length : 0;

  const totalStreakDays = habits.reduce((sum, h) => sum + h.streak, 0);
  const playerXP = completedToday * 10 + totalStreakDays;
  const playerLevel = Math.floor(playerXP / 100) + 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-teal-500/20 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Habit Journey</h1>
            <p className="text-muted-foreground mt-1">Build consistency one day at a time</p>
          </div>
          <AddHabitModal onAddHabit={handleAddHabit} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ProgressChart percentage={completionRate} size={64} className="mr-4" />
              <div>
                <div className="text-2xl font-bold">{completedToday}/{totalHabits}</div>
                <p className="text-xs text-muted-foreground">habits completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageStreak.toFixed(1)} days</div>
            <p className="text-xs text-muted-foreground">across all habits</p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHabits}</div>
            <p className="text-xs text-muted-foreground">habits being tracked</p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {playerLevel}</div>
            <p className="text-xs text-muted-foreground">{playerXP} XP earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Habit Lists */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="w-full justify-start bg-muted/50 p-1">
              <TabsTrigger value="all" className="rounded-lg">All Habits</TabsTrigger>
              <TabsTrigger value="today" className="rounded-lg">Today's Habits</TabsTrigger>
              <TabsTrigger value="incomplete" className="rounded-lg">Incomplete</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-2">
              <HabitsList habits={habits} onCompleteHabit={handleCompleteHabit} />
            </TabsContent>

            <TabsContent value="today" className="space-y-4 mt-2">
              <HabitsList
                habits={habits.filter(
                  h => h.frequency === "daily" || (h.frequency === "weekly" && new Date().getDay() === 1)
                )}
                onCompleteHabit={handleCompleteHabit}
              />
            </TabsContent>

            <TabsContent value="incomplete" className="space-y-4 mt-2">
              <HabitsList habits={habits.filter(h => !h.completedToday)} onCompleteHabit={handleCompleteHabit} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {showRecommendations && (
            <HabitRecommendations
              recommendations={recommendations}
              loading={loadingRecommendations}
              error={errorRecommendations}
              onAddHabit={handleAddHabitFromRecommendation}
              onRetry={fetchRecommendations}
            />
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

