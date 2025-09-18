import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart,
  Zap,
  Coffee,
  Star,
  Gift,
  MessageCircle,
  Sparkles,
  Crown,
  Trophy,
  Smile,
  Frown,
  Meh,
  Battery,
  Apple
} from "lucide-react";
import { useVirtualPet } from "@/hooks/useSupabase";
import { toast } from "@/hooks/use-toast";

interface PetMessage {
  id: string;
  message: string;
  emotion: string;
  timestamp: Date;
}

export const VirtualPet = () => {
  const { pet, updatePetEmotion, feedPet, playWithPet, restPet, loading } = useVirtualPet();
  const [messages, setMessages] = useState<PetMessage[]>([]);
  const [lastEmotionCheck, setLastEmotionCheck] = useState<Date>(new Date());

  // Pet emotional responses based on user's detected emotions
  const emotionResponses = {
    happy: [
      "I'm so happy to see you smiling! 😊",
      "Your joy is contagious! Keep up the great work! ✨",
      "You look amazing today! Let's study together! 📚"
    ],
    sad: [
      "I'm here for you. Want to take a short break? 💙",
      "It's okay to feel sad sometimes. I believe in you! 🤗",
      "Let's do something fun together to cheer you up! 🎮"
    ],
    stressed: [
      "I can sense you're stressed. Let's try some deep breathing! 🧘‍♀️",
      "Remember to take breaks! You're doing great! 💪",
      "Stress is temporary, but your progress is lasting! 📈"
    ],
    tired: [
      "You look tired! Maybe it's time for a power nap? 😴",
      "Rest is important too! I'll be here when you're ready! 💤",
      "Let's recharge together! You've earned a break! ⚡"
    ],
    focused: [
      "I love seeing you so focused! You're in the zone! 🎯",
      "Your concentration is amazing! Keep it up! 🔥",
      "Focus mode activated! I'm cheering you on silently! 📚"
    ],
    excited: [
      "Your excitement is awesome! Channel that energy! ⚡",
      "I love your enthusiasm! Let's tackle those tasks! 🚀",
      "Your positive energy is inspiring! Keep going! ⭐"
    ]
  };

  // Study-related motivational messages
  const studyMotivation = [
    "Every small step counts towards your goals! 🎯",
    "You're building great study habits! I'm proud! 👏",
    "Remember: progress, not perfection! 📈",
    "Your dedication is inspiring me too! 💪",
    "Let's make today count together! ✨"
  ];

  const getPetAvatar = () => {
    const emotion = pet.current_emotion;
    switch (pet.type) {
      case 'cat':
        return emotion === 'happy' ? '😸' : emotion === 'sad' ? '😿' : 
               emotion === 'tired' ? '😴' : emotion === 'hungry' ? '🙀' : '😺';
      case 'dog':
        return emotion === 'happy' ? '🐕' : emotion === 'sad' ? '😢🐕' : 
               emotion === 'tired' ? '😴🐕' : emotion === 'hungry' ? '🥺🐕' : '🐶';
      case 'dragon':
        return emotion === 'happy' ? '🐲' : emotion === 'sad' ? '😢🐲' : 
               emotion === 'tired' ? '😴🐲' : emotion === 'hungry' ? '🥺🐲' : '🐉';
      default:
        return '🐱';
    }
  };

  const getEmotionIcon = () => {
    switch (pet.current_emotion) {
      case 'happy': return <Smile className="w-4 h-4 text-green-500" />;
      case 'sad': return <Frown className="w-4 h-4 text-blue-500" />;
      case 'tired': return <Battery className="w-4 h-4 text-yellow-500" />;
      case 'hungry': return <Apple className="w-4 h-4 text-orange-500" />;
      default: return <Meh className="w-4 h-4 text-gray-500" />;
    }
  };

  const addMessage = (message: string, emotion: string) => {
    const newMessage: PetMessage = {
      id: Date.now().toString(),
      message,
      emotion,
      timestamp: new Date()
    };
    setMessages(prev => [...prev.slice(-4), newMessage]); // Keep last 5 messages
  };

  const handleFeed = async () => {
    await feedPet();
    const responses = [
      "Yum! That was delicious! Thank you! 🍎",
      "I feel so much better now! Ready to support you! 💪",
      "Food makes everything better! Let's study! 📚"
    ];
    addMessage(responses[Math.floor(Math.random() * responses.length)], 'happy');
    toast({
      title: "Pet Fed! 🍎",
      description: `${pet.name} is happy and well-fed!`
    });
  };

  const handlePlay = async () => {
    await playWithPet();
    const responses = [
      "That was so fun! I'm energized now! ⚡",
      "Playing with you is the best! Let's get back to work! 🎮",
      "I love our play time! You're the best study buddy! 💝"
    ];
    addMessage(responses[Math.floor(Math.random() * responses.length)], 'excited');
    toast({
      title: "Playtime! 🎮",
      description: `${pet.name} had fun and gained experience!`
    });
  };

  const handleRest = async () => {
    await restPet();
    addMessage("Ahh, that nap was refreshing! Ready to help you study! 😴✨", 'content');
    toast({
      title: "Pet Rested! 😴",
      description: `${pet.name} is recharged and ready!`
    });
  };

  // Enhanced emotion detection with more nuanced responses
  const respondToUserEmotion = (detectedEmotion: string) => {
    const responses = emotionResponses[detectedEmotion as keyof typeof emotionResponses] || studyMotivation;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addMessage(randomResponse, detectedEmotion);
    updatePetEmotion(detectedEmotion === 'sad' || detectedEmotion === 'stressed' ? 'content' : 'happy');
  };

  // Auto-generate motivational messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every minute
        const randomMessage = studyMotivation[Math.floor(Math.random() * studyMotivation.length)];
        addMessage(randomMessage, 'supportive');
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  // Pet needs simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate pet needs degrading over time
      const timeSinceLastInteraction = Date.now() - new Date(pet.last_interaction).getTime();
      const hoursSince = timeSinceLastInteraction / (1000 * 60 * 60);
      
      if (hoursSince > 2 && pet.hunger < 50) {
        updatePetEmotion('hungry');
        addMessage("I'm getting a bit hungry... 🥺", 'hungry');
      } else if (hoursSince > 4 && pet.energy < 30) {
        updatePetEmotion('tired');
        addMessage("I'm feeling sleepy... maybe we should rest? 😴", 'tired');
      }
    }, 300000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [pet, updatePetEmotion]);

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          {pet.name} - Your Study Buddy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pet Avatar and Stats */}
        <div className="text-center space-y-4">
          <div className="text-8xl animate-float">
            {getPetAvatar()}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="border-primary/30">
                Level {pet.level}
              </Badge>
              <Badge variant="outline" className="border-accent/30">
                {pet.type}
              </Badge>
              <div className="flex items-center gap-1">
                {getEmotionIcon()}
                <span className="text-sm capitalize">{pet.current_emotion}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pet Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Heart className="w-5 h-5 mx-auto mb-1 text-red-500" />
            <Progress value={pet.happiness} className="h-2 mb-1" />
            <div className="text-xs text-muted-foreground">{pet.happiness}% Happy</div>
          </div>
          <div className="text-center">
            <Zap className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
            <Progress value={pet.energy} className="h-2 mb-1" />
            <div className="text-xs text-muted-foreground">{pet.energy}% Energy</div>
          </div>
          <div className="text-center">
            <Apple className="w-5 h-5 mx-auto mb-1 text-green-500" />
            <Progress value={100 - pet.hunger} className="h-2 mb-1" />
            <div className="text-xs text-muted-foreground">{100 - pet.hunger}% Full</div>
          </div>
        </div>

        {/* Pet Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button 
            onClick={handleFeed}
            variant="outline"
            size="sm"
            className="border-green-500/30 hover:bg-green-500/10"
            disabled={loading}
          >
            <Apple className="w-4 h-4 mr-1" />
            Feed
          </Button>
          <Button 
            onClick={handlePlay}
            variant="outline"
            size="sm"
            className="border-blue-500/30 hover:bg-blue-500/10"
            disabled={loading}
          >
            <Star className="w-4 h-4 mr-1" />
            Play
          </Button>
          <Button 
            onClick={handleRest}
            variant="outline"
            size="sm"
            className="border-purple-500/30 hover:bg-purple-500/10"
            disabled={loading}
          >
            <Coffee className="w-4 h-4 mr-1" />
            Rest
          </Button>
        </div>

        {/* Experience Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Experience</span>
            <span>{pet.experience} / {(pet.level + 1) * 100} XP</span>
          </div>
          <Progress value={(pet.experience / ((pet.level + 1) * 100)) * 100} className="h-2" />
        </div>

        {/* Recent Messages */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Recent Messages</span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {messages.slice(-3).map((message) => (
              <div key={message.id} className="p-2 bg-muted/50 rounded-lg">
                <div className="text-sm">{message.message}</div>
                <div className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4">
                No messages yet. Start studying and I'll cheer you on! 📚✨
              </div>
            )}
          </div>
        </div>

        {/* Emotion Response Test Buttons - Enhanced */}
        <div className="grid grid-cols-3 gap-1 pt-4 border-t border-border">
          <Button 
            onClick={() => respondToUserEmotion('happy')}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            😊 Happy
          </Button>
          <Button 
            onClick={() => respondToUserEmotion('stressed')}
            variant="outline" 
            size="sm"
            className="text-xs"
          >
            😰 Stressed
          </Button>
          <Button 
            onClick={() => respondToUserEmotion('tired')}
            variant="outline" 
            size="sm"
            className="text-xs"
          >
            😴 Tired
          </Button>
        </div>

        {/* Pet Achievements */}
        {pet.achievements && pet.achievements.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Achievements</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {pet.achievements.map((achievement) => (
                <Badge key={achievement} variant="outline" className="text-xs bg-yellow-500/10 border-yellow-500/30">
                  🏆 {achievement.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};