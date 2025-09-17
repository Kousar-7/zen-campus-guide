import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and anon key when connected
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types (will be auto-generated when Supabase is connected)
export interface Database {
  public: {
    Tables: {
      study_tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          subject: string;
          description: string | null;
          due_date: string;
          priority: 'low' | 'medium' | 'high';
          completed: boolean;
          estimated_time: number;
          actual_time: number | null;
          type: 'assignment' | 'reading' | 'exam' | 'project';
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title: string;
          subject: string;
          description?: string | null;
          due_date: string;
          priority?: 'low' | 'medium' | 'high';
          completed?: boolean;
          estimated_time: number;
          actual_time?: number | null;
          type: 'assignment' | 'reading' | 'exam' | 'project';
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          subject?: string;
          description?: string | null;
          due_date?: string;
          priority?: 'low' | 'medium' | 'high';
          completed?: boolean;
          estimated_time?: number;
          actual_time?: number | null;
          type?: 'assignment' | 'reading' | 'exam' | 'project';
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      virtual_pets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'cat' | 'dog' | 'bird' | 'dragon';
          level: number;
          experience: number;
          happiness: number;
          energy: number;
          hunger: number;
          last_interaction: string;
          current_emotion: 'happy' | 'sad' | 'excited' | 'tired' | 'hungry' | 'content';
          achievements: string[];
          customization: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          type?: 'cat' | 'dog' | 'bird' | 'dragon';
          level?: number;
          experience?: number;
          happiness?: number;
          energy?: number;
          hunger?: number;
          last_interaction?: string;
          current_emotion?: 'happy' | 'sad' | 'excited' | 'tired' | 'hungry' | 'content';
          achievements?: string[];
          customization?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: 'cat' | 'dog' | 'bird' | 'dragon';
          level?: number;
          experience?: number;
          happiness?: number;
          energy?: number;
          hunger?: number;
          last_interaction?: string;
          current_emotion?: 'happy' | 'sad' | 'excited' | 'tired' | 'hungry' | 'content';
          achievements?: string[];
          customization?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          date: string;
          duration: number;
          subject: string;
          focus_rating: number | null;
          session_type: 'study' | 'break' | 'pomodoro';
          mood_before: string | null;
          mood_after: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          task_id?: string | null;
          date: string;
          duration: number;
          subject: string;
          focus_rating?: number | null;
          session_type?: 'study' | 'break' | 'pomodoro';
          mood_before?: string | null;
          mood_after?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_id?: string | null;
          date?: string;
          duration?: number;
          subject?: string;
          focus_rating?: number | null;
          session_type?: 'study' | 'break' | 'pomodoro';
          mood_before?: string | null;
          mood_after?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type StudyTask = Database['public']['Tables']['study_tasks']['Row'];
export type VirtualPet = Database['public']['Tables']['virtual_pets']['Row'];
export type StudySession = Database['public']['Tables']['study_sessions']['Row'];