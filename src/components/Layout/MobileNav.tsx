import { Home, MessageCircle, Heart, Users, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Home" },
  { id: "chat", icon: MessageCircle, label: "Chat" },
  { id: "mood", icon: Heart, label: "Mood" },
  { id: "community", icon: Users, label: "Community" },
  { id: "profile", icon: User, label: "Profile" },
];

export const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[60px]",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-1", isActive && "animate-pulse-calm")} />
              <span className={cn("text-xs font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
            </button>
          );
        })}
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