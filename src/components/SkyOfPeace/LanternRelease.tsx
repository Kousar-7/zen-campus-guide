import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Sparkles, Moon, Star } from "lucide-react";
import { toast } from "sonner";

interface Lantern {
  id: number;
  text: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
}

export const LanternRelease = () => {
  const [worry, setWorry] = useState("");
  const [lanterns, setLanterns] = useState<Lantern[]>([]);
  const [isReleasing, setIsReleasing] = useState(false);

  const releaseLantern = () => {
    if (!worry.trim()) {
      toast.error("Write your worry first to release it");
      return;
    }

    setIsReleasing(true);
    const newLantern: Lantern = {
      id: Date.now(),
      text: worry,
      x: Math.random() * 80 + 10,
      y: 90,
      opacity: 1,
      scale: 1,
    };

    setLanterns(prev => [...prev, newLantern]);
    setWorry("");
    
    toast.success("Your worry has been released to the peaceful sky ✨");
    
    setTimeout(() => setIsReleasing(false), 3000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLanterns(prev => 
        prev.map(lantern => ({
          ...lantern,
          y: lantern.y - 0.5,
          opacity: lantern.y > 20 ? lantern.opacity - 0.005 : 0,
          scale: lantern.scale + 0.002,
        })).filter(lantern => lantern.opacity > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 text-white pb-20 relative overflow-hidden">
      {/* Starry background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-white/20 animate-pulse"
            size={Math.random() * 8 + 4}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <Moon className="absolute top-10 right-10 w-16 h-16 text-yellow-200/80" />

      <div className="relative z-10 p-4">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            Sky of Peace
          </h1>
          <p className="text-white/80">Release your worries into the peaceful night sky</p>
        </div>

        {/* Lanterns floating */}
        {lanterns.map(lantern => (
          <div
            key={lantern.id}
            className="absolute w-8 h-10 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-lg shadow-lg animate-float pointer-events-none"
            style={{
              left: `${lantern.x}%`,
              top: `${lantern.y}%`,
              opacity: lantern.opacity,
              transform: `scale(${lantern.scale})`,
              transition: 'all 0.5s ease-out',
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-yellow-200/50 to-transparent rounded-lg">
              <div className="w-2 h-2 bg-yellow-100 rounded-full mx-auto mt-1 animate-pulse" />
            </div>
          </div>
        ))}

        <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center">Write Your Worry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={worry}
              onChange={(e) => setWorry(e.target.value)}
              placeholder="What's weighing on your mind? Write it here and let it go..."
              className="bg-white/10 border-white/30 text-white placeholder-white/60 resize-none"
              rows={4}
            />
            <Button
              onClick={releaseLantern}
              disabled={isReleasing}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold"
            >
              <Send className="w-4 h-4 mr-2" />
              {isReleasing ? "Releasing..." : "Release Lantern"}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mt-8 space-y-2">
          <p className="text-white/70 text-sm">Watch your worries float away</p>
          <p className="text-white/50 text-xs">In letting go, we find peace</p>
        </div>
      </div>
    </div>
  );
};