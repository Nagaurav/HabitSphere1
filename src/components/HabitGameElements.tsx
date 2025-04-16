
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star, Zap, Target } from 'lucide-react';

interface HabitGameElementsProps {
  xp?: number;
  level?: number;
  achievements?: Achievement[];
  streak?: number;
  habitId?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'award' | 'star' | 'target' | 'zap';
  unlocked: boolean;
  progress?: number; // 0-100
}

const HabitGameElements: React.FC<HabitGameElementsProps> = ({ 
  xp = 0, 
  level = 1, 
  achievements = [],
  streak = 0,
  habitId
}) => {
  // Calculate XP needed for next level (simple formula: level * 100)
  const xpForNextLevel = level * 100;
  const xpProgress = Math.min(100, Math.round((xp / xpForNextLevel) * 100));
  
  // Get icon component based on achievement icon type
  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case 'trophy': return <Trophy className="h-4 w-4" />;
      case 'award': return <Award className="h-4 w-4" />;
      case 'star': return <Star className="h-4 w-4" />;
      case 'target': return <Target className="h-4 w-4" />;
      case 'zap': return <Zap className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  // Sample achievements for demo purposes
  const sampleAchievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete a habit for the first time',
      icon: 'trophy',
      unlocked: true,
    },
    {
      id: '2',
      title: 'Consistency Champion',
      description: 'Maintain a 7-day streak',
      icon: 'star',
      unlocked: streak >= 7,
      progress: streak >= 7 ? 100 : Math.round((streak / 7) * 100)
    },
    {
      id: '3',
      title: 'Habit Master',
      description: 'Reach a 30-day streak',
      icon: 'award',
      unlocked: streak >= 30,
      progress: streak >= 30 ? 100 : Math.round((streak / 30) * 100)
    },
    {
      id: '4',
      title: 'Early Bird',
      description: 'Complete 5 habits before 9am',
      icon: 'zap',
      unlocked: false,
      progress: 60
    },
    {
      id: '5',
      title: 'Perfectionist',
      description: 'Complete all habits for 5 days straight',
      icon: 'target',
      unlocked: false,
      progress: 40
    }
  ];

  // Use provided achievements or sample ones
  const displayAchievements = achievements.length > 0 ? achievements : sampleAchievements;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Level & Progress
          </CardTitle>
          <CardDescription>
            Complete habits to earn XP and level up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold">Level {level}</div>
            <div className="text-sm text-muted-foreground">{xp} / {xpForNextLevel} XP</div>
          </div>
          <Progress value={xpProgress} className="h-2" />
          
          <div className="mt-4 text-sm text-muted-foreground">
            You need <span className="font-medium text-foreground">{xpForNextLevel - xp} more XP</span> to reach level {level + 1}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Achievements
          </CardTitle>
          <CardDescription>
            Track your habit-building accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayAchievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`flex items-start p-3 rounded-lg border ${achievement.unlocked ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-border'}`}
              >
                <div className={`flex-shrink-0 p-2 rounded-full ${achievement.unlocked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {getAchievementIcon(achievement.icon)}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{achievement.title}</h4>
                    {achievement.unlocked && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        Achieved
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                  
                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-1" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitGameElements;
