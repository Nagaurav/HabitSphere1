
import React, { useState } from 'react';
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, PieChart, ResponsiveContainer, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";
import { CalendarDays, Clock, DownloadCloud, Share2, Calendar, ChevronLeft, ChevronRight, Filter, TrendingUp, SquareDashed } from "lucide-react";

const COLORS = ['#8b5cf6', '#d946ef', '#f97316', '#0ea5e9', '#14b8a6'];

// Sample data - in a real app, this would come from your API/database
const monthlyData = [
  { name: 'Jan', completed: 45, goal: 60 },
  { name: 'Feb', completed: 52, goal: 60 },
  { name: 'Mar', completed: 48, goal: 60 },
  { name: 'Apr', completed: 70, goal: 60 },
  { name: 'May', completed: 65, goal: 60 },
  { name: 'Jun', completed: 85, goal: 60 },
  { name: 'Jul', completed: 68, goal: 60 },
  { name: 'Aug', completed: 75, goal: 60 },
  { name: 'Sep', completed: 80, goal: 60 },
  { name: 'Oct', completed: 87, goal: 60 },
  { name: 'Nov', completed: 60, goal: 60 },
  { name: 'Dec', completed: 0, goal: 60 },
];

const weekdayData = [
  { name: 'Mon', value: 78 },
  { name: 'Tue', value: 65 },
  { name: 'Wed', value: 83 },
  { name: 'Thu', value: 79 },
  { name: 'Fri', value: 67 },
  { name: 'Sat', value: 43 },
  { name: 'Sun', value: 58 },
];

const categoryData = [
  { name: 'Exercise', value: 32 },
  { name: 'Meditation', value: 24 },
  { name: 'Reading', value: 18 },
  { name: 'Coding', value: 22 },
  { name: 'Journaling', value: 14 },
];

const timeOfDayData = [
  { name: '6AM-9AM', value: 35 },
  { name: '9AM-12PM', value: 20 },
  { name: '12PM-3PM', value: 15 },
  { name: '3PM-6PM', value: 10 },
  { name: '6PM-9PM', value: 25 },
  { name: '9PM-12AM', value: 15 },
];

// Mock trend data for "Long-term Trends"
const trendData = [
  { date: 'Week 1', progress: 20 },
  { date: 'Week 2', progress: 40 },
  { date: 'Week 3', progress: 55 },
  { date: 'Week 4', progress: 70 },
  { date: 'Week 5', progress: 85 },
];

// Mock pattern data for "Behavior Patterns"
const patternsMock = [
  "You tend to skip habits on Fridays more than other days.",
  "Morning habits have a higher completion rate than evening ones.",
  "You improve streaks after weekends consistently.",
  "Meditation habits show a plateau after two weeks."
];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [currentMonth, setCurrentMonth] = useState('April 2025');
  
  const handlePreviousMonth = () => {
    setCurrentMonth('March 2025');
  };
  
  const handleNextMonth = () => {
    setCurrentMonth('May 2025');
  };
  
  const handleExport = () => {
    alert('Exporting analytics data...');
  };

  return (
    <Layout>
      <div className="space-y-6 container-responsive max-w-screen-lg mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Habit Analytics</h1>
            <p className="text-muted-foreground">
              Track your habit progress and identify patterns for improvement
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" aria-label="Filter">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <DownloadCloud className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth} aria-label="Previous Month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-lg font-medium">{currentMonth}</div>
            <Button variant="outline" size="icon" onClick={handleNextMonth} aria-label="Next Month">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <Button variant="ghost" size="sm" className="text-primary">
              Today
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Completion Rate
              </CardTitle>
              <CardDescription>Average across all habits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground mt-1">↑ 12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Most Productive Time
              </CardTitle>
              <CardDescription>When you complete most habits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">6AM-9AM</div>
              <p className="text-xs text-muted-foreground mt-1">Morning person pattern</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Best Streak Day
              </CardTitle>
              <CardDescription>Day of week with highest completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Wednesday</div>
              <p className="text-xs text-muted-foreground mt-1">83% completion rate</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Share2 className="h-4 w-4 text-primary" />
                Top Category
              </CardTitle>
              <CardDescription>Most completed habit type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Exercise</div>
              <p className="text-xs text-muted-foreground mt-1">32% of all completions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full justify-start bg-muted/50 p-1 max-w-fit flex-wrap rounded-md gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Completion vs Goal</CardTitle>
                  <CardDescription>Track your habit completion against set goals</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" fill="#8b5cf6" name="Completed" />
                        <Bar dataKey="goal" fill="#d1d5db" name="Goal" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Completion by Day of Week</CardTitle>
                  <CardDescription>See which days you're most successful</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weekdayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0ea5e9" name="Success Rate (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="habits">
            <Card>
              <CardHeader>
                <CardTitle>Individual Habit Analytics</CardTitle>
                <CardDescription>Select a habit to view detailed analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Select a habit from the dropdown to view detailed analytics.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Long-term Trends
                </CardTitle>
                <CardDescription>View your progress over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="progress" stroke="#8b5cf6" strokeWidth={3} dot />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patterns">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <SquareDashed className="h-5 w-5 text-primary" />
                  Behavior Patterns
                </CardTitle>
                <CardDescription>AI-powered insights about your habit patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {patternsMock.map((pattern, idx) => (
                    <li key={idx}>{pattern}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics;
