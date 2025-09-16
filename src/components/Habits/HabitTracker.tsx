import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  CheckCircle, 
  Circle, 
  Flame, 
  Star, 
  TrendingUp,
  Calendar,
  Award
} from "lucide-react";
import { toast } from "sonner";

interface Habit {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  streak: number;
  completedToday: boolean;
  totalCompleted: number;
  points: number;
}

const defaultHabits: Habit[] = [
  {
    id: 1,
    title: "Write one positive thing",
    description: "Note something good that happened today",
    icon: "✨",
    category: "Mindfulness",
    streak: 3,
    completedToday: false,
    totalCompleted: 12,
    points: 5
  },
  {
    id: 2,
    title: "Take 5 deep breaths",
    description: "Practice mindful breathing",
    icon: "🌬️",
    category: "Wellness",
    streak: 5,
    completedToday: true,
    totalCompleted: 18,
    points: 10
  },
  {
    id: 3,
    title: "Drink 8 glasses of water",
    description: "Stay hydrated throughout the day",
    icon: "💧",
    category: "Health",
    streak: 2,
    completedToday: false,
    totalCompleted: 8,
    points: 5
  },
  {
    id: 4,
    title: "Connect with a friend",
    description: "Reach out to someone you care about",
    icon: "💬",
    category: "Social",
    streak: 1,
    completedToday: false,
    totalCompleted: 5,
    points: 15
  },
  {
    id: 5,
    title: "10-minute walk",
    description: "Get some fresh air and movement",
    icon: "🚶",
    category: "Physical",
    streak: 7,
    completedToday: true,
    totalCompleted: 21,
    points: 10
  }
];

const achievements = [
  { id: 1, title: "First Step", description: "Complete your first habit", unlocked: true },
  { id: 2, title: "On Fire", description: "7-day streak on any habit", unlocked: true },
  { id: 3, title: "Well Rounded", description: "Complete habits in all categories", unlocked: false },
  { id: 4, title: "Consistency King", description: "30-day streak", unlocked: false },
  { id: 5, title: "Point Master", description: "Earn 500 total points", unlocked: false },
];

export const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>(defaultHabits);
  const [totalPoints, setTotalPoints] = useState(285);
  const [weeklyProgress, setWeeklyProgress] = useState(65);

  const toggleHabit = (habitId: number) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const completed = !habit.completedToday;
        const newStreak = completed ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        const pointsToAdd = completed ? habit.points : -habit.points;
        
        setTotalPoints(current => Math.max(0, current + pointsToAdd));
        
        if (completed) {
          toast.success(`Great job! +${habit.points} points 🎉`);
        } else {
          toast.info("Habit unchecked. You can do it tomorrow!");
        }
        
        return {
          ...habit,
          completedToday: completed,
          streak: newStreak,
          totalCompleted: completed ? habit.totalCompleted + 1 : Math.max(0, habit.totalCompleted - 1)
        };
      }
      return habit;
    }));
  };

  const completedToday = habits.filter(h => h.completedToday).length;
  const dailyProgress = (completedToday / habits.length) * 100;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Mindfulness': 'bg-purple-100 text-purple-800',
      'Wellness': 'bg-blue-100 text-blue-800',
      'Health': 'bg-green-100 text-green-800',
      'Social': 'bg-pink-100 text-pink-800',
      'Physical': 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/10 via-background to-secondary-light/10 pb-20">
      <div className="p-4 pt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Habit Builder
          </h1>
          <p className="text-muted-foreground">Build positive habits, one day at a time</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
          <Card className="wellness-card">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-yellow-500 mr-1" />
                <span className="text-xl font-bold text-foreground">{totalPoints}</span>
              </div>
              <p className="text-xs text-muted-foreground">Total Points</p>
            </CardContent>
          </Card>
          
          <Card className="wellness-card">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Flame className="w-5 h-5 text-orange-500 mr-1" />
                <span className="text-xl font-bold text-foreground">
                  {Math.max(...habits.map(h => h.streak))}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Progress */}
        <Card className="max-w-md mx-auto mb-6 wellness-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium text-foreground">{completedToday}/{habits.length}</span>
              </div>
              <Progress value={dailyProgress} className="w-full" />
              <p className="text-xs text-muted-foreground text-center">
                {dailyProgress === 100 ? "Perfect day! 🎉" : "Keep going, you've got this! 💪"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Habits List */}
        <div className="space-y-3 max-w-md mx-auto mb-6">
          {habits.map(habit => (
            <Card 
              key={habit.id} 
              className={`wellness-card cursor-pointer transition-all duration-200 ${
                habit.completedToday ? 'bg-success/5 border-success/20' : ''
              }`}
              onClick={() => toggleHabit(habit.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{habit.icon}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${habit.completedToday ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {habit.title}
                      </h3>
                      {habit.streak > 0 && (
                        <div className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          <span className="text-xs font-bold text-orange-600">{habit.streak}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{habit.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className={`text-xs ${getCategoryColor(habit.category)}`}>
                        {habit.category}
                      </Badge>
                      <span className="text-xs font-medium text-primary">+{habit.points} pts</span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {habit.completedToday ? (
                      <CheckCircle className="w-6 h-6 text-success" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <Card className="max-w-md mx-auto wellness-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className={`p-3 rounded-lg border text-center ${
                    achievement.unlocked 
                      ? 'bg-success/10 border-success/20 text-success' 
                      : 'bg-muted/10 border-muted/20 text-muted-foreground'
                  }`}
                >
                  <div className="text-lg mb-1">
                    {achievement.unlocked ? '🏆' : '🔒'}
                  </div>
                  <p className="text-xs font-medium">{achievement.title}</p>
                  <p className="text-xs opacity-75">{achievement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};