import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee,
  Brain,
  Clock,
  Settings
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PomodoroTimerProps {
  onSessionComplete?: (duration: number, type: 'study' | 'break') => void;
}

export const PomodoroTimer = ({ onSessionComplete }: PomodoroTimerProps) => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  const studyDuration = 25;
  const shortBreakDuration = 5;
  const longBreakDuration = 15;

  const reset = useCallback(() => {
    setIsActive(false);
    setMinutes(isBreak ? shortBreakDuration : studyDuration);
    setSeconds(0);
  }, [isBreak]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const startBreak = (isLong: boolean = false) => {
    const breakDuration = isLong ? longBreakDuration : shortBreakDuration;
    setIsBreak(true);
    setMinutes(breakDuration);
    setSeconds(0);
    setIsActive(true);
    
    toast({
      title: `${isLong ? 'Long' : 'Short'} Break Started! ☕`,
      description: `Time to relax for ${breakDuration} minutes.`,
    });
  };

  const startStudy = () => {
    setIsBreak(false);
    setMinutes(studyDuration);
    setSeconds(0);
    setIsActive(true);
    
    toast({
      title: "Study Session Started! 📚",
      description: `Focus time: ${studyDuration} minutes.`,
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer completed
          setIsActive(false);
          const sessionType = isBreak ? 'break' : 'study';
          const duration = isBreak 
            ? (sessions % 4 === 3 ? longBreakDuration : shortBreakDuration)
            : studyDuration;
          
          if (!isBreak) {
            setSessions(prev => prev + 1);
            setTotalStudyTime(prev => prev + studyDuration);
          }
          
          onSessionComplete?.(duration, sessionType);
          
          if (isBreak) {
            toast({
              title: "Break Complete! 🎯",
              description: "Ready for another study session?",
            });
            setIsBreak(false);
            setMinutes(studyDuration);
          } else {
            toast({
              title: "Study Session Complete! 🎉",
              description: `Great focus! ${sessions % 4 === 3 ? 'Time for a long break!' : 'Take a short break.'}`,
            });
            startBreak(sessions % 4 === 3);
          }
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, sessions, isBreak, onSessionComplete]);

  const totalTime = isBreak 
    ? (sessions % 4 === 3 ? longBreakDuration : shortBreakDuration) 
    : studyDuration;
  const currentTime = minutes * 60 + seconds;
  const progress = ((totalTime * 60 - currentTime) / (totalTime * 60)) * 100;

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Pomodoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-6xl font-mono font-bold text-foreground">
              {formatTime(minutes, seconds)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {isBreak ? '☕ Break Time' : '📚 Study Time'}
            </div>
          </div>
          
          <Progress 
            value={progress} 
            className="h-2"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={toggle}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-light hover:shadow-lg"
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start
              </>
            )}
          </Button>
          
          <Button onClick={reset} variant="outline" size="lg">
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={startStudy}
            variant="outline"
            className="border-primary/30 hover:bg-primary/10"
          >
            <Brain className="w-4 h-4 mr-2" />
            Study
          </Button>
          <Button 
            onClick={() => startBreak(false)}
            variant="outline"
            className="border-accent/30 hover:bg-accent/10"
          >
            <Coffee className="w-4 h-4 mr-2" />
            Break
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{sessions}</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{totalStudyTime}m</div>
            <div className="text-xs text-muted-foreground">Total Study</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};