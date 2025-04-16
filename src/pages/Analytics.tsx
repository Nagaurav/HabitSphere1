
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Calendar, Clock, BarChart3, PieChart as PieChartIcon, Download, FileText } from "lucide-react";
import { sampleHabits, HabitCategory, getCategoryIcon } from "@/lib/habits";
import HabitInsights from "@/components/HabitInsights";

const Analytics: React.FC = () => {
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');

  // Sample data for visualizations
  const habits = sampleHabits;

  // Get the selected habit
  const currentHabit = selectedHabit 
    ? habits.find(h => h.id === selectedHabit) 
    : null;

  // Generate completion rate by category
  const completionRateByCategory = () => {
    const categories: Record<HabitCategory, { count: number, completed: number }> = {
      health: { count: 0, completed: 0 },
      fitness: { count: 0, completed: 0 },
      mindfulness: { count: 0, completed: 0 },
      productivity: { count: 0, completed: 0 },
      learning: { count: 0, completed: 0 },
      social: { count: 0, completed: 0 },
      creativity: { count: 0, completed: 0 },
      finance: { count: 0, completed: 0 },
      other: { count: 0, completed: 0 }
    };

    habits.forEach(habit => {
      categories[habit.category].count++;
      if (habit.completedToday) {
        categories[habit.category].completed++;
      }
    });

    return Object.entries(categories)
      .filter(([_, data]) => data.count > 0)
      .map(([category, data]) => ({
        name: category,
        value: data.count > 0 ? Math.round((data.completed / data.count) * 100) : 0,
        count: data.count
      }));
  };

  // Generate streak data
  const streakData = habits.map(habit => ({
    name: habit.title.length > 15 ? `${habit.title.substring(0, 15)}...` : habit.title,
    current: habit.streak,
    longest: habit.longestStreak
  }));

  // Generate completion by day of week data
  const dayOfWeekData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = Array(7).fill(0);
    const completions = Array(7).fill(0);
    
    habits.forEach(habit => {
      habit.completionHistory.forEach(record => {
        const date = new Date(record.date);
        const day = date.getDay();
        counts[day]++;
        if (record.completed) {
          completions[day]++;
        }
      });
    });
    
    return days.map((day, i) => ({
      name: day,
      rate: counts[i] > 0 ? Math.round((completions[i] / counts[i]) * 100) : 0
    }));
  };

  // COLORS for the pie chart
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c'
  ];

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Detailed analysis of your habit data and patterns
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedTimeframe}
              onValueChange={(value: 'week' | 'month' | 'year') => setSelectedTimeframe(value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate by Category</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionRateByCategory()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {completionRateByCategory().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Habit Streak Comparison</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={streakData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="hsl(var(--primary))" name="Current Streak" />
                    <Bar dataKey="longest" fill="hsl(var(--primary) / 0.5)" name="Longest Streak" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completion by Day of Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dayOfWeekData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Completion Rate (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Habit Analysis</CardTitle>
                <CardDescription>
                  Select a habit to view detailed insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {habits.map(habit => (
                    <Button
                      key={habit.id}
                      variant={selectedHabit === habit.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedHabit(habit.id)}
                    >
                      <span className="mr-2">{getCategoryIcon(habit.category)}</span>
                      <span className="truncate">{habit.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedHabit ? (
              <HabitInsights habitId={selectedHabit} habitData={currentHabit} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Habit Insights</CardTitle>
                  <CardDescription>
                    Select a habit to view AI-powered insights and analytics
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Choose a habit from the list to see detailed analytics and personalized insights.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Reports</CardTitle>
            <CardDescription>
              Export or view detailed analytics reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="weekly">Weekly Report</TabsTrigger>
                <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
                <TabsTrigger value="custom">Custom Report</TabsTrigger>
              </TabsList>
              <TabsContent value="weekly" className="pt-4">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">Weekly Habit Summary</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      A comprehensive overview of your habit performance this week
                    </p>
                    <Button>
                      <Download className="h-4 w-4 mr-2" /> Download Report
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="monthly" className="pt-4">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">Monthly Progress Report</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Detailed analysis of your habit trends over the past month
                    </p>
                    <Button>
                      <Download className="h-4 w-4 mr-2" /> Download Report
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="custom" className="pt-4">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-medium">Custom Analytics Report</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Generate a custom report with specific date ranges and metrics
                    </p>
                    <Button>
                      <BarChart3 className="h-4 w-4 mr-2" /> Create Custom Report
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
