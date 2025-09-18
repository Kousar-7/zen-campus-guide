import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart,
  Activity,
  Moon,
  Zap,
  Watch,
  Bluetooth,
  AlertTriangle,
  TrendingUp,
  Battery,
  Wifi,
  Shield
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HealthMetrics {
  heartRate: number;
  stressLevel: number;
  sleepScore: number;
  activityLevel: number;
  batteryLife: number;
  lastSync: Date;
}

interface HealthAlert {
  id: string;
  type: 'stress' | 'heartrate' | 'sleep' | 'activity';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export const SmartWatchTracker = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [metrics, setMetrics] = useState<HealthMetrics>({
    heartRate: 0,
    stressLevel: 0,
    sleepScore: 0,
    activityLevel: 0,
    batteryLife: 0,
    lastSync: new Date()
  });
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [deviceInfo, setDeviceInfo] = useState({
    name: '',
    model: '',
    connected: false
  });

  // Simulate real-time data when connected
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        // Simulate realistic health metrics
        const newMetrics: HealthMetrics = {
          heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 BPM
          stressLevel: Math.floor(Math.random() * 100),
          sleepScore: Math.floor(Math.random() * 40) + 60, // 60-100
          activityLevel: Math.floor(Math.random() * 100),
          batteryLife: Math.max(0, metrics.batteryLife - 0.1),
          lastSync: new Date()
        };

        setMetrics(newMetrics);
        checkForAlerts(newMetrics);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isConnected, metrics.batteryLife]);

  const checkForAlerts = (currentMetrics: HealthMetrics) => {
    const newAlerts: HealthAlert[] = [];

    // High stress alert
    if (currentMetrics.stressLevel > 80) {
      newAlerts.push({
        id: Date.now().toString() + 'stress',
        type: 'stress',
        message: 'High stress levels detected. Consider taking a break and doing some breathing exercises.',
        severity: 'high',
        timestamp: new Date()
      });
    }

    // High heart rate alert
    if (currentMetrics.heartRate > 100) {
      newAlerts.push({
        id: Date.now().toString() + 'hr',
        type: 'heartrate',
        message: 'Elevated heart rate detected. Make sure you\'re staying hydrated and taking breaks.',
        severity: 'medium',
        timestamp: new Date()
      });
    }

    // Low sleep quality
    if (currentMetrics.sleepScore < 50) {
      newAlerts.push({
        id: Date.now().toString() + 'sleep',
        type: 'sleep',
        message: 'Poor sleep quality detected. Consider improving your sleep routine.',
        severity: 'medium',
        timestamp: new Date()
      });
    }

    // Low activity alert
    if (currentMetrics.activityLevel < 20) {
      newAlerts.push({
        id: Date.now().toString() + 'activity',
        type: 'activity',
        message: 'Low activity levels. Consider taking a short walk or doing some stretching.',
        severity: 'low',
        timestamp: new Date()
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev.slice(-4), ...newAlerts]);
      
      // Show toast for high severity alerts
      newAlerts.forEach(alert => {
        if (alert.severity === 'high') {
          toast({
            title: "Health Alert! ⚠️",
            description: alert.message,
            variant: "destructive"
          });
        }
      });
    }
  };

  const connectToDevice = async () => {
    setIsConnecting(true);
    
    // Simulate device connection
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      setDeviceInfo({
        name: 'Apple Watch',
        model: 'Series 9',
        connected: true
      });
      
      // Initialize with sample data
      setMetrics({
        heartRate: 72,
        stressLevel: 35,
        sleepScore: 85,
        activityLevel: 65,
        batteryLife: 78,
        lastSync: new Date()
      });

      toast({
        title: "Device Connected! ⌚",
        description: "Your smartwatch is now syncing health data."
      });
    }, 2000);
  };

  const disconnectDevice = () => {
    setIsConnected(false);
    setDeviceInfo({ name: '', model: '', connected: false });
    setMetrics({
      heartRate: 0,
      stressLevel: 0,
      sleepScore: 0,
      activityLevel: 0,
      batteryLife: 0,
      lastSync: new Date()
    });
    toast({
      title: "Device Disconnected",
      description: "Your smartwatch has been disconnected."
    });
  };

  const getMetricColor = (value: number, type: string) => {
    switch (type) {
      case 'heartRate':
        if (value < 60 || value > 100) return 'text-red-500';
        return 'text-green-500';
      case 'stress':
        if (value > 70) return 'text-red-500';
        if (value > 40) return 'text-yellow-500';
        return 'text-green-500';
      case 'sleep':
        if (value < 60) return 'text-red-500';
        if (value < 80) return 'text-yellow-500';
        return 'text-green-500';
      case 'activity':
        if (value < 30) return 'text-red-500';
        if (value < 60) return 'text-yellow-500';
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Watch className="w-5 h-5" />
          Smart Watch Health Tracker
          {isConnected && (
            <Badge variant="outline" className="bg-green-500/20 text-green-600">
              <Bluetooth className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        {!isConnected ? (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Watch className="w-12 h-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Connect Your Smart Watch</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Track your heart rate, stress levels, sleep quality, and activity throughout your study sessions.
              </p>
              <Button 
                onClick={connectToDevice}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Wifi className="w-4 h-4 mr-2 animate-pulse" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Bluetooth className="w-4 h-4 mr-2" />
                    Connect Device
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Device Info */}
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">{deviceInfo.name}</p>
                <p className="text-sm text-muted-foreground">{deviceInfo.model}</p>
              </div>
              <div className="flex items-center gap-2">
                <Battery className="w-4 h-4" />
                <span className="text-sm">{metrics.batteryLife.toFixed(0)}%</span>
                <Button variant="ghost" size="sm" onClick={disconnectDevice}>
                  Disconnect
                </Button>
              </div>
            </div>

            {/* Health Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {/* Heart Rate */}
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Heart className={`w-6 h-6 mx-auto mb-2 ${getMetricColor(metrics.heartRate, 'heartRate')}`} />
                <div className={`text-2xl font-bold ${getMetricColor(metrics.heartRate, 'heartRate')}`}>
                  {metrics.heartRate}
                </div>
                <div className="text-xs text-muted-foreground">BPM</div>
              </div>

              {/* Stress Level */}
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Zap className={`w-6 h-6 mx-auto mb-2 ${getMetricColor(metrics.stressLevel, 'stress')}`} />
                <div className={`text-2xl font-bold ${getMetricColor(metrics.stressLevel, 'stress')}`}>
                  {metrics.stressLevel}%
                </div>
                <div className="text-xs text-muted-foreground">Stress</div>
              </div>

              {/* Sleep Score */}
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Moon className={`w-6 h-6 mx-auto mb-2 ${getMetricColor(metrics.sleepScore, 'sleep')}`} />
                <div className={`text-2xl font-bold ${getMetricColor(metrics.sleepScore, 'sleep')}`}>
                  {metrics.sleepScore}
                </div>
                <div className="text-xs text-muted-foreground">Sleep Score</div>
              </div>

              {/* Activity Level */}
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Activity className={`w-6 h-6 mx-auto mb-2 ${getMetricColor(metrics.activityLevel, 'activity')}`} />
                <div className={`text-2xl font-bold ${getMetricColor(metrics.activityLevel, 'activity')}`}>
                  {metrics.activityLevel}%
                </div>
                <div className="text-xs text-muted-foreground">Activity</div>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Daily Activity Goal</span>
                  <span>{metrics.activityLevel}%</span>
                </div>
                <Progress value={metrics.activityLevel} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Stress Management</span>
                  <span>{100 - metrics.stressLevel}%</span>
                </div>
                <Progress value={100 - metrics.stressLevel} className="h-2" />
              </div>
            </div>

            {/* Recent Alerts */}
            {alerts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Health Alerts</span>
                </div>
                {alerts.slice(-3).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.severity)}`}>
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-medium capitalize">{alert.type} Alert</p>
                      <Badge variant="outline" className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Trends
              </Button>
              <Button variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
            </div>

            {/* Last Sync Info */}
            <div className="text-center text-xs text-muted-foreground">
              Last synced: {metrics.lastSync.toLocaleTimeString()}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};