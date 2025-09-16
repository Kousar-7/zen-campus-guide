import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Moon, 
  Sun, 
  Clock, 
  Headphones, 
  Volume2,
  Play,
  Pause,
  BarChart3,
  Target
} from "lucide-react";
import { toast } from "sonner";

const calmingSounds = [
  { id: 1, name: "Rain", icon: "🌧️", playing: false },
  { id: 2, name: "Ocean Waves", icon: "🌊", playing: false },
  { id: 3, name: "Forest", icon: "🌲", playing: false },
  { id: 4, name: "White Noise", icon: "📻", playing: false },
  { id: 5, name: "Soft Piano", icon: "🎹", playing: false },
  { id: 6, name: "Nature Sounds", icon: "🦋", playing: false },
];

const sleepData = [
  { day: "Mon", hours: 7.5, quality: 4 },
  { day: "Tue", hours: 6.5, quality: 3 },
  { day: "Wed", hours: 8.0, quality: 5 },
  { day: "Thu", hours: 7.0, quality: 4 },
  { day: "Fri", hours: 6.0, quality: 2 },
  { day: "Sat", hours: 9.0, quality: 5 },
  { day: "Sun", hours: 8.5, quality: 4 },
];

export const SleepTracker = () => {
  const [bedtime, setBedtime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [volume, setVolume] = useState([50]);
  const [playingSounds, setPlayingSounds] = useState<number[]>([]);
  const [sleepGoal] = useState(8); // hours

  const toggleSound = (soundId: number) => {
    setPlayingSounds(prev => {
      if (prev.includes(soundId)) {
        toast.info("Sound stopped");
        return prev.filter(id => id !== soundId);
      } else {
        toast.success("Playing calming sound");
        return [...prev, soundId];
      }
    });
  };

  const calculateSleepDuration = () => {
    const [bedHour, bedMinute] = bedtime.split(':').map(Number);
    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
    
    let duration = (wakeHour * 60 + wakeMinute) - (bedHour * 60 + bedMinute);
    if (duration < 0) duration += 24 * 60; // Handle overnight sleep
    
    return duration / 60;
  };

  const averageSleep = sleepData.reduce((sum, day) => sum + day.hours, 0) / sleepData.length;
  const averageQuality = sleepData.reduce((sum, day) => sum + day.quality, 0) / sleepData.length;
  const plannedDuration = calculateSleepDuration();

  const getQualityColor = (quality: number) => {
    if (quality >= 4) return "text-success";
    if (quality >= 3) return "text-warning";
    return "text-destructive";
  };

  const getHoursColor = (hours: number) => {
    if (hours >= 7 && hours <= 9) return "text-success";
    if (hours >= 6 && hours <= 10) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-blue-950 text-white pb-20">
      <div className="p-4 pt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Moon className="w-6 h-6 text-blue-300" />
            Sleep Tracker
          </h1>
          <p className="text-white/80">Track your sleep and create healthy bedtime routines</p>
        </div>

        {/* Sleep Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6 max-w-md mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <CardContent className="p-3">
              <div className="text-lg font-bold text-blue-300">{averageSleep.toFixed(1)}h</div>
              <div className="text-xs text-white/70">Avg Sleep</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <CardContent className="p-3">
              <div className="text-lg font-bold text-purple-300">{averageQuality.toFixed(1)}/5</div>
              <div className="text-xs text-white/70">Quality</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
            <CardContent className="p-3">
              <div className="text-lg font-bold text-green-300">{sleepGoal}h</div>
              <div className="text-xs text-white/70">Goal</div>
            </CardContent>
          </Card>
        </div>

        {/* Sleep Schedule */}
        <Card className="max-w-md mx-auto mb-6 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Clock className="w-5 h-5 text-blue-300" />
              Sleep Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-blue-300" />
                <span className="text-white">Bedtime</span>
              </div>
              <input 
                type="time" 
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-300" />
                <span className="text-white">Wake Time</span>
              </div>
              <input 
                type="time" 
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
              />
            </div>
            
            <div className="text-center pt-2 border-t border-white/20">
              <p className="text-sm text-white/70">Planned Sleep Duration</p>
              <p className={`text-xl font-bold ${getHoursColor(plannedDuration)}`}>
                {plannedDuration.toFixed(1)} hours
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Calming Sounds */}
        <Card className="max-w-md mx-auto mb-6 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <Headphones className="w-5 h-5 text-purple-300" />
              Calming Sounds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm">Volume</span>
              </div>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {calmingSounds.map(sound => {
                const isPlaying = playingSounds.includes(sound.id);
                return (
                  <Button
                    key={sound.id}
                    variant={isPlaying ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSound(sound.id)}
                    className={`flex flex-col gap-1 h-auto py-3 ${
                      isPlaying 
                        ? 'bg-white/20 text-white border-white/30' 
                        : 'bg-white/5 text-white/80 border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">{sound.icon}</span>
                    <span className="text-xs">{sound.name}</span>
                    {isPlaying && <Play className="w-3 h-3" />}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Sleep Chart */}
        <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <BarChart3 className="w-5 h-5 text-green-300" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sleepData.map(day => (
                <div key={day.day} className="flex items-center justify-between">
                  <span className="text-white/80 text-sm w-8">{day.day}</span>
                  <div className="flex-1 mx-3">
                    <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-purple-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(day.hours / 12) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`font-medium ${getHoursColor(day.hours)}`}>
                      {day.hours}h
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={i < day.quality ? 'text-yellow-400' : 'text-white/20'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};