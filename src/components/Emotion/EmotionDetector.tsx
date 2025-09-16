import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff, RefreshCw, Heart } from "lucide-react";
import { toast } from "sonner";

interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp: Date;
  suggestions: string[];
}

const emotionResponses = {
  happy: {
    emoji: "😊",
    message: "You're radiating positivity! Keep that beautiful energy flowing.",
    suggestions: [
      "Share this positive moment with a friend",
      "Practice gratitude for what made you smile",
      "Take a photo to capture this happy moment"
    ],
    color: "text-success"
  },
  sad: {
    emoji: "😢",
    message: "It's okay to feel sad. You're not alone, and this feeling will pass.",
    suggestions: [
      "Try some gentle breathing exercises",
      "Write about your feelings in a journal", 
      "Reach out to a trusted friend or counselor",
      "Listen to calming music or sounds"
    ],
    color: "text-info"
  },
  stressed: {
    emoji: "😰",
    message: "I can see you're feeling stressed. Let's work on some relief techniques.",
    suggestions: [
      "Take 10 deep breaths right now",
      "Try the 4-7-8 breathing technique",
      "Go for a short walk if possible",
      "Practice progressive muscle relaxation"
    ],
    color: "text-warning"
  },
  anxious: {
    emoji: "😟",
    message: "Anxiety can be overwhelming. You have tools to manage this feeling.",
    suggestions: [
      "Ground yourself with the 5-4-3-2-1 technique",
      "Practice mindful breathing for 5 minutes",
      "Try gentle movement or stretching",
      "Connect with your support system"
    ],
    color: "text-destructive"
  },
  neutral: {
    emoji: "😐",
    message: "You seem calm and centered. Great time for mindful activities.",
    suggestions: [
      "Use this balanced state for meditation",
      "Set positive intentions for your day",
      "Practice gratitude exercises",
      "Plan something you enjoy"
    ],
    color: "text-muted-foreground"
  },
  surprised: {
    emoji: "😲",
    message: "Something has caught your attention! Channel this energy positively.",
    suggestions: [
      "Take a moment to process what you're feeling",
      "Write down your thoughts",
      "Share this moment if it's positive",
      "Practice staying present"
    ],
    color: "text-accent"
  }
};

export const EmotionDetector = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentResult, setCurrentResult] = useState<EmotionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [history, setHistory] = useState<EmotionResult[]>([]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 320, height: 240 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setIsActive(true);
      toast.success("Camera activated! Look at the camera for emotion detection.");
    } catch (error) {
      toast.error("Camera access denied. Please enable camera permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setStream(null);
    setIsActive(false);
    setCurrentResult(null);
  };

  const mockEmotionDetection = useCallback(() => {
    // Simulate emotion detection (in a real app, this would use AI/ML)
    const emotions = Object.keys(emotionResponses);
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence
    
    const result: EmotionResult = {
      emotion: randomEmotion,
      confidence: confidence,
      timestamp: new Date(),
      suggestions: emotionResponses[randomEmotion as keyof typeof emotionResponses].suggestions
    };
    
    return result;
  }, []);

  const analyzeEmotion = async () => {
    if (!isActive || !videoRef.current) return;
    
    setIsAnalyzing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // In a real implementation, you would:
      // 1. Capture frame from video
      // 2. Send to emotion detection API (like Azure Face API, AWS Rekognition, etc.)
      // 3. Process the response
      
      const result = mockEmotionDetection();
      setCurrentResult(result);
      setHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 results
      
      const response = emotionResponses[result.emotion as keyof typeof emotionResponses];
      toast.success(`${response.emoji} ${response.message}`, { duration: 5000 });
      
    } catch (error) {
      toast.error("Emotion detection failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEmotionData = (emotion: string) => {
    return emotionResponses[emotion as keyof typeof emotionResponses] || emotionResponses.neutral;
  };

  return (
    <div className="space-y-6">
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Camera className="w-5 h-5 text-accent" />
            AI Emotion Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              Real-time emotion detection with personalized wellness support
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your privacy is protected - no images are stored or transmitted
            </p>
          </div>

          {/* Camera View */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-80 h-60 bg-muted rounded-xl overflow-hidden border-2 border-border">
                {isActive ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <div className="text-center">
                      <CameraOff className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Camera not active</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Analysis Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm">Analyzing emotion...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 mb-6">
            {!isActive ? (
              <Button onClick={startCamera} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            ) : (
              <>
                <Button
                  onClick={analyzeEmotion}
                  disabled={isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Detect Emotion
                    </>
                  )}
                </Button>
                <Button onClick={stopCamera} variant="outline">
                  <CameraOff className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Current Result */}
          {currentResult && (
            <Card className="mb-4 bg-muted/30">
              <CardContent className="p-4">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">
                    {getEmotionData(currentResult.emotion).emoji}
                  </div>
                  <div className="font-semibold text-foreground mb-1">
                    {currentResult.emotion.charAt(0).toUpperCase() + currentResult.emotion.slice(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Confidence: {Math.round(currentResult.confidence * 100)}%
                  </div>
                </div>
                
                <div className={`text-sm ${getEmotionData(currentResult.emotion).color} text-center mb-3`}>
                  {getEmotionData(currentResult.emotion).message}
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium text-foreground">Personalized Suggestions:</h5>
                  {currentResult.suggestions.slice(0, 3).map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></div>
                      {suggestion}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Recent History */}
      {history.length > 0 && (
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Emotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((result, index) => {
                const data = getEmotionData(result.emotion);
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{data.emoji}</span>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {result.emotion.charAt(0).toUpperCase() + result.emotion.slice(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {result.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(result.confidence * 100)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Notice */}
      <Card className="wellness-card border-info/20">
        <CardContent className="p-4">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            🔒 Privacy & Security
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• All emotion detection happens on your device</p>
            <p>• No photos or videos are stored or transmitted</p>
            <p>• Only emotion data is processed, not facial features</p>
            <p>• You can disable this feature anytime in settings</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};