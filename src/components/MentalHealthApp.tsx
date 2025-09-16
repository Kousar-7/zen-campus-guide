import { useState } from "react";
import { MobileNav } from "./Layout/MobileNav";
import { DashboardHome } from "./Dashboard/DashboardHome";
import { ChatInterface } from "./Chatbot/ChatInterface";
import { MoodInterface } from "./MoodTracker/MoodInterface";
import { PeerSupport } from "./Community/PeerSupport";
import { GameHub } from "./Games/GameHub";
import { MindfulnessHub } from "./Mindfulness/MindfulnessHub";
import { UserProfile } from "./Profile/UserProfile";
import { LanternRelease } from "./SkyOfPeace/LanternRelease";
import { SelfAssessment } from "./Assessment/SelfAssessment";
import { ResourceConnector } from "./Resources/ResourceConnector";
import { HabitTracker } from "./Habits/HabitTracker";
import { SleepTracker } from "./Sleep/SleepTracker";
import { LocationTracker } from "./Location/LocationTracker";
import { EmotionDetector } from "./Emotion/EmotionDetector";
import { HealthDashboard } from "./Health/HealthDashboard";

export const MentalHealthApp = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleNavigate = (page: string) => {
    setActiveTab(page);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome onNavigate={handleNavigate} />;
      case "chat":
        return <ChatInterface />;
      case "mood":
        return <MoodInterface />;
      case "community":
        return <PeerSupport />;
      case "profile":
        return <UserProfile />;
      case "games":
        return <GameHub />;
      case "mindfulness":
        return <MindfulnessHub />;
      case "lantern":
        return <LanternRelease />;
      case "assessment":
        return <SelfAssessment />;
      case "resources":
        return <ResourceConnector />;
      case "habits":
        return <HabitTracker />;
      case "sleep":
        return <SleepTracker />;
      case "location":
        return <LocationTracker />;
      case "emotion":
        return <EmotionDetector />;
      case "health":
        return <HealthDashboard />;
      default:
        return <DashboardHome onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderActiveComponent()}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};