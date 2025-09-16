import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

interface Sound {
  id: string;
  name: string;
  icon: string;
  description: string;
  frequency: number; // Base frequency for generated sound
  type: "nature" | "ambient" | "rhythmic";
}

const sounds: Sound[] = [
  { id: "rain", name: "Rain Drops", icon: "🌧️", description: "Gentle rainfall sounds", frequency: 200, type: "nature" },
  { id: "ocean", name: "Ocean Waves", icon: "🌊", description: "Calming sea waves", frequency: 100, type: "nature" },
  { id: "forest", name: "Forest Whispers", icon: "🌲", description: "Birds and wind in trees", frequency: 300, type: "nature" },
  { id: "fire", name: "Crackling Fire", icon: "🔥", description: "Warm fireplace sounds", frequency: 150, type: "ambient" },
  { id: "wind", name: "Gentle Breeze", icon: "💨", description: "Soft wind blowing", frequency: 80, type: "ambient" },
  { id: "bells", name: "Tibetan Bells", icon: "🔔", description: "Meditation chimes", frequency: 440, type: "rhythmic" },
  { id: "singing", name: "Singing Bowls", icon: "🎵", description: "Crystal bowl tones", frequency: 528, type: "rhythmic" },
  { id: "heartbeat", name: "Heartbeat", icon: "💓", description: "Rhythmic pulse", frequency: 60, type: "rhythmic" },
];

export const SoundTherapy = () => {
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Record<string, OscillatorNode>>({});

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const generateSound = (sound: Sound, volume: number = 0.3) => {
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();

    // Configure based on sound type
    switch (sound.type) {
      case "nature":
        // Create noise-like effect
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
        filterNode.type = "lowpass";
        filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
        break;
      case "ambient":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
        filterNode.type = "bandpass";
        filterNode.frequency.setValueAtTime(sound.frequency * 2, audioContext.currentTime);
        break;
      case "rhythmic":
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
        // Add tremolo effect for rhythmic sounds
        const tremolo = audioContext.createOscillator();
        const tremoloGain = audioContext.createGain();
        tremolo.frequency.setValueAtTime(2, audioContext.currentTime);
        tremolo.connect(tremoloGain);
        tremoloGain.gain.setValueAtTime(0.1, audioContext.currentTime);
        tremoloGain.connect(gainNode.gain);
        tremolo.start();
        break;
    }

    gainNode.gain.setValueAtTime(volume * 0.1, audioContext.currentTime);
    
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    
    return oscillator;
  };

  const toggleSound = (sound: Sound) => {
    const isActive = activeSounds.has(sound.id);
    
    if (isActive) {
      // Stop sound
      if (oscillatorsRef.current[sound.id]) {
        oscillatorsRef.current[sound.id].stop();
        delete oscillatorsRef.current[sound.id];
      }
      setActiveSounds(prev => {
        const newSet = new Set(prev);
        newSet.delete(sound.id);
        return newSet;
      });
    } else {
      // Start sound
      const volume = volumes[sound.id] || 0.5;
      const oscillator = generateSound(sound, volume);
      oscillatorsRef.current[sound.id] = oscillator;
      
      setActiveSounds(prev => new Set([...prev, sound.id]));
    }
  };

  const adjustVolume = (soundId: string, volume: number) => {
    setVolumes(prev => ({ ...prev, [soundId]: volume }));
    
    // If sound is active, recreate with new volume
    if (activeSounds.has(soundId)) {
      const sound = sounds.find(s => s.id === soundId);
      if (sound) {
        if (oscillatorsRef.current[soundId]) {
          oscillatorsRef.current[soundId].stop();
        }
        const newOscillator = generateSound(sound, volume);
        oscillatorsRef.current[soundId] = newOscillator;
      }
    }
  };

  const stopAllSounds = () => {
    Object.values(oscillatorsRef.current).forEach(osc => osc.stop());
    oscillatorsRef.current = {};
    setActiveSounds(new Set());
  };

  return (
    <div className="space-y-6">
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Volume2 className="w-5 h-5 text-warning" />
            Sound Therapy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              Mix and match sounds to create your perfect relaxation environment
            </p>
            <p className="text-xs text-muted-foreground">
              Active sounds: {activeSounds.size}/8
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {sounds.map((sound) => {
              const isActive = activeSounds.has(sound.id);
              const volume = volumes[sound.id] || 0.5;

              return (
                <div key={sound.id} className="space-y-2">
                  <Card
                    className={`cursor-pointer transition-all duration-300 ${
                      isActive 
                        ? 'border-primary bg-primary/10 shadow-lg transform scale-105' 
                        : 'hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => toggleSound(sound)}
                  >
                    <CardContent className="p-3">
                      <div className="text-center">
                        <div className="text-2xl mb-2">{sound.icon}</div>
                        <h3 className="text-sm font-semibold text-foreground mb-1">
                          {sound.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {sound.description}
                        </p>
                        <div className="mt-2">
                          {isActive ? (
                            <Pause className="w-4 h-4 mx-auto text-primary" />
                          ) : (
                            <Play className="w-4 h-4 mx-auto text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {isActive && (
                    <div className="px-2">
                      <div className="flex items-center gap-2 text-xs">
                        <VolumeX className="w-3 h-3" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => adjustVolume(sound.id, Number(e.target.value))}
                          className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                        <Volume2 className="w-3 h-3" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {activeSounds.size > 0 && (
            <Button
              onClick={stopAllSounds}
              variant="outline"
              className="w-full"
            >
              <VolumeX className="w-4 h-4 mr-2" />
              Stop All Sounds
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="wellness-card">
        <CardContent className="p-4">
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-2">Sound Therapy Benefits</h4>
            <p className="text-sm text-muted-foreground">
              Reduces cortisol • Improves sleep quality • Enhances focus • Triggers relaxation response
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};