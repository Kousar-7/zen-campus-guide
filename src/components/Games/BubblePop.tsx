import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, RotateCcw, Trophy } from "lucide-react";

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}

const bubbleColors = ["#FFB6C1", "#87CEEB", "#98FB98", "#DDA0DD", "#F0E68C", "#FFE4B5"];

export const BubblePop = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const createBubble = (): Bubble => ({
    id: Math.random().toString(36),
    x: Math.random() * 280 + 10, // Keep within container bounds
    y: 350, // Start from bottom
    size: Math.random() * 30 + 20,
    color: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
    speed: Math.random() * 2 + 1
  });

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setBubbles([]);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setBubbles([]);
  };

  const popBubble = (id: string) => {
    setBubbles(prev => prev.filter(bubble => bubble.id !== id));
    setScore(prev => prev + 10);
    
    // Play pop sound effect (visual feedback)
    const bubble = bubbles.find(b => b.id === id);
    if (bubble) {
      // Create pop effect element
      const popElement = document.createElement('div');
      popElement.textContent = '💥';
      popElement.style.position = 'absolute';
      popElement.style.left = bubble.x + 'px';
      popElement.style.top = bubble.y + 'px';
      popElement.style.fontSize = '20px';
      popElement.style.pointerEvents = 'none';
      popElement.style.zIndex = '1000';
      document.body.appendChild(popElement);
      
      setTimeout(() => {
        document.body.removeChild(popElement);
      }, 500);
    }
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameInterval = setInterval(() => {
      // Add new bubbles
      if (Math.random() < 0.7) {
        setBubbles(prev => [...prev, createBubble()]);
      }

      // Move bubbles up
      setBubbles(prev => 
        prev.map(bubble => ({
          ...bubble,
          y: bubble.y - bubble.speed
        })).filter(bubble => bubble.y > -50) // Remove bubbles that are off screen
      );

      // Update timer
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 100);

    return () => clearInterval(gameInterval);
  }, [isPlaying, gameOver]);

  const getScoreMessage = () => {
    if (score >= 200) return "Bubble Master! 🏆";
    if (score >= 150) return "Excellent! 🌟";
    if (score >= 100) return "Great Job! 👏";
    if (score >= 50) return "Good Work! 😊";
    return "Keep Popping! 💫";
  };

  return (
    <div className="space-y-6">
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Droplets className="w-5 h-5 text-info" />
            Bubble Pop Therapy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Pop bubbles to release stress and tension
            </p>
            
            {/* Game Stats */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{score}</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{timeLeft}s</div>
                  <div className="text-xs text-muted-foreground">Time</div>
                </div>
              </div>
              
              {gameOver && (
                <div className="text-right">
                  <Trophy className="w-5 h-5 text-warning mx-auto mb-1" />
                  <div className="text-xs text-success font-medium">{getScoreMessage()}</div>
                </div>
              )}
            </div>
          </div>

          {/* Game Area */}
          <div 
            className="relative w-full h-80 bg-gradient-to-t from-blue-50 to-sky-100 rounded-xl overflow-hidden border-2 border-border mb-4"
            style={{ userSelect: 'none' }}
          >
            {/* Bubbles */}
            {bubbles.map((bubble) => (
              <div
                key={bubble.id}
                className="absolute cursor-pointer transform hover:scale-110 transition-transform duration-100"
                style={{
                  left: bubble.x,
                  top: bubble.y,
                  width: bubble.size,
                  height: bubble.size,
                }}
                onClick={() => popBubble(bubble.id)}
              >
                <div
                  className="w-full h-full rounded-full opacity-80 hover:opacity-100 shadow-lg"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, white, ${bubble.color})`,
                    animation: 'float 3s ease-in-out infinite'
                  }}
                />
              </div>
            ))}

            {/* Game Over/Start Message */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                <div className="text-center">
                  {gameOver ? (
                    <>
                      <div className="text-2xl mb-2">🎉</div>
                      <div className="text-lg font-semibold text-foreground mb-2">Game Over!</div>
                      <div className="text-sm text-muted-foreground mb-4">
                        Final Score: {score} points
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-2">🫧</div>
                      <div className="text-lg font-semibold text-foreground mb-2">Ready to Pop?</div>
                      <div className="text-sm text-muted-foreground mb-4">
                        Tap bubbles as they float up!
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {!isPlaying ? (
              <Button onClick={startGame} className="flex-1">
                <Droplets className="w-4 h-4 mr-2" />
                Start Popping
              </Button>
            ) : (
              <Button onClick={resetGame} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Game
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="wellness-card">
        <CardContent className="p-4">
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-2">Bubble Pop Benefits</h4>
            <p className="text-sm text-muted-foreground">
              Releases endorphins • Improves hand-eye coordination • Provides instant satisfaction • Reduces cortisol levels
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};