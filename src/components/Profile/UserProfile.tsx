import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Heart, 
  Brain,
  Calendar,
  Award,
  Phone,
  MessageCircle,
  Edit2,
  Save
} from "lucide-react";

export const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Student User",
    email: "student@university.edu",
    year: "Junior",
    major: "Computer Science"
  });
  
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    moodCheckIns: true,
    peerSupport: false,
    emergencyAlerts: true
  });

  const stats = {
    moodEntries: 28,
    mindfulnessSessions: 12,
    streakDays: 7,
    communityPosts: 3
  };

  const achievements = [
    { id: 1, title: "First Week", description: "7 days of mood tracking", icon: Calendar, earned: true },
    { id: 2, title: "Mindful Student", description: "10 mindfulness sessions", icon: Brain, earned: true },
    { id: 3, title: "Community Helper", description: "First peer support post", icon: Heart, earned: true },
    { id: 4, title: "Consistent Tracker", description: "30 days of mood entries", icon: Award, earned: false }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would save to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg">{userInfo.name}</h1>
              <p className="text-sm text-muted-foreground">{userInfo.year} • {userInfo.major}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Information */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Year</label>
                <Input
                  value={userInfo.year}
                  onChange={(e) => setUserInfo({...userInfo, year: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input
                value={userInfo.email}
                onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Major</label>
              <Input
                value={userInfo.major}
                onChange={(e) => setUserInfo({...userInfo, major: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Wellness Stats */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="text-lg">Your Wellness Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <div className="text-2xl font-bold text-primary mb-1">{stats.moodEntries}</div>
                <div className="text-sm text-muted-foreground">Mood entries</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <div className="text-2xl font-bold text-secondary mb-1">{stats.mindfulnessSessions}</div>
                <div className="text-sm text-muted-foreground">Mindfulness sessions</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <div className="text-2xl font-bold text-accent mb-1">{stats.streakDays}</div>
                <div className="text-sm text-muted-foreground">Day streak</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <div className="text-2xl font-bold text-success mb-1">{stats.communityPosts}</div>
                <div className="text-sm text-muted-foreground">Community posts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-warning" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      achievement.earned 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted bg-muted/20 opacity-60'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                      achievement.earned ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-accent" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Daily Reminders</div>
                <div className="text-xs text-muted-foreground">Mood check-ins and wellness tips</div>
              </div>
              <Switch 
                checked={notifications.dailyReminders}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, dailyReminders: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Mood Check-ins</div>
                <div className="text-xs text-muted-foreground">Gentle reminders to log your mood</div>
              </div>
              <Switch 
                checked={notifications.moodCheckIns}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, moodCheckIns: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Peer Support</div>
                <div className="text-xs text-muted-foreground">New replies to your posts</div>
              </div>
              <Switch 
                checked={notifications.peerSupport}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, peerSupport: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Emergency Alerts</div>
                <div className="text-xs text-muted-foreground">Crisis support notifications</div>
              </div>
              <Switch 
                checked={notifications.emergencyAlerts}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, emergencyAlerts: checked})
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="wellness-card border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <Phone className="w-5 h-5" />
              Emergency Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
              <Phone className="w-4 h-4 mr-2" />
              Crisis Hotline: 988
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="w-4 h-4 mr-2" />
              Campus Counseling Center
            </Button>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="wellness-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-muted-foreground" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Your mental health data is encrypted and private. We follow strict HIPAA guidelines.</p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">End-to-end encrypted</Badge>
                <Badge variant="secondary">HIPAA compliant</Badge>
                <Badge variant="secondary">Anonymous options</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};