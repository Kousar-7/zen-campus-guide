import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Play, Pause, SkipForward, RotateCcw, Trophy } from "lucide-react";

interface Pose {
  id: string;
  name: string;
  emoji: string;
  description: string;
  benefits: string[];
  duration: number; // in seconds
  instructions: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

const poses: Pose[] = [
  {
    id: "mountain",
    name: "Mountain Pose",
    emoji: "🧘‍♀️",
    description: "Stand tall and strong like a mountain",
    benefits: ["Improves posture", "Builds focus", "Grounds energy"],
    duration: 30,
    instructions: [
      "Stand with feet hip-width apart",
      "Arms at your sides, palms facing forward",
      "Engage your core and lift through the crown of your head",
      "Breathe deeply and feel grounded"
    ],
    difficulty: "beginner"
  },
  {
    id: "tree",
    name: "Tree Pose",
    emoji: "🌳",
    description: "Balance on one leg like a graceful tree",
    benefits: ["Improves balance", "Strengthens legs", "Enhances concentration"],
    duration: 20,
    instructions: [
      "Stand in Mountain Pose",
      "Shift weight to your left foot",
      "Place right foot on inner left thigh or calf",
      "Bring hands to prayer position at heart",
      "Focus on a point ahead for balance"
    ],
    difficulty: "intermediate"
  },
  {
    id: "child",
    name: "Child's Pose",
    emoji: "🤱",
    description: "Rest and restore in this gentle pose",
    benefits: ["Relieves stress", "Stretches hips", "Calms the mind"],
    duration: 45,
    instructions: [
      "Kneel on the floor with big toes touching",
      "Sit back on your heels",
      "Fold forward, extending arms in front",
      "Rest your forehead on the ground",
      "Breathe deeply and relax"
    ],
    difficulty: "beginner"
  },
  {
    id: "warrior",
    name: "Warrior I",
    emoji: "⚔️",
    description: "Stand strong and confident like a warrior",
    benefits: ["Builds strength", "Improves focus", "Boosts confidence"],
    duration: 25,
    instructions: [
      "Step left foot back 3-4 feet",
      "Turn left foot out 45 degrees",
      "Bend right knee over ankle",
      "Reach arms up overhead",
      "Hold and breathe steadily"
    ],
    difficulty: "intermediate"
  },
  {
    id: "downward_dog",
    name: "Downward Dog",
    emoji: "🐕",
    description: "Stretch and strengthen in this classic pose",
    benefits: ["Stretches spine", "Strengthens arms", "Energizes body"],
    duration: 30,
    instructions: [
      "Start on hands and knees",
      "Tuck toes under and lift hips up",
      "Create an inverted V shape",
      "Press hands into ground",
      "Pedal feet to stretch calves"
    ],
    difficulty: "intermediate"
  },
  {
    id: "cat_cow",
    name: "Cat-Cow Stretch",
    emoji: "🐱",
    description: "Gently warm up your spine with flowing movement",
    benefits: ["Mobilizes spine", "Relieves tension", "Improves flexibility"],
    duration: 40,
    instructions: [
      "Start on hands and knees",
      "Inhale: arch back, look up (Cow)",
      "Exhale: round spine, chin to chest (Cat)",
      "Continue flowing between poses",
      "Move with your breath"
    ],
    difficulty: "beginner"
  }
];

export const YogaPoseChallenge = () => {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(poses[0].duration);
  const [completedPoses, setCompletedPoses] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  const currentPose = poses[currentPoseIndex];

  useEffect(() => {
    setTimeLeft(currentPose.duration);
  }, [currentPoseIndex, currentPose.duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Pose completed
      setCompletedPoses(prev => prev + 1);
      nextPose();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const startPause = () => {
    setIsActive(!isActive);
    setShowInstructions(false);
  };

  const nextPose = () => {
    setCurrentPoseIndex(prev => (prev + 1) % poses.length);
    setIsActive(false);
    setShowInstructions(true);
  };

  const resetSession = () => {
    setCurrentPoseIndex(0);
    setIsActive(false);
    setCompletedPoses(0);
    setShowInstructions(true);
    setTimeLeft(poses[0].duration);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-success";
      case "intermediate": return "text-warning";
      case "advanced": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const progress = ((currentPose.duration - timeLeft) / currentPose.duration) * 100;

  return (
    <div className="space-y-6">
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Dumbbell className="w-5 h-5 text-primary" />
            Yoga Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{currentPose.emoji}</div>
            <h2 className="text-xl font-semibold text-foreground mb-1">{currentPose.name}</h2>
            <p className="text-sm text-muted-foreground mb-2">{currentPose.description}</p>
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-muted ${getDifficultyColor(currentPose.difficulty)}`}>
              {currentPose.difficulty.charAt(0).toUpperCase() + currentPose.difficulty.slice(1)}
            </span>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium text-foreground">{timeLeft}s</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Instructions or Timer */}
          {showInstructions ? (
            <Card className="mb-6 bg-muted/30">
              <CardContent className="p-4">
                <h4 className="font-semibold text-foreground mb-3">Instructions</h4>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  {currentPose.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-primary font-medium">{index + 1}.</span>
                      {instruction}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-foreground mb-2">{timeLeft}</div>
              <div className="text-sm text-muted-foreground">
                {isActive ? "Hold the pose..." : "Ready when you are"}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2 mb-6">
            <Button onClick={startPause} className="flex-1">
              {isActive ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Pose
                </>
              )}
            </Button>
            <Button variant="outline" onClick={nextPose}>
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={resetSession}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">{completedPoses}</div>
              <div className="text-xs text-muted-foreground">Poses Completed</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">{currentPoseIndex + 1}/{poses.length}</div>
              <div className="text-xs text-muted-foreground">Current Pose</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {completedPoses >= 5 ? "🏆" : completedPoses >= 3 ? "🌟" : "🧘‍♀️"}
              </div>
              <div className="text-xs text-muted-foreground">Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="wellness-card">
        <CardContent className="p-4">
          <h4 className="font-semibold text-foreground mb-3">Benefits of {currentPose.name}</h4>
          <div className="space-y-1">
            {currentPose.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                {benefit}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {completedPoses >= 3 && (
        <Card className="wellness-card border-success/50">
          <CardContent className="p-4">
            <div className="text-center">
              <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
              <h4 className="font-semibold text-foreground mb-1">Great Progress! 🎉</h4>
              <p className="text-sm text-muted-foreground">
                You've completed {completedPoses} poses. Your body and mind thank you!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};