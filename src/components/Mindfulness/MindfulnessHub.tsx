import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Clock, 
  Headphones, 
  Leaf, 
  Moon, 
  Sun,
  Heart,
  Brain
} from "lucide-react";
import mindfulnessIcon from "@/assets/mindfulness-icon.jpg";

interface MindfulnessSession {
  id: string;
  title: string;
  duration: string;
  type: 'meditation' | 'breathing' | 'body-scan' | 'sleep';
  description: string;
  icon: any;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const sessions: MindfulnessSession[] = [
  {
    id: '1',
    title: "Morning Mindfulness",
    duration: "10 min",
    type: 'meditation',
    description: "Start your day with clarity and focus",
    icon: Sun,
    difficulty: 'Beginner'
  },
  {
    id: '2', 
    title: "Anxiety Relief Breathing",
    duration: "5 min",
    type: 'breathing',
    description: "Quick breathing technique to calm anxiety",
    icon: Heart,
    difficulty: 'Beginner'
  },
  {
    id: '3',
    title: "Body Scan Relaxation", 
    duration: "15 min",
    type: 'body-scan',
    description: "Progressive muscle relaxation for stress relief",
    icon: Leaf,
    difficulty: 'Intermediate'
  },
  {
    id: '4',
    title: "Sleep Preparation",
    duration: "20 min", 
    type: 'sleep',
    description: "Wind down and prepare for restful sleep",
    icon: Moon,
    difficulty: 'Beginner'
  },
  {
    id: '5',
    title: "Focus & Concentration",
    duration: "12 min",
    type: 'meditation', 
    description: "Improve your ability to concentrate and study",
    icon: Brain,
    difficulty: 'Intermediate'
  }
];

const typeColors = {
  meditation: "bg-primary",
  breathing: "bg-secondary", 
  'body-scan': "bg-accent",
  sleep: "bg-success"
};

export const MindfulnessHub = () => {
  const playSession = (sessionId: string) => {
    console.log("Playing session:", sessionId);
    // Here you would implement audio playback
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-success/5 pb-20">
      {/* Header */}
      <div className="relative overflow-hidden bg-card border-b border-border">
        <div 
          className="h-32 bg-cover bg-center relative opacity-60"
          style={{ backgroundImage: `url(${mindfulnessIcon})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-accent/80 to-primary/60" />
        <div className="relative z-10 p-4 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-semibold text-xl">Mindfulness Center</h1>
              <p className="text-white/90 text-sm">Guided practices for inner peace</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Today's Recommendation */}
        <Card className="wellness-card border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-primary" />
              Recommended for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
                <Sun className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Morning Mindfulness</h3>
                <p className="text-sm text-muted-foreground mb-2">Perfect way to start your day</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">10 min</Badge>
                  <Badge variant="outline" className="text-xs">Beginner</Badge>
                </div>
              </div>
              <Button onClick={() => playSession('1')} className="px-6">
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Sessions */}
        <div>
          <h2 className="text-lg font-semibold mb-4 px-1">Quick Relief (5 min)</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="wellness-card cursor-pointer hover:scale-105 transition-transform">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Heart className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="font-medium text-sm mb-1">Anxiety Relief</h3>
                <p className="text-xs text-muted-foreground mb-2">5 min breathing</p>
                <Button size="sm" variant="outline" className="w-full">
                  <Play className="w-3 h-3 mr-1" />
                  Play
                </Button>
              </CardContent>
            </Card>

            <Card className="wellness-card cursor-pointer hover:scale-105 transition-transform">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-3 mx-auto">
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-medium text-sm mb-1">Focus Boost</h3>
                <p className="text-xs text-muted-foreground mb-2">3 min meditation</p>
                <Button size="sm" variant="outline" className="w-full">
                  <Play className="w-3 h-3 mr-1" />
                  Play
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Sessions */}
        <div>
          <h2 className="text-lg font-semibold mb-4 px-1">All Sessions</h2>
          <div className="space-y-3">
            {sessions.map((session) => {
              const Icon = session.icon;
              return (
                <Card key={session.id} className="wellness-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 ${typeColors[session.type]} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{session.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                          {session.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {session.duration}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {session.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => playSession(session.id)}
                        size="sm"
                        className="px-4"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="text-lg">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-xs text-muted-foreground">Sessions completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">3</div>
                <div className="text-xs text-muted-foreground">Day streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">45</div>
                <div className="text-xs text-muted-foreground">Minutes practiced</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};