import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Activity, Footprints, Brain, TrendingUp, AlertTriangle } from "lucide-react";

interface HealthMetrics {
  mood: {
    current: string;
    score: number;
    trend: "up" | "down" | "stable";
  };
  heartRate: {
    current: number;
    resting: number;
    zone: "normal" | "elevated" | "high";
  };
  steps: {
    current: number;
    goal: number;
    percentage: number;
  };
  stress: {
    level: number;
    status: "low" | "moderate" | "high";
  };
  sleep: {
    hours: number;
    quality: "poor" | "fair" | "good" | "excellent";
  };
}

export const HealthDashboard = () => {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    mood: {
      current: "Good",
      score: 7.5,
      trend: "up"
    },
    heartRate: {
      current: 72,
      resting: 68,
      zone: "normal"
    },
    steps: {
      current: 6420,
      goal: 8000,
      percentage: 80.25
    },
    stress: {
      level: 35,
      status: "moderate"
    },
    sleep: {
      hours: 7.2,
      quality: "good"
    }
  });

  const [isConnected, setIsConnected] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        heartRate: {
          ...prev.heartRate,
          current: prev.heartRate.current + (Math.random() - 0.5) * 4
        },
        steps: {
          ...prev.steps,
          current: Math.min(prev.steps.current + Math.floor(Math.random() * 20), prev.steps.goal + 500),
          percentage: Math.min((prev.steps.current + Math.floor(Math.random() * 20)) / prev.steps.goal * 100, 110)
        }
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getMoodEmoji = (mood: string) => {
    const moodMap: Record<string, string> = {
      "Excellent": "😊",
      "Good": "🙂",
      "Fair": "😐",
      "Poor": "😔",
      "Bad": "😢"
    };
    return moodMap[mood] || "😐";
  };

  const getStressColor = (level: number) => {
    if (level < 30) return "text-success";
    if (level < 60) return "text-warning";
    return "text-destructive";
  };

  const getHeartRateColor = (zone: string) => {
    switch (zone) {
      case "normal": return "text-success";
      case "elevated": return "text-warning";
      case "high": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getHealthScore = () => {
    const moodScore = metrics.mood.score / 10 * 100;
    const stressScore = (100 - metrics.stress.level);
    const stepsScore = Math.min(metrics.steps.percentage, 100);
    const sleepScore = Math.min(metrics.sleep.hours / 8 * 100, 100);
    
    return Math.round((moodScore + stressScore + stepsScore + sleepScore) / 4);
  };

  const getHealthInsights = () => {
    const insights = [];
    
    if (metrics.stress.level > 60) {
      insights.push({
        type: "warning",
        message: "Stress levels are elevated. Consider taking a break or trying breathing exercises."
      });
    }
    
    if (metrics.steps.percentage < 50) {
      insights.push({
        type: "info",
        message: "Low activity today. Even a short 10-minute walk can boost your mood!"
      });
    }
    
    if (metrics.sleep.hours < 7) {
      insights.push({
        type: "warning",
        message: "You might need more sleep. Aim for 7-9 hours for optimal mental health."
      });
    }
    
    if (metrics.mood.score >= 8) {
      insights.push({
        type: "success",
        message: "Great mood today! Your positive energy is shining through."
      });
    }
    
    return insights.slice(0, 2); // Show max 2 insights
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-primary" />
            Health Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-foreground mb-2">
              {getHealthScore()}
            </div>
            <div className="text-sm text-muted-foreground">
              Overall Wellness Score
            </div>
            <div className="flex justify-center mt-2">
              <Badge variant={getHealthScore() >= 70 ? "default" : "secondary"}>
                {getHealthScore() >= 80 ? "Excellent" : getHealthScore() >= 70 ? "Good" : getHealthScore() >= 50 ? "Fair" : "Needs Attention"}
              </Badge>
            </div>
          </div>

          {!isConnected && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-warning text-sm">
                <AlertTriangle className="w-4 h-4" />
                Connect your smartwatch or fitness tracker for real-time data
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Mood */}
        <Card className="wellness-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-foreground">Mood</span>
              </div>
              {metrics.mood.trend === "up" && <TrendingUp className="w-3 h-3 text-success" />}
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">{getMoodEmoji(metrics.mood.current)}</div>
              <div className="text-sm font-medium text-foreground">{metrics.mood.current}</div>
              <div className="text-xs text-muted-foreground">Score: {metrics.mood.score}/10</div>
            </div>
          </CardContent>
        </Card>

        {/* Heart Rate */}
        <Card className="wellness-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 ${getHeartRateColor(metrics.heartRate.zone)}`} />
                <span className="text-sm font-medium text-foreground">Heart Rate</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground mb-1">
                {Math.round(metrics.heartRate.current)} BPM
              </div>
              <div className="text-xs text-muted-foreground">
                Resting: {metrics.heartRate.resting} BPM
              </div>
              <Badge variant="outline" className="text-xs mt-1">
                {metrics.heartRate.zone}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card className="wellness-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Footprints className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-foreground">Steps</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">{metrics.steps.current.toLocaleString()}</span>
                <span className="text-muted-foreground">{metrics.steps.goal.toLocaleString()}</span>
              </div>
              <Progress value={metrics.steps.percentage} className="h-2" />
              <div className="text-xs text-muted-foreground text-center">
                {Math.round(metrics.steps.percentage)}% of daily goal
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stress Level */}
        <Card className="wellness-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${getStressColor(metrics.stress.level)}`} />
                <span className="text-sm font-medium text-foreground">Stress</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-center">
                <div className={`text-lg font-bold ${getStressColor(metrics.stress.level)}`}>
                  {metrics.stress.level}%
                </div>
                <Badge variant="outline" className="text-xs">
                  {metrics.stress.status}
                </Badge>
              </div>
              <Progress 
                value={metrics.stress.level} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Quality */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-lg">Sleep Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">
                {metrics.sleep.hours}h
              </div>
              <div className="text-sm text-muted-foreground">Last night</div>
            </div>
            <div className="text-right">
              <Badge variant={metrics.sleep.quality === "excellent" || metrics.sleep.quality === "good" ? "default" : "secondary"}>
                {metrics.sleep.quality}
              </Badge>
              <div className="text-xs text-muted-foreground mt-1">
                Sleep Quality
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Insights */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-lg">Health Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getHealthInsights().map((insight, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  insight.type === "warning" ? "bg-warning/10 border-warning/20" :
                  insight.type === "success" ? "bg-success/10 border-success/20" :
                  "bg-info/10 border-info/20"
                }`}
              >
                <p className="text-sm text-foreground">{insight.message}</p>
              </div>
            ))}
            
            {getHealthInsights().length === 0 && (
              <div className="text-center py-4">
                <div className="text-2xl mb-2">🌟</div>
                <p className="text-sm text-muted-foreground">
                  All metrics look great! Keep up the good work.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};