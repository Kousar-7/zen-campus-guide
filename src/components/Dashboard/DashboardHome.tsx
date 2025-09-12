import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Heart, 
  MessageCircle, 
  Gamepad2, 
  Users, 
  Headphones,
  Calendar,
  TrendingUp
} from "lucide-react";
import heroImage from "@/assets/hero-wellness.jpg";

const moodOptions = [
  { emoji: "😊", label: "Great", value: 5, color: "text-success" },
  { emoji: "🙂", label: "Good", value: 4, color: "text-secondary" },
  { emoji: "😐", label: "Okay", value: 3, color: "text-warning" },
  { emoji: "😔", label: "Low", value: 2, color: "text-muted-foreground" },
  { emoji: "😢", label: "Bad", value: 1, color: "text-destructive" },
];

const quickActions = [
  { icon: MessageCircle, label: "AI Assistant", color: "bg-primary", id: "chat" },
  { icon: Heart, label: "Mood Check", color: "bg-secondary", id: "mood" },
  { icon: Gamepad2, label: "Stress Relief", color: "bg-accent", id: "games" },
  { icon: Headphones, label: "Mindfulness", color: "bg-success", id: "mindfulness" },
];

interface DashboardHomeProps {
  onNavigate: (page: string) => void;
}

export const DashboardHome = ({ onNavigate }: DashboardHomeProps) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [userName] = useState("Student"); // This would come from user context

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    // Here you would typically save to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/10 via-background to-secondary-light/10 pb-20">
      {/* Header Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
            <h1 className="text-2xl font-bold mb-1">Good morning, {userName}</h1>
            <p className="text-white/90">How are you feeling today?</p>
          </div>
        </div>
      </div>

      <div className="p-4 -mt-6 relative z-20">
        {/* Daily Mood Check-in */}
        <Card className="wellness-card mb-6 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-secondary" />
              Daily Mood Check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-300 ${
                    selectedMood === mood.value
                      ? 'border-primary bg-primary/10 scale-105'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <span className="text-2xl mb-1">{mood.emoji}</span>
                  <span className={`text-xs font-medium ${mood.color}`}>
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>
            {selectedMood && (
              <p className="text-sm text-muted-foreground text-center">
                Thank you for sharing. Your wellbeing matters! 💙
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.id}
                className="wellness-card cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => onNavigate(action.id)}
              >
                <CardContent className="p-4">
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 mx-auto animate-float`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-center text-foreground">
                    {action.label}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Today's Insights */}
        <Card className="wellness-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-accent" />
              Your Wellness Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">This week's mood average</span>
                <span className="text-lg">😊 Good</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Mindfulness streak</span>
                <span className="text-lg font-semibold text-success">3 days 🔥</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Support */}
        <Card className="wellness-card border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-destructive mb-1">Need immediate help?</h3>
                <p className="text-sm text-muted-foreground">24/7 crisis support available</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Get Help
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};