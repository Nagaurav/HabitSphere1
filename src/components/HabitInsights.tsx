
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Lightbulb, BarChart3, Activity, Clock, RefreshCw, Loader2 } from 'lucide-react';
import { getPatternAnalysis, PatternAnalysis } from '@/lib/ai-assistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface HabitInsightsProps {
  habitId?: string;
  habitData?: any;
}

const HabitInsights: React.FC<HabitInsightsProps> = ({ habitId, habitData }) => {
  const [insights, setInsights] = useState<PatternAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (habitId) {
      fetchInsights(habitId);
    }
  }, [habitId]);

  const fetchInsights = async (id: string) => {
    setLoading(true);
    try {
      const data = await getPatternAnalysis(id);
      setInsights(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError('Failed to load habit insights');
      toast({
        title: 'Error',
        description: 'Failed to load habit insights',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate sample data for visualizations
  const generateCompletionData = () => {
    if (!habitData || !habitData.completionHistory) return [];
    
    const last14Days = [...habitData.completionHistory]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 14);
      
    return last14Days.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completed: day.completed ? 1 : 0
    }));
  };

  const generateWeekdayData = () => {
    if (!habitData || !habitData.completionHistory) return [];
    
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounters = Array(7).fill(0);
    const dayCompletions = Array(7).fill(0);
    
    habitData.completionHistory.forEach(day => {
      const date = new Date(day.date);
      const dayIndex = date.getDay();
      dayCounters[dayIndex]++;
      if (day.completed) {
        dayCompletions[dayIndex]++;
      }
    });
    
    return weekdays.map((day, index) => ({
      name: day.substring(0, 3),
      successRate: dayCounters[index] ? Math.round((dayCompletions[index] / dayCounters[index]) * 100) : 0
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Habit Insights
          </CardTitle>
          <CardDescription>Loading personalized insights...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Habit Insights
          </CardTitle>
          <CardDescription>Unable to load insights</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error}. Please try again later.
          </p>
          {habitId && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => fetchInsights(habitId)}
            >
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const completionData = generateCompletionData();
  const weekdayData = generateWeekdayData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Habit Insights & Analytics
        </CardTitle>
        <CardDescription>
          Personalized insights and pattern analysis for your habit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="insights" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="completion">Completion Trend</TabsTrigger>
            <TabsTrigger value="weekday">Day Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            {insights ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Peak Productivity Times</h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        {insights.peakTimes.map((time, i) => (
                          <li key={i}>• {time}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Activity className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Common Failure Points</h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        {insights.failurePoints.map((point, i) => (
                          <li key={i}>• {point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Correlations</h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        {insights.correlations.map((correlation, i) => (
                          <li key={i}>• {correlation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Suggestions for Improvement</h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        {insights.suggestions.map((suggestion, i) => (
                          <li key={i}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                {habitId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2" 
                    onClick={() => fetchInsights(habitId)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Insights
                  </Button>
                )}
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No insights available yet. Complete this habit more regularly to generate insights.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completion">
            <div className="h-80">
              {completionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={completionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 1]} ticks={[0, 1]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="hsl(var(--primary))" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Not enough data to show completion trends.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="weekday">
            <div className="h-80">
              {weekdayData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weekdayData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar 
                      dataKey="successRate" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Not enough data to show weekday analysis.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HabitInsights;
