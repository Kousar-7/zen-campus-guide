import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Heart, Save } from "lucide-react";

interface MoodEntry {
  date: Date;
  mood: number;
  emotions: string[];
  notes: string;
}

const moodLevels = [
  { value: 1, emoji: "😢", label: "Very Low", color: "bg-destructive" },
  { value: 2, emoji: "😔", label: "Low", color: "bg-orange-500" },
  { value: 3, emoji: "😐", label: "Neutral", color: "bg-warning" },
  { value: 4, emoji: "🙂", label: "Good", color: "bg-secondary" },
  { value: 5, emoji: "😊", label: "Great", color: "bg-success" },
];

const emotionTags = [
  "Happy", "Sad", "Anxious", "Excited", "Calm", "Stressed", 
  "Grateful", "Lonely", "Confident", "Overwhelmed", "Peaceful", "Angry"
];

const recentEntries: MoodEntry[] = [
  {
    date: new Date(Date.now() - 86400000),
    mood: 4,
    emotions: ["Happy", "Grateful"],
    notes: "Had a great study session with friends"
  },
  {
    date: new Date(Date.now() - 172800000),
    mood: 2,
    emotions: ["Stressed", "Anxious"],
    notes: "Worried about upcoming exams"
  },
];

export const MoodInterface = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const saveMoodEntry = () => {
    if (!selectedMood) return;
    
    const newEntry: MoodEntry = {
      date: new Date(),
      mood: selectedMood,
      emotions: selectedEmotions,
      notes: notes,
    };
    
    // Here you would save to backend
    console.log("Saving mood entry:", newEntry);
    
    // Reset form
    setSelectedMood(null);
    setSelectedEmotions([]);
    setNotes("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-primary/5 pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">Mood Tracker</h1>
            <p className="text-sm text-muted-foreground">Track your emotional wellbeing</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Current Mood Selection */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="text-lg">How are you feeling right now?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {moodLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setSelectedMood(level.value)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedMood === level.value
                      ? 'border-primary bg-primary/10 scale-105'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <span className="text-3xl mb-2">{level.emoji}</span>
                  <span className="text-xs font-medium text-center">{level.label}</span>
                </button>
              ))}
            </div>

            {/* Emotion Tags */}
            {selectedMood && (
              <div className="space-y-4">
                <h3 className="font-medium">What emotions are you experiencing?</h3>
                <div className="flex flex-wrap gap-2">
                  {emotionTags.map((emotion) => (
                    <Badge
                      key={emotion}
                      variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => toggleEmotion(emotion)}
                    >
                      {emotion}
                    </Badge>
                  ))}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <h3 className="font-medium">Additional notes (optional)</h3>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What happened today? How are you feeling?"
                    className="min-h-[80px]"
                  />
                </div>

                <Button 
                  onClick={saveMoodEntry} 
                  className="w-full"
                  disabled={!selectedMood}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Mood Entry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Insights */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              Your Mood Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">7</div>
                  <div className="text-sm text-muted-foreground">Day streak</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">😊</div>
                  <div className="text-sm text-muted-foreground">Most common</div>
                </div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                Keep tracking to see your patterns and progress!
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.map((entry, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">
                      {moodLevels.find(m => m.value === entry.mood)?.emoji}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {entry.date.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.emotions.map((emotion) => (
                      <Badge key={emotion} variant="secondary" className="text-xs">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};