-- Enhanced Study Planner & Virtual Pet Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  study_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Study tasks
CREATE TABLE IF NOT EXISTS public.study_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  subject VARCHAR(100) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  completed BOOLEAN DEFAULT FALSE,
  estimated_time INTEGER NOT NULL, -- in minutes
  actual_time INTEGER, -- in minutes
  type VARCHAR(20) CHECK (type IN ('assignment', 'reading', 'exam', 'project')) NOT NULL,
  tags TEXT[], -- for categorization
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Study sessions (pomodoro, regular study, breaks)
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES public.study_tasks ON DELETE SET NULL,
  date DATE NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  subject VARCHAR(100) NOT NULL,
  focus_rating INTEGER CHECK (focus_rating >= 1 AND focus_rating <= 5),
  session_type VARCHAR(20) CHECK (session_type IN ('study', 'break', 'pomodoro')) DEFAULT 'study',
  mood_before VARCHAR(20),
  mood_after VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Virtual pets
CREATE TABLE IF NOT EXISTS public.virtual_pets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name VARCHAR(50) NOT NULL,
  type VARCHAR(20) CHECK (type IN ('cat', 'dog', 'bird', 'dragon')) DEFAULT 'cat',
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  happiness INTEGER DEFAULT 50 CHECK (happiness >= 0 AND happiness <= 100),
  energy INTEGER DEFAULT 100 CHECK (energy >= 0 AND energy <= 100),
  hunger INTEGER DEFAULT 50 CHECK (hunger >= 0 AND hunger <= 100),
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  current_emotion VARCHAR(20) DEFAULT 'content' CHECK (current_emotion IN ('happy', 'sad', 'excited', 'tired', 'hungry', 'content')),
  achievements TEXT[] DEFAULT '{}',
  customization JSONB DEFAULT '{}', -- for pet appearance, accessories
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User progress and statistics
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  study_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_study_time INTEGER DEFAULT 0, -- in minutes
  tasks_completed INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  badges_earned TEXT[] DEFAULT '{}',
  weekly_goal INTEGER DEFAULT 5, -- days per week
  daily_goal INTEGER DEFAULT 120, -- minutes per day
  last_study_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Mood tracking (from emotion detection)
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  detected_emotion VARCHAR(20) NOT NULL,
  confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
  manual_mood VARCHAR(20), -- if user manually sets mood
  context VARCHAR(50), -- 'study', 'break', 'general'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pet interactions and messages
CREATE TABLE IF NOT EXISTS public.pet_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES public.virtual_pets ON DELETE CASCADE NOT NULL,
  interaction_type VARCHAR(20) CHECK (interaction_type IN ('feed', 'play', 'rest', 'message', 'emotion_response')) NOT NULL,
  message TEXT,
  user_emotion VARCHAR(20),
  pet_emotion_change VARCHAR(20),
  experience_gained INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Achievements and badges
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50),
  category VARCHAR(30) CHECK (category IN ('study', 'streak', 'pet', 'social', 'wellness')),
  requirement_type VARCHAR(30) CHECK (requirement_type IN ('count', 'streak', 'total', 'special')),
  requirement_value INTEGER,
  reward_experience INTEGER DEFAULT 0,
  reward_pet_happiness INTEGER DEFAULT 0,
  is_secret BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User achievements (many-to-many)
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, achievement_id)
);

-- Wellness reminders and notifications
CREATE TABLE IF NOT EXISTS public.wellness_reminders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type VARCHAR(30) CHECK (type IN ('break', 'water', 'posture', 'breathing', 'mood_check')),
  message TEXT NOT NULL,
  frequency_minutes INTEGER DEFAULT 60,
  is_enabled BOOLEAN DEFAULT TRUE,
  last_triggered TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_study_tasks_user_id ON public.study_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_due_date ON public.study_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_date ON public.study_sessions(date);
CREATE INDEX IF NOT EXISTS idx_virtual_pets_user_id ON public.virtual_pets(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON public.mood_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_pet_interactions_user_id ON public.pet_interactions(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_reminders ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for study_tasks
CREATE POLICY "Users can view own tasks" ON public.study_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks" ON public.study_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.study_tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON public.study_tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for study_sessions
CREATE POLICY "Users can view own sessions" ON public.study_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON public.study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for virtual_pets
CREATE POLICY "Users can view own pets" ON public.virtual_pets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own pets" ON public.virtual_pets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets" ON public.virtual_pets
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for user_progress
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for mood_entries
CREATE POLICY "Users can view own mood entries" ON public.mood_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own mood entries" ON public.mood_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for pet_interactions
CREATE POLICY "Users can view own pet interactions" ON public.pet_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own pet interactions" ON public.pet_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for user_achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for wellness_reminders
CREATE POLICY "Users can view own reminders" ON public.wellness_reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reminders" ON public.wellness_reminders
  FOR ALL USING (auth.uid() = user_id);

-- Achievements public read policy
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements are publicly readable" ON public.achievements
  FOR SELECT TO authenticated USING (true);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_study_tasks_updated_at
  BEFORE UPDATE ON public.study_tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_virtual_pets_updated_at
  BEFORE UPDATE ON public.virtual_pets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_wellness_reminders_updated_at
  BEFORE UPDATE ON public.wellness_reminders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert default achievements
INSERT INTO public.achievements (code, name, description, icon, category, requirement_type, requirement_value, reward_experience, reward_pet_happiness) VALUES
('first_task', 'Getting Started', 'Complete your first study task', 'checkCircle', 'study', 'count', 1, 10, 5),
('streak_3', 'Getting Into It', 'Study for 3 days in a row', 'flame', 'streak', 'streak', 3, 25, 10),
('streak_7', 'Week Warrior', 'Study for 7 days in a row', 'star', 'streak', 'streak', 7, 50, 15),
('streak_30', 'Month Master', 'Study for 30 days in a row', 'crown', 'streak', 'streak', 30, 200, 25),
('tasks_10', 'Task Tackler', 'Complete 10 study tasks', 'target', 'study', 'count', 10, 40, 10),
('tasks_50', 'Study Machine', 'Complete 50 study tasks', 'trophy', 'study', 'count', 50, 150, 20),
('time_1000', 'Study Legend', 'Study for 1000 minutes total', 'clock', 'study', 'total', 1000, 100, 15),
('pet_friend', 'Pet Whisperer', 'Play with your pet 20 times', 'heart', 'pet', 'count', 20, 30, 20),
('early_bird', 'Early Bird', 'Study before 8 AM', 'sunrise', 'wellness', 'special', 0, 20, 10),
('night_owl', 'Night Owl', 'Study after 10 PM', 'moon', 'wellness', 'special', 0, 20, 10)
ON CONFLICT (code) DO NOTHING;