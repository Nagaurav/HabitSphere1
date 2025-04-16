
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Plus, Loader2 } from 'lucide-react';
import { getHabitRecommendations, HabitRecommendation } from '@/lib/ai-assistant';
import { HabitCategory, HabitFrequency, TimeOfDay, getCategoryIcon } from '@/lib/habits';

interface HabitRecommendationsProps {
  onAddHabit?: (habitData: {
    title: string;
    description: string;
    category: HabitCategory;
    frequency: HabitFrequency;
    timeOfDay: TimeOfDay;
  }) => void;
}

const HabitRecommendations: React.FC<HabitRecommendationsProps> = ({ onAddHabit }) => {
  const [recommendations, setRecommendations] = useState<HabitRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await getHabitRecommendations();
      setRecommendations(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load habit recommendations');
      toast({
        title: 'Error',
        description: 'Failed to load habit recommendations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToHabits = (recommendation: HabitRecommendation) => {
    if (!onAddHabit) return;
    
    // Convert recommendation to the format expected by the onAddHabit function
    onAddHabit({
      title: recommendation.title,
      description: recommendation.description,
      category: recommendation.category as HabitCategory, 
      frequency: 'daily', // Default to daily
      timeOfDay: 'anytime' as TimeOfDay, // Default to anytime
    });

    toast({
      title: 'Habit Added',
      description: `"${recommendation.title}" has been added to your habits`,
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Loading personalized habit suggestions...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Unable to load recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error}. Please try again later.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={fetchRecommendations}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Habit Recommendations
        </CardTitle>
        <CardDescription>
          Personalized habit suggestions based on your current habits and patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No recommendations available. Try adding some habits first.
          </p>
        ) : (
          recommendations.map((recommendation, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-lg">
                    {getCategoryIcon(recommendation.category as HabitCategory)}
                  </span>
                  {recommendation.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                <div className="flex items-center mt-2 gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {recommendation.category}
                  </span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    Difficulty: {recommendation.difficulty}/5
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                {onAddHabit && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleAddToHabits(recommendation)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add to My Habits
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRecommendations}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
          Refresh Recommendations
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HabitRecommendations;
