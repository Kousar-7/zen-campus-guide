import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  Brain,
  Heart,
  Zap
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Extend Window interface to include speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: string;
}

export const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // AI Response templates based on emotion and context
  const aiResponses = {
    stressed: [
      "I can hear the stress in your voice. Let's try some deep breathing together. Breathe in for 4 counts with me...",
      "It sounds like you're overwhelmed. Remember, you don't have to handle everything at once. What's the most important task right now?",
      "I'm here to help you through this stressful time. Would you like me to guide you through a quick relaxation exercise?"
    ],
    anxious: [
      "I notice some anxiety in your voice. That's completely normal, and you're not alone. Let's ground ourselves - can you tell me 3 things you can see right now?",
      "Anxiety can feel overwhelming, but remember - this feeling is temporary. You've handled difficult situations before, and you can handle this too.",
      "Let's work through this anxiety together. Would you like to try the 5-4-3-2-1 grounding technique?"
    ],
    sad: [
      "I can sense some sadness in your voice. It's okay to feel sad - these emotions are valid and important. I'm here to listen.",
      "Sometimes we need to sit with our sadness for a moment. Would you like to talk about what's making you feel this way?",
      "Your feelings matter, and it's brave of you to reach out. Remember that this sadness won't last forever."
    ],
    happy: [
      "I love hearing the joy in your voice! Your positive energy is contagious. What's making you feel so great today?",
      "Your happiness is wonderful! Let's celebrate this moment. What accomplishment are you most proud of right now?",
      "It's amazing to hear you so upbeat! Your positive attitude can really help with your studies and wellbeing."
    ],
    tired: [
      "You sound tired. Rest is just as important as productivity. Have you been getting enough sleep lately?",
      "Fatigue can really impact our mood and focus. Maybe it's time for a power nap or some gentle stretching?",
      "Your body might be telling you something important. Let's make sure you're taking care of your basic needs."
    ],
    neutral: [
      "I'm here and ready to help! How are you feeling today? Is there anything specific you'd like to talk about?",
      "Thanks for reaching out! I'm your AI wellness companion. How can I support your mental health and studies today?",
      "Hello! I'm here to listen and provide support. What's on your mind right now?"
    ]
  };

  // Study and wellness suggestions
  const studySupport = [
    "Would you like me to help you create a study schedule for today?",
    "Remember to take breaks every 25-30 minutes when studying. Your brain needs time to process information!",
    "Have you tried the Pomodoro Technique? It can really help with focus and productivity.",
    "Don't forget to stay hydrated and take care of your physical needs while studying.",
    "Your mental health is just as important as your academic success. How are you feeling about your workload?"
  ];

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "There was an issue with speech recognition. Please try again.",
          variant: "destructive"
        });
      };
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const detectEmotionFromText = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('stress') || lowerText.includes('overwhelm') || lowerText.includes('pressure')) return 'stressed';
    if (lowerText.includes('anxious') || lowerText.includes('worry') || lowerText.includes('nervous')) return 'anxious';
    if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('down')) return 'sad';
    if (lowerText.includes('happy') || lowerText.includes('great') || lowerText.includes('excited') || lowerText.includes('good')) return 'happy';
    if (lowerText.includes('tired') || lowerText.includes('exhausted') || lowerText.includes('sleepy')) return 'tired';
    
    return 'neutral';
  };

  const handleUserInput = (text: string) => {
    const emotion = detectEmotionFromText(text);
    setCurrentEmotion(emotion);

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      emotion
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate AI response
    setTimeout(() => {
      generateAIResponse(emotion, text);
    }, 1000);
  };

  const generateAIResponse = (emotion: string, userText: string) => {
    let responses = aiResponses[emotion as keyof typeof aiResponses] || aiResponses.neutral;
    
    // Add study-specific responses if user mentions study-related keywords
    if (userText.toLowerCase().includes('study') || userText.toLowerCase().includes('exam') || 
        userText.toLowerCase().includes('homework') || userText.toLowerCase().includes('assignment')) {
      responses = [...responses, ...studySupport];
    }

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: randomResponse,
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'supportive'
    };

    setMessages(prev => [...prev, aiMessage]);
    speakText(randomResponse);
  };

  const speakText = (text: string) => {
    if (synthRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return 'bg-green-500/20 text-green-600';
      case 'sad': return 'bg-blue-500/20 text-blue-600';
      case 'stressed': return 'bg-red-500/20 text-red-600';
      case 'anxious': return 'bg-orange-500/20 text-orange-600';
      case 'tired': return 'bg-purple-500/20 text-purple-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Wellness Companion
          <Badge variant="outline" className={getEmotionColor(currentEmotion)}>
            {currentEmotion}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`rounded-full w-16 h-16 ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary/90'}`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>
          
          <Button
            onClick={isSpeaking ? stopSpeaking : undefined}
            variant="outline"
            className={`rounded-full w-16 h-16 ${isSpeaking ? 'border-green-500 text-green-500 animate-pulse' : ''}`}
            disabled={!isSpeaking}
          >
            {isSpeaking ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </Button>
        </div>

        {/* Status */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isListening ? "🎤 Listening... speak now" : 
             isSpeaking ? "🗣️ AI is responding..." : 
             "💙 Tap the microphone to start talking"}
          </p>
        </div>

        {/* Chat History */}
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {messages.slice(-5).map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground ml-8'
                  : 'bg-muted mr-8'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.sender === 'ai' && <Heart className="w-4 h-4 mt-0.5 text-primary" />}
                <div className="flex-1">
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.sender === 'user' && <MessageCircle className="w-4 h-4 mt-0.5" />}
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">Your AI Wellness Companion</h3>
              <p className="text-sm text-muted-foreground">
                Tap the microphone and tell me how you're feeling. I'm here to listen and support you! 💙
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUserInput("I'm feeling stressed about my studies")}
          >
            😰 Study Stress
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUserInput("I need motivation to keep going")}
          >
            💪 Need Motivation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};