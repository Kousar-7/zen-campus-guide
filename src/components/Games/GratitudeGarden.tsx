import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Flower2, Plus, Heart, Trash2 } from "lucide-react";

interface Gratitude {
  id: string;
  text: string;
  date: string;
  flowerType: string;
  color: string;
}

const flowerTypes = ["🌸", "🌺", "🌻", "🌷", "🌹", "🏵️", "💐", "🌼"];
const flowerColors = ["#FFB6C1", "#DDA0DD", "#98FB98", "#F0E68C", "#FFE4B5", "#E6E6FA", "#FFC0CB", "#AFEEEE"];

export const GratitudeGarden = () => {
  const [gratitudes, setGratitudes] = useState<Gratitude[]>([]);
  const [newGratitude, setNewGratitude] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gratitude-garden");
    if (saved) {
      setGratitudes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gratitude-garden", JSON.stringify(gratitudes));
  }, [gratitudes]);

  const addGratitude = () => {
    if (!newGratitude.trim()) return;

    const gratitude: Gratitude = {
      id: Date.now().toString(),
      text: newGratitude.trim(),
      date: new Date().toLocaleDateString(),
      flowerType: flowerTypes[Math.floor(Math.random() * flowerTypes.length)],
      color: flowerColors[Math.floor(Math.random() * flowerColors.length)]
    };

    setGratitudes(prev => [...prev, gratitude]);
    setNewGratitude("");
    setShowInput(false);
  };

  const removeGratitude = (id: string) => {
    setGratitudes(prev => prev.filter(g => g.id !== id));
  };

  const getGardenMessage = () => {
    const count = gratitudes.length;
    if (count === 0) return "Your garden is waiting to bloom! Add your first gratitude.";
    if (count < 5) return "Your garden is beginning to flourish! Keep adding gratitudes.";
    if (count < 10) return "Beautiful! Your garden is blooming with positivity.";
    return "Magnificent! Your garden is a testament to your grateful heart. 🌈";
  };

  return (
    <div className="space-y-6">
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flower2 className="w-5 h-5 text-success" />
            Gratitude Garden
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Plant flowers of gratitude and watch your garden grow
            </p>
            <p className="text-xs text-success font-medium">{getGardenMessage()}</p>
          </div>

          {/* Garden Display */}
          <div className="min-h-32 bg-gradient-to-b from-sky-100 to-green-100 rounded-xl p-4 mb-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-green-200 rounded-b-xl"></div>
            <div className="absolute top-2 right-4 text-2xl">☀️</div>
            <div className="absolute top-4 left-4 text-lg opacity-70">☁️</div>
            
            {/* Flowers */}
            <div className="flex flex-wrap gap-2 justify-center items-end min-h-24 pb-2">
              {gratitudes.map((gratitude, index) => (
                <div
                  key={gratitude.id}
                  className="relative group cursor-pointer transform hover:scale-110 transition-transform duration-200"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div
                    className="text-2xl filter drop-shadow-sm"
                    title={gratitude.text}
                  >
                    {gratitude.flowerType}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                    {gratitude.text.length > 30 ? gratitude.text.slice(0, 30) + "..." : gratitude.text}
                  </div>
                </div>
              ))}
              
              {gratitudes.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <div className="text-4xl mb-2">🌱</div>
                  <p className="text-sm">Your first flower is waiting to bloom!</p>
                </div>
              )}
            </div>
          </div>

          {/* Add Gratitude */}
          {!showInput ? (
            <Button
              onClick={() => setShowInput(true)}
              className="w-full mb-4"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Plant a New Flower
            </Button>
          ) : (
            <div className="space-y-3 mb-4">
              <Textarea
                placeholder="What are you grateful for today? (e.g., 'A warm cup of tea', 'My friend's support', 'Beautiful weather')"
                value={newGratitude}
                onChange={(e) => setNewGratitude(e.target.value)}
                className="min-h-[80px]"
                maxLength={200}
              />
              <div className="flex gap-2">
                <Button onClick={addGratitude} className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Plant Flower
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInput(false);
                    setNewGratitude("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Garden Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">{gratitudes.length}</div>
              <div className="text-xs text-muted-foreground">Flowers Planted</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {new Set(gratitudes.map(g => g.date)).size}
              </div>
              <div className="text-xs text-muted-foreground">Days Active</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {gratitudes.length >= 10 ? "🏆" : gratitudes.length >= 5 ? "🌟" : "🌱"}
              </div>
              <div className="text-xs text-muted-foreground">Garden Level</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Gratitudes */}
      {gratitudes.length > 0 && (
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Gratitudes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {gratitudes.slice(-5).reverse().map((gratitude) => (
                <div key={gratitude.id} className="flex items-start gap-3 p-2 bg-muted/30 rounded-lg">
                  <div className="text-lg">{gratitude.flowerType}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground break-words">{gratitude.text}</p>
                    <p className="text-xs text-muted-foreground">{gratitude.date}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGratitude(gratitude.id)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};