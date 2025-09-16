import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MapPin, Bell, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface LocationZone {
  id: string;
  name: string;
  emoji: string;
  center: { lat: number; lng: number };
  radius: number; // in meters
  notifications: string[];
}

const predefinedZones: LocationZone[] = [
  {
    id: "campus",
    name: "Campus/University",
    emoji: "🎓",
    center: { lat: 0, lng: 0 }, // Will be set when user enables
    radius: 500,
    notifications: [
      "You're on campus! Remember to breathe and stay present 🌸",
      "Study break reminder: Take 5 minutes for mindful breathing",
      "Campus can be stressful - you've got this! 💪",
      "Time for a mental health check-in while you're here"
    ]
  },
  {
    id: "home",
    name: "Home",
    emoji: "🏠",
    center: { lat: 0, lng: 0 },
    radius: 100,
    notifications: [
      "Welcome home! Time to unwind and relax 🏡",
      "Home sweet home - perfect time for self-care",
      "You're safe at home - practice some gratitude",
      "Evening wind-down: Try some gentle stretches"
    ]
  },
  {
    id: "gym",
    name: "Gym/Fitness",
    emoji: "🏋️‍♀️",
    center: { lat: 0, lng: 0 },
    radius: 200,
    notifications: [
      "Great job staying active! Your mental health thanks you 💪",
      "Physical activity boosts mood - you're doing amazing!",
      "Remember to hydrate and listen to your body",
      "Exercise is medicine for the mind - keep going!"
    ]
  }
];

export const LocationTracker = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [zones, setZones] = useState<LocationZone[]>(predefinedZones);
  const [currentZone, setCurrentZone] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>("prompt");

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if (isEnabled) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
  }, [isEnabled]);

  const checkLocationPermission = async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(result.state);
        
        result.onchange = () => {
          setPermissionStatus(result.state);
        };
      } catch (error) {
        console.log("Permission API not supported");
      }
    }
  };

  const requestLocationPermission = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setPermissionStatus("granted");
        toast.success("Location access granted! Smart notifications are now active.");
      },
      (error) => {
        setPermissionStatus("denied");
        toast.error("Location access denied. Enable in browser settings for smart notifications.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  };

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        
        setCurrentLocation(newLocation);
        checkZones(newLocation);
      },
      (error) => {
        toast.error("Unable to access location. Please check your settings.");
        setIsEnabled(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 300000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  };

  const stopLocationTracking = () => {
    setCurrentLocation(null);
    setCurrentZone(null);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const checkZones = (location: LocationData) => {
    for (const zone of zones) {
      if (zone.center.lat === 0 && zone.center.lng === 0) continue; // Skip unset zones
      
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        zone.center.lat,
        zone.center.lng
      );

      if (distance <= zone.radius && currentZone !== zone.id) {
        setCurrentZone(zone.id);
        sendLocationNotification(zone);
        break;
      }
    }
  };

  const sendLocationNotification = (zone: LocationZone) => {
    const message = zone.notifications[Math.floor(Math.random() * zone.notifications.length)];
    toast.success(`${zone.emoji} ${message}`, {
      duration: 5000,
      action: {
        label: "Open App",
        onClick: () => {
          // Could navigate to specific section
        }
      }
    });
  };

  const setZoneLocation = (zoneId: string) => {
    if (!currentLocation) {
      toast.error("Current location not available. Please enable location tracking first.");
      return;
    }

    setZones(prev => prev.map(zone => 
      zone.id === zoneId 
        ? { 
            ...zone, 
            center: { 
              lat: currentLocation.latitude, 
              lng: currentLocation.longitude 
            }
          }
        : zone
    ));
    
    const zone = zones.find(z => z.id === zoneId);
    toast.success(`${zone?.emoji} ${zone?.name} location set successfully!`);
  };

  return (
    <div className="space-y-6">
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-primary" />
            Smart Location Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                Get contextual wellness reminders based on your location
              </p>
            </div>

            {/* Permission Status */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              {permissionStatus === "granted" ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-warning" />
              )}
              <div className="flex-1">
                <div className="font-medium text-foreground">Location Permission</div>
                <div className="text-sm text-muted-foreground">
                  {permissionStatus === "granted" && "Location access granted"}
                  {permissionStatus === "denied" && "Location access denied"}
                  {permissionStatus === "prompt" && "Permission needed for smart notifications"}
                </div>
              </div>
              {permissionStatus !== "granted" && (
                <Button size="sm" onClick={requestLocationPermission}>
                  Enable
                </Button>
              )}
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div>
                <div className="font-medium text-foreground">Smart Notifications</div>
                <div className="text-sm text-muted-foreground">
                  Receive location-based wellness reminders
                </div>
              </div>
              <Switch
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
                disabled={permissionStatus !== "granted"}
              />
            </div>

            {/* Current Status */}
            {isEnabled && currentLocation && (
              <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
                <Bell className="w-5 h-5 text-success mx-auto mb-1" />
                <div className="text-sm font-medium text-success">
                  Smart notifications are active
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentZone ? `Currently in: ${zones.find(z => z.id === currentZone)?.name}` : "Monitoring location..."}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Zone Configuration */}
      <Card className="wellness-card">
        <CardHeader>
          <CardTitle className="text-lg">Configure Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Set up locations where you'd like to receive wellness reminders
            </p>
            
            {zones.map((zone) => (
              <div key={zone.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{zone.emoji}</div>
                  <div>
                    <div className="font-medium text-foreground">{zone.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {zone.center.lat === 0 ? "Not set" : "Location saved"}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setZoneLocation(zone.id)}
                  disabled={!currentLocation}
                >
                  {zone.center.lat === 0 ? "Set Here" : "Update"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Notifications */}
      <Card className="wellness-card">
        <CardContent className="p-4">
          <h4 className="font-semibold text-foreground mb-3">Example Notifications</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span>🎓</span>
              <span className="text-muted-foreground">"You're on campus! Remember to breathe and stay present"</span>
            </div>
            <div className="flex items-start gap-2">
              <span>🏠</span>
              <span className="text-muted-foreground">"Welcome home! Time to unwind and relax"</span>
            </div>
            <div className="flex items-start gap-2">
              <span>🏋️‍♀️</span>
              <span className="text-muted-foreground">"Great job staying active! Your mental health thanks you"</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};