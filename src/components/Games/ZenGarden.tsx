import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mountain, RotateCcw, Plus, Minus } from "lucide-react";

interface Rock {
  id: string;
  x: number;
  y: number;
  size: number;
  type: string;
}

const rockTypes = ["🪨", "🗿", "⚫", "🟤", "🔘"];

export const ZenGarden = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rocks, setRocks] = useState<Rock[]>([]);
  const [selectedRock, setSelectedRock] = useState(rockTypes[0]);
  const [brushSize, setBrushSize] = useState(3);
  const [mode, setMode] = useState<"sand" | "rocks">("sand");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 250;
    
    // Fill with sand color
    ctx.fillStyle = "#F5DEB3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add subtle sand texture
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "#E6D3A3";
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (mode !== "sand") return;
    
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || mode !== "sand") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#D2B48C";
    ctx.globalCompositeOperation = "darken";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const placeRock = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== "rocks") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRock: Rock = {
      id: Date.now().toString(),
      x,
      y,
      size: Math.random() * 20 + 15,
      type: selectedRock
    };

    setRocks(prev => [...prev, newRock]);
  };

  const clearGarden = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Reset sand
    ctx.fillStyle = "#F5DEB3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add sand texture
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "#E6D3A3";
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    
    setRocks([]);
  };

  const removeRock = (id: string) => {
    setRocks(prev => prev.filter(rock => rock.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mountain className="w-5 h-5 text-muted-foreground" />
            Zen Garden
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              Create patterns in the sand and place stones for inner peace
            </p>
          </div>

          {/* Mode Selection */}
          <div className="flex gap-2 mb-4 justify-center">
            <Button
              variant={mode === "sand" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("sand")}
            >
              🏖️ Draw Sand
            </Button>
            <Button
              variant={mode === "rocks" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("rocks")}
            >
              🪨 Place Rocks
            </Button>
          </div>

          {/* Canvas with Rocks Overlay */}
          <div className="flex justify-center mb-6">
            <div className="relative border-2 border-border rounded-xl overflow-hidden shadow-lg">
              <canvas
                ref={canvasRef}
                className={`${mode === "sand" ? "cursor-crosshair" : "cursor-pointer"} touch-none`}
                onMouseDown={mode === "sand" ? startDrawing : placeRock}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={mode === "sand" ? startDrawing : undefined}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              
              {/* Rocks Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {rocks.map((rock) => (
                  <div
                    key={rock.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      left: rock.x,
                      top: rock.y,
                      fontSize: rock.size
                    }}
                    onClick={() => removeRock(rock.id)}
                    title="Click to remove rock"
                  >
                    {rock.type}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {mode === "sand" && (
              <div className="flex items-center gap-2 justify-center">
                <span className="text-sm text-muted-foreground">Brush:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-sm text-muted-foreground w-8 text-center">{brushSize}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBrushSize(Math.min(10, brushSize + 1))}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}

            {mode === "rocks" && (
              <div className="flex justify-center">
                <div className="grid grid-cols-5 gap-2">
                  {rockTypes.map((rock, index) => (
                    <button
                      key={index}
                      className={`p-2 text-xl border rounded transition-all ${
                        selectedRock === rock ? 'border-primary bg-primary/10' : 'border-border'
                      }`}
                      onClick={() => setSelectedRock(rock)}
                    >
                      {rock}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={clearGarden}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear Garden
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="wellness-card">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-2">Zen Garden Wisdom</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Creates mindful focus • Reduces racing thoughts • Promotes patience • Encourages present-moment awareness
              </p>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Sand Patterns:</strong> Represent the flow of life and change</p>
              <p><strong>Stones:</strong> Symbolize stability and permanence</p>
              <p><strong>Balance:</strong> Find harmony between movement and stillness</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};