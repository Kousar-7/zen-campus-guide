import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Palette, PenTool, Flower2, Volume2, Droplets, Mountain, Dumbbell } from "lucide-react";
import { ColorFillGame } from "./ColorFillGame";
import { DoodleSpace } from "./DoodleSpace";
import { GratitudeGarden } from "./GratitudeGarden";
import { SoundTherapy } from "./SoundTherapy";
import { BubblePop } from "./BubblePop";
import { ZenGarden } from "./ZenGarden";
import { YogaPoseChallenge } from "./YogaPoseChallenge";
import { BreathingExercise } from "../StressRelief/BreathingExercise";

const games = [
  { id: "breathing", name: "Breathing Exercise", icon: Mountain, color: "bg-primary", description: "Guided breathing for calm" },
  { id: "color-fill", name: "Color Therapy", icon: Palette, color: "bg-secondary", description: "Fill patterns with soothing colors" },
  { id: "doodle", name: "Doodle Space", icon: PenTool, color: "bg-accent", description: "Express yourself through art" },
  { id: "gratitude", name: "Gratitude Garden", icon: Flower2, color: "bg-success", description: "Grow flowers with gratitude" },
  { id: "sound", name: "Sound Therapy", icon: Volume2, color: "bg-warning", description: "Relaxing ambient sounds" },
  { id: "bubbles", name: "Bubble Pop", icon: Droplets, color: "bg-info", description: "Pop bubbles for instant relief" },
  { id: "zen", name: "Zen Garden", icon: Mountain, color: "bg-muted", description: "Create peaceful sand patterns" },
  { id: "yoga", name: "Yoga Challenge", icon: Dumbbell, color: "bg-primary", description: "Gentle poses for relaxation" },
];

export const GameHub = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const renderGame = () => {
    switch (selectedGame) {
      case "breathing":
        return <BreathingExercise />;
      case "color-fill":
        return <ColorFillGame />;
      case "doodle":
        return <DoodleSpace />;
      case "gratitude":
        return <GratitudeGarden />;
      case "sound":
        return <SoundTherapy />;
      case "bubbles":
        return <BubblePop />;
      case "zen":
        return <ZenGarden />;
      case "yoga":
        return <YogaPoseChallenge />;
      default:
        return null;
    }
  };

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light/10 via-background to-secondary-light/10 pb-20">
        <div className="p-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedGame(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
          {renderGame()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/10 via-background to-secondary-light/10 pb-20">
      <div className="p-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Mindful Games</h1>
          <p className="text-muted-foreground">Choose an activity to relax and unwind</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Card
                key={game.id}
                className="wellness-card cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedGame(game.id)}
              >
                <CardContent className="p-4">
                  <div className={`w-12 h-12 ${game.color} rounded-xl flex items-center justify-center mb-3 mx-auto animate-float`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-center text-foreground mb-1">
                    {game.name}
                  </h3>
                  <p className="text-xs text-muted-foreground text-center">
                    {game.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="wellness-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-center">Game Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>🎨 <strong>Creative Expression:</strong> Art activities reduce cortisol levels</p>
              <p>🌸 <strong>Gratitude Practice:</strong> Increases positive emotions by 25%</p>
              <p>🎵 <strong>Sound Therapy:</strong> Lowers heart rate and blood pressure</p>
              <p>🧘 <strong>Mindful Activities:</strong> Improve focus and emotional regulation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};