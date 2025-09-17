import { useState, useEffect } from 'react';

// Types for our data models
export interface StudyTask {
  id: string;
  user_id?: string;
  title: string;
  subject: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  estimated_time: number;
  actual_time?: number;
  type: 'assignment' | 'reading' | 'exam' | 'project';
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id?: string;
  date: string;
  duration: number;
  subject: string;
  focus_rating: number;
  session_type: 'study' | 'break' | 'pomodoro';
  created_at: string;
}

export interface VirtualPet {
  id: string;
  user_id?: string;
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
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id?: string;
  study_streak: number;
  total_study_time: number;
  tasks_completed: number;
  current_level: number;
  badges_earned: string[];
  mood_history: Array<{
    date: string;
    mood: string;
    detected_emotion?: string;
  }>;
  created_at: string;
  updated_at: string;
}

// Mock data - replace with actual Supabase calls when properly connected
const mockTasks: StudyTask[] = [
  {
    id: '1',
    title: 'Psychology Essay',
    subject: 'Psychology',
    description: 'Write 2000-word essay on cognitive behavioral therapy',
    due_date: '2024-12-20',
    priority: 'high',
    completed: false,
    estimated_time: 180,
    type: 'assignment',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockPet: VirtualPet = {
  id: '1',
  name: 'Buddy',
  type: 'cat',
  level: 5,
  experience: 250,
  happiness: 80,
  energy: 70,
  hunger: 40,
  last_interaction: new Date().toISOString(),
  current_emotion: 'content',
  achievements: ['first_task', 'study_streak_7'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Custom hooks for data management
export const useStudyTasks = () => {
  const [tasks, setTasks] = useState<StudyTask[]>(mockTasks);
  const [loading, setLoading] = useState(false);

  const addTask = async (task: Omit<StudyTask, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    // TODO: Replace with actual Supabase call
    const newTask: StudyTask = {
      ...task,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    setLoading(false);
    return newTask;
  };

  const updateTask = async (id: string, updates: Partial<StudyTask>) => {
    setLoading(true);
    // TODO: Replace with actual Supabase call
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updated_at: new Date().toISOString() }
        : task
    ));
    setLoading(false);
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    // TODO: Replace with actual Supabase call
    setTasks(prev => prev.filter(task => task.id !== id));
    setLoading(false);
  };

  return { tasks, addTask, updateTask, deleteTask, loading };
};

export const useVirtualPet = () => {
  const [pet, setPet] = useState<VirtualPet>(mockPet);
  const [loading, setLoading] = useState(false);

  const updatePetEmotion = async (emotion: VirtualPet['current_emotion'], reason?: string) => {
    setLoading(true);
    // TODO: Replace with actual Supabase call
    setPet(prev => ({
      ...prev,
      current_emotion: emotion,
      last_interaction: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    setLoading(false);
  };

  const feedPet = async () => {
    setLoading(true);
    setPet(prev => ({
      ...prev,
      hunger: Math.max(0, prev.hunger - 30),
      happiness: Math.min(100, prev.happiness + 15),
      last_interaction: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    setLoading(false);
  };

  const playWithPet = async () => {
    setLoading(true);
    setPet(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 20),
      energy: Math.max(0, prev.energy - 10),
      experience: prev.experience + 10,
      last_interaction: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    setLoading(false);
  };

  const restPet = async () => {
    setLoading(true);
    setPet(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      last_interaction: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    setLoading(false);
  };

  return { pet, updatePetEmotion, feedPet, playWithPet, restPet, loading };
};

export const useStudyStats = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);

  const addStudySession = async (session: Omit<StudySession, 'id' | 'created_at'>) => {
    setLoading(true);
    // TODO: Replace with actual Supabase call
    const newSession: StudySession = {
      ...session,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    setSessions(prev => [...prev, newSession]);
    setLoading(false);
    return newSession;
  };

  return { sessions, progress, addStudySession, loading };
};