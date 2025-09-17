import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Flame,
  Trophy,
  Calendar,
  Target,
  Star,
  Award,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export const StudyStreaks = () => {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [longestStreak, setLongestStreak] = useState(21);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [dailyStudyTime, setDailyStudyTime] = useState(120); // minutes
  const [weeklyProgress, setWeeklyProgress] = useState(4);

  const achievements: Achievement[] = [
    {
      id: 'first_task',
      title: 'Getting Started',
      description: 'Complete your first study task',
      icon: <CheckCircle2 className="w-5 h-5" />,
      unlocked: true
    },
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Study for 7 days in a row',
      icon: <Flame className="w-5 h-5" />,
      unlocked: true
    },
    {
      id: 'streak_30',
      title: 'Month Master',
      description: 'Study for 30 days in a row',
      icon: <Calendar className="w-5 h-5" />,
      unlocked: false,
      progress: 7,
      maxProgress: 30
    },
    {
      id: 'focus_100',
      title: 'Focus Master',
      description: 'Complete 100 study sessions',
      icon: <Target className="w-5 h-5" />,
      unlocked: false,
      progress: 45,
      maxProgress: 100
    },
    {
      id: 'time_1000',
      title: 'Study Legend',
      description: 'Study for 1000 minutes total',
      icon: <Trophy className="w-5 h-5" />,
      unlocked: false,
      progress: 650,
      maxProgress: 1000
    },
    {
      id: 'perfect_week',
      title: 'Perfect Week',
      description: 'Meet your weekly goal',
      icon: <Star className="w-5 h-5" />,
      unlocked: false,
      progress: weeklyProgress,
      maxProgress: weeklyGoal
    }
  ];

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-500';
    if (streak >= 14) return 'text-blue-500';
    if (streak >= 7) return 'text-green-500';
    if (streak >= 3) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '👑';
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '⚡';
    if (streak >= 3) return '💪';
    return '🌱';
  };

  return (
    <div className="space-y-6">
      {/* Streak Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{currentStreak}</span>
                  <span className="text-xl">{getStreakEmoji(currentStreak)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Trophy className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{longestStreak}</span>
                  <span className="text-xl">👑</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Study</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{dailyStudyTime}m</span>
                  <span className="text-xl">📚</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="bg-card/50 backdrop-blur border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {weeklyProgress} / {weeklyGoal} days this week
              </span>
              <Badge variant={weeklyProgress >= weeklyGoal ? "default" : "secondary"}>
                {Math.round((weeklyProgress / weeklyGoal) * 100)}%
              </Badge>
            </div>
            <Progress 
              value={(weeklyProgress / weeklyGoal) * 100} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Keep going! 💪</span>
              <span>{weeklyGoal - weeklyProgress} days to go</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-card/50 backdrop-blur border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  achievement.unlocked
                    ? 'bg-success/10 border-success/20'
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked 
                      ? 'bg-success/20 text-success' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      {achievement.unlocked && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    {achievement.progress !== undefined && achievement.maxProgress && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{achievement.progress} / {achievement.maxProgress}</span>
                          <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100}
                          className="h-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};