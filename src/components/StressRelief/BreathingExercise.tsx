import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Wind } from "lucide-react";

type Phase = 'inhale' | 'hold' | 'exhale' | 'pause';

const phaseInstructions = {
  inhale: "Breathe In",
  hold: "Hold",
  exhale: "Breathe Out", 
  pause: "Rest"
};

const phaseColors = {
  inhale: "bg-primary",
  hold: "bg-warning",
  exhale: "bg-secondary",
  pause: "bg-muted"
};

export const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [totalCycles] = useState(5);

  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 6,
    pause: 2
  };

  const phaseSequence: Phase[] = ['inhale', 'hold', 'exhale', 'pause'];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      const currentIndex = phaseSequence.indexOf(currentPhase);
      const nextIndex = (currentIndex + 1) % phaseSequence.length;
      const nextPhase = phaseSequence[nextIndex];
      
      if (nextPhase === 'inhale' && currentPhase === 'pause') {
        setCycle(prev => prev + 1);
      }
      
      if (cycle >= totalCycles) {
        setIsActive(false);
        setCycle(0);
        setCurrentPhase('inhale');
        setTimeLeft(phaseDurations.inhale);
        return;
      }
      
      setCurrentPhase(nextPhase);
      setTimeLeft(phaseDurations[nextPhase]);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentPhase, cycle, totalCycles]);

  const startExercise = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setTimeLeft(phaseDurations.inhale);
    setCycle(0);
  };

  const pauseExercise = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(phaseDurations.inhale);
    setCycle(0);
  };

  const progress = cycle / totalCycles * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-20 p-4">
      {/* Header */}
      <Card className="wellness-card mb-6">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <Wind className="w-6 h-6 text-primary" />
            Breathing Exercise
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            4-4-6 breathing pattern to reduce stress and anxiety
          </p>
        </CardHeader>
      </Card>

      {/* Breathing Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          {/* Outer circle - progress */}
          <div className="w-64 h-64 rounded-full border-4 border-muted relative">
            <div 
              className="absolute inset-0 rounded-full border-4 border-primary transition-all duration-1000"
              style={{
                clipPath: `conic-gradient(from 0deg, transparent ${progress}%, #000 ${progress}%)`
              }}
            />
          </div>
          
          {/* Inner breathing circle */}
          <div 
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              rounded-full ${phaseColors[currentPhase]} transition-all duration-1000 flex items-center justify-center
              ${isActive ? 'animate-breath' : ''}`}
            style={{
              width: currentPhase === 'inhale' ? '180px' : currentPhase === 'hold' ? '180px' : 
                     currentPhase === 'exhale' ? '120px' : '150px',
              height: currentPhase === 'inhale' ? '180px' : currentPhase === 'hold' ? '180px' : 
                      currentPhase === 'exhale' ? '120px' : '150px',
            }}
          >
            <div className="text-center text-white">
              <div className="text-xl font-bold mb-1">
                {phaseInstructions[currentPhase]}
              </div>
              <div className="text-3xl font-mono">
                {timeLeft}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Info */}
      <Card className="wellness-card mb-6">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">
              Cycle {cycle + 1} of {totalCycles}
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {cycle >= totalCycles ? "Exercise Complete! Well done." : "Focus on your breathing rhythm"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex justify-center gap-4">
          {!isActive && cycle === 0 ? (
            <Button 
              onClick={startExercise}
              className="px-8 py-3 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Exercise
            </Button>
          ) : (
            <>
              <Button 
                onClick={pauseExercise}
                variant="secondary"
                className="px-6 py-3"
              >
                {isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                {isActive ? "Pause" : "Resume"}
              </Button>
              
              <Button 
                onClick={resetExercise}
                variant="outline"
                className="px-6 py-3"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>

        {/* Instructions */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="text-lg">How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-primary rounded-full"></div>
                <span><strong>Inhale</strong> for 4 seconds through your nose</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-warning rounded-full"></div>
                <span><strong>Hold</strong> your breath for 4 seconds</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-secondary rounded-full"></div>
                <span><strong>Exhale</strong> for 6 seconds through your mouth</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-muted rounded-full"></div>
                <span><strong>Rest</strong> for 2 seconds before the next cycle</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};