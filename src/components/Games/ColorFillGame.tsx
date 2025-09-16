import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, RotateCcw, CheckCircle } from "lucide-react";

const patterns = [
  {
    id: 1,
    name: "Mandala Circle",
    paths: [
      "M50,10 A40,40 0 1,1 49.99,10 Z",
      "M50,20 A30,30 0 1,1 49.99,20 Z",
      "M50,30 A20,20 0 1,1 49.99,30 Z",
      "M40,50 L60,50 M50,40 L50,60"
    ]
  },
  {
    id: 2,
    name: "Flower Petals",
    paths: [
      "M50,30 Q35,15 20,30 Q35,45 50,30",
      "M50,30 Q65,15 80,30 Q65,45 50,30",
      "M50,30 Q35,45 20,60 Q35,75 50,60",
      "M50,30 Q65,45 80,60 Q65,75 50,60"
    ]
  }
];

const colors = [
  "#E8F5E8", "#F0F8FF", "#FFF0F5", "#F5F0FF", "#FFFAF0",
  "#E0F7FA", "#FCE4EC", "#F3E5F5", "#E8F5E8", "#FFF8E1"
];

export const ColorFillGame = () => {
  const [selectedPattern, setSelectedPattern] = useState(patterns[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [filledPaths, setFilledPaths] = useState<Record<string, string>>({});
  const [completedSections, setCompletedSections] = useState(0);

  const handlePathClick = (pathIndex: number) => {
    const pathId = `${selectedPattern.id}-${pathIndex}`;
    setFilledPaths(prev => ({
      ...prev,
      [pathId]: selectedColor
    }));
    
    if (!filledPaths[pathId]) {
      setCompletedSections(prev => prev + 1);
    }
  };

  const resetPattern = () => {
    setFilledPaths({});
    setCompletedSections(0);
  };

  const isComplete = completedSections >= selectedPattern.paths.length;

  return (
    <div className="space-y-6">
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5 text-secondary" />
            Color Therapy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <h3 className="font-semibold text-foreground mb-2">{selectedPattern.name}</h3>
            <p className="text-sm text-muted-foreground">
              Tap sections to fill with calming colors
            </p>
            {isComplete && (
              <div className="flex items-center justify-center gap-2 mt-2 text-success">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Beautiful work! 🎨</span>
              </div>
            )}
          </div>

          {/* SVG Pattern */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-xl p-4 shadow-inner">
              <svg width="200" height="200" viewBox="0 0 100 100">
                {selectedPattern.paths.map((path, index) => (
                  <path
                    key={index}
                    d={path}
                    fill={filledPaths[`${selectedPattern.id}-${index}`] || "white"}
                    stroke="#ddd"
                    strokeWidth="0.5"
                    className="cursor-pointer hover:stroke-primary transition-colors"
                    onClick={() => handlePathClick(index)}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Color Palette */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {colors.map((color, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color ? 'border-primary scale-110' : 'border-border'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetPattern}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPattern(patterns[selectedPattern.id % patterns.length])}
              className="flex-1"
            >
              New Pattern
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="wellness-card">
        <CardContent className="p-4">
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-2">Mindful Coloring Benefits</h4>
            <p className="text-sm text-muted-foreground">
              Reduces anxiety • Improves focus • Activates meditation response • Enhances creativity
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};