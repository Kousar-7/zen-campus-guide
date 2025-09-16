import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, Eraser, RotateCcw, Palette, Download } from "lucide-react";

const brushColors = [
  "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444",
  "#EC4899", "#6366F1", "#84CC16", "#F97316", "#64748B"
];

export const DoodleSpace = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<"pen" | "eraser">("pen");
  const [currentColor, setCurrentColor] = useState(brushColors[0]);
  const [brushSize, setBrushSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 400;
    
    // Set initial styles
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
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
    if (!isDrawing) return;
    
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
    
    if (currentTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = currentColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.beginPath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = "my-doodle.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PenTool className="w-5 h-5 text-accent" />
            Doodle Space
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              Express your thoughts and feelings through art
            </p>
          </div>

          {/* Canvas */}
          <div className="flex justify-center mb-6">
            <div className="border-2 border-border rounded-xl overflow-hidden shadow-lg">
              <canvas
                ref={canvasRef}
                className="cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
          </div>

          {/* Tools */}
          <div className="space-y-4">
            {/* Tool Selection */}
            <div className="flex gap-2 justify-center">
              <Button
                variant={currentTool === "pen" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentTool("pen")}
              >
                <PenTool className="w-4 h-4 mr-2" />
                Pen
              </Button>
              <Button
                variant={currentTool === "eraser" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentTool("eraser")}
              >
                <Eraser className="w-4 h-4 mr-2" />
                Eraser
              </Button>
            </div>

            {/* Color Palette */}
            {currentTool === "pen" && (
              <div className="flex justify-center">
                <div className="grid grid-cols-5 gap-2">
                  {brushColors.map((color, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        currentColor === color ? 'border-primary scale-110' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCurrentColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Brush Size */}
            <div className="flex items-center gap-2 justify-center">
              <span className="text-sm text-muted-foreground">Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">{brushSize}px</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={clearCanvas}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button variant="outline" size="sm" onClick={saveDrawing}>
                <Download className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="wellness-card">
        <CardContent className="p-4">
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-2">Art Therapy Benefits</h4>
            <p className="text-sm text-muted-foreground">
              Reduces stress • Improves self-expression • Processes emotions • Boosts creativity
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};