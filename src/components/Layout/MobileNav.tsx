import { useState } from "react";
import { 
  Home, 
  MessageCircle, 
  Heart, 
  Users, 
  User, 
  Phone,
  Gamepad2,
  Headphones,
  Sparkles,
  ClipboardList,
  BookOpen,
  Target,
  Moon,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "chat", icon: MessageCircle, label: "Chat" },
  { id: "mood", icon: Heart, label: "Mood" },
  { id: "games", icon: Gamepad2, label: "Relief" },
  { id: "mindfulness", icon: Headphones, label: "Mindful" },
];

const moreNavItems = [
  { id: "lantern", icon: Sparkles, label: "Sky Peace" },
  { id: "assessment", icon: ClipboardList, label: "Assessment" },
  { id: "resources", icon: BookOpen, label: "Resources" },
  { id: "habits", icon: Target, label: "Habits" },
  { id: "sleep", icon: Moon, label: "Sleep" },
  { id: "study", icon: Calendar, label: "Study" },
  { id: "community", icon: Users, label: "Community" },
  { id: "profile", icon: User, label: "Profile" },
];

export const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => {
  const [showMore, setShowMore] = useState(false);
  
  const currentNavItems = showMore ? moreNavItems : navItems;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[50px]",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("w-4 h-4 mb-1", isActive && "animate-pulse-calm")} />
              <span className={cn("text-xs font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
            </button>
          );
        })}
        
        {/* More/Main Toggle */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[50px] text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <div className="w-4 h-4 mb-1 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-1 h-1 bg-current rounded-full"></div>
              <div className="w-1 h-1 bg-current rounded-full"></div>
              <div className="w-1 h-1 bg-current rounded-full"></div>
              <div className="w-1 h-1 bg-current rounded-full"></div>
            </div>
          </div>
          <span className="text-xs font-medium">{showMore ? 'Main' : 'More'}</span>
        </button>
      </div>
      
      {/* Emergency SOS Button */}
      <div className="absolute -top-6 right-4">
        <button className="bg-destructive text-destructive-foreground p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 animate-pulse">
          <Phone className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
};