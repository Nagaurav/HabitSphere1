
export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  timeOfDay?: TimeOfDay;
  createdAt: Date;
  streak: number;
  longestStreak: number;
  completedToday: boolean;
  completionHistory: CompletionRecord[];
}

export type HabitCategory = 
  | 'health'
  | 'fitness'
  | 'mindfulness'
  | 'productivity'
  | 'learning'
  | 'social'
  | 'creativity'
  | 'finance'
  | 'other';

export type HabitFrequency = 
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'custom';

export type TimeOfDay = 
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'anytime';

export interface CompletionRecord {
  date: string; // YYYY-MM-DD format
  completed: boolean;
  notes?: string;
}

// Sample data for development
export const sampleHabits: Habit[] = [
  {
    id: '1',
    title: 'Drink 8 glasses of water',
    description: 'Stay hydrated throughout the day',
    category: 'health',
    frequency: 'daily',
    timeOfDay: 'anytime',
    createdAt: new Date('2025-03-10'),
    streak: 5,
    longestStreak: 12,
    completedToday: false,
    completionHistory: [
      { date: '2025-04-15', completed: true },
      { date: '2025-04-14', completed: true },
      { date: '2025-04-13', completed: true },
      { date: '2025-04-12', completed: true },
      { date: '2025-04-11', completed: true },
    ]
  },
  {
    id: '2',
    title: 'Exercise for 30 minutes',
    description: 'Any physical activity counts',
    category: 'fitness',
    frequency: 'daily',
    timeOfDay: 'morning',
    createdAt: new Date('2025-03-15'),
    streak: 3,
    longestStreak: 14,
    completedToday: false,
    completionHistory: [
      { date: '2025-04-15', completed: false },
      { date: '2025-04-14', completed: true },
      { date: '2025-04-13', completed: true },
      { date: '2025-04-12', completed: true },
      { date: '2025-04-11', completed: false },
    ]
  },
  {
    id: '3',
    title: 'Read for 20 minutes',
    description: 'Reading helps expand knowledge and reduce stress',
    category: 'learning',
    frequency: 'daily',
    timeOfDay: 'evening',
    createdAt: new Date('2025-03-20'),
    streak: 7,
    longestStreak: 21,
    completedToday: true,
    completionHistory: [
      { date: '2025-04-16', completed: true },
      { date: '2025-04-15', completed: true },
      { date: '2025-04-14', completed: true },
      { date: '2025-04-13', completed: true },
      { date: '2025-04-12', completed: true },
      { date: '2025-04-11', completed: true },
      { date: '2025-04-10', completed: true },
    ]
  },
  {
    id: '4',
    title: 'Meditate for 10 minutes',
    description: 'Practice mindfulness and focus on breathing',
    category: 'mindfulness',
    frequency: 'daily',
    timeOfDay: 'morning',
    createdAt: new Date('2025-03-25'),
    streak: 0,
    longestStreak: 5,
    completedToday: false,
    completionHistory: [
      { date: '2025-04-14', completed: false },
      { date: '2025-04-13', completed: false },
      { date: '2025-04-12', completed: true },
      { date: '2025-04-11', completed: true },
      { date: '2025-04-10', completed: true },
    ]
  },
];

export const getCategoryIcon = (category: HabitCategory) => {
  switch (category) {
    case 'health':
      return '❤️';
    case 'fitness':
      return '💪';
    case 'mindfulness':
      return '🧘';
    case 'productivity':
      return '✅';
    case 'learning':
      return '📚';
    case 'social':
      return '👥';
    case 'creativity':
      return '🎨';
    case 'finance':
      return '💰';
    default:
      return '🔄';
  }
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export const calculateCompletionRate = (habit: Habit): number => {
  if (habit.completionHistory.length === 0) return 0;
  
  const completedDays = habit.completionHistory.filter(record => record.completed).length;
  return (completedDays / habit.completionHistory.length) * 100;
};
