import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Mic, MicOff } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hi there! I'm your AI wellness assistant. I'm here to listen, support, and help you navigate your mental health journey. How are you feeling today?",
    sender: 'bot',
    timestamp: new Date(),
  },
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('anxious') || input.includes('anxiety')) {
      return "I understand you're feeling anxious. That's completely valid. Let's try a simple breathing exercise: Inhale for 4 counts, hold for 4, exhale for 6. Would you like me to guide you through some other coping strategies?";
    }
    
    if (input.includes('sad') || input.includes('depressed')) {
      return "I'm sorry you're feeling this way. Your feelings are important and valid. Remember that it's okay to have difficult days. Have you tried any self-care activities today, or would you like some suggestions?";
    }
    
    if (input.includes('stress') || input.includes('stressed')) {
      return "Stress is really common among students. You're not alone in feeling this way. Let's work together to find healthy ways to manage it. What's been your biggest source of stress lately?";
    }
    
    if (input.includes('help') || input.includes('support')) {
      return "I'm here to help! You can talk to me about anything on your mind. I can also guide you to our mood tracker, stress relief games, or connect you with peer support groups. What would be most helpful right now?";
    }
    
    return "Thank you for sharing that with me. I'm here to listen and support you. Your mental health matters, and it's great that you're taking the time to check in with yourself. Is there anything specific you'd like to talk about or explore together?";
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Here you would implement voice recognition
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-primary/5 to-accent/5 pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center animate-pulse-calm">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">AI Wellness Assistant</h1>
            <p className="text-sm text-muted-foreground">Always here to help • Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'bg-primary text-primary-foreground'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <Card className={`max-w-[80%] ${
                message.sender === 'user' 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'bg-card'
              }`}>
                <CardContent className="p-3">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </CardContent>
              </Card>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <Card className="bg-card">
                <CardContent className="p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVoice}
            className={isListening ? "bg-destructive text-destructive-foreground" : ""}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Share what's on your mind..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!inputMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Quick responses */}
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {["I feel anxious", "Need support", "Feeling stressed", "Having a tough day"].map((response) => (
            <Button
              key={response}
              variant="outline"
              size="sm"
              className="whitespace-nowrap text-xs"
              onClick={() => setInputMessage(response)}
            >
              {response}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};