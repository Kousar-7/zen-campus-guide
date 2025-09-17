import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  Clock,
  BookOpen,
  Target,
  Plus,
  CheckCircle2,
  Circle,
  Star,
  Brain,
  Coffee,
  AlertCircle,
  Timer,
  Award,
  Heart
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useStudyTasks, useStudyStats } from "@/hooks/useSupabase";
import { PomodoroTimer } from "./PomodoroTimer";
import { StudyStreaks } from "./StudyStreaks";
import { VirtualPet } from "@/components/VirtualPet/VirtualPet";

// Task and Session interfaces moved to useSupabase hook

// Default data moved to useSupabase hook

export const StudyPlanner = () => {
  const { tasks, addTask, updateTask, loading } = useStudyTasks();
  const { sessions, addStudySession } = useStudyStats();
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    description: '',
    due_date: '',
    priority: 'medium' as const,
    estimated_time: 60,
    type: 'assignment' as const,
    completed: false
  });

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
      
      if (!task.completed) {
        toast({
          title: "Task Completed! 🎉",
          description: `Great job finishing "${task.title}"!`,
        });
      }
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.subject || !newTask.due_date) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, subject, and due date.",
        variant: "destructive"
      });
      return;
    }

    try {
      const task = await addTask(newTask);
      setNewTask({
        title: '',
        subject: '',
        description: '',
        due_date: '',
        priority: 'medium',
        estimated_time: 60,
        type: 'assignment',
        completed: false
      });
      setShowAddTask(false);

      toast({
        title: "Task Added! 📚",
        description: `"${task.title}" has been added to your study plan.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePomodoroComplete = async (duration: number, type: 'study' | 'break') => {
    if (type === 'study') {
      await addStudySession({
        date: new Date().toISOString().split('T')[0],
        duration,
        subject: 'Pomodoro Study',
        focus_rating: 5,
        session_type: 'pomodoro'
      });
      
      toast({
        title: "Study Session Recorded! 📊",
        description: `${duration} minutes of focused study logged.`,
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'exam': return Star;
      case 'project': return Target;
      case 'reading': return BookOpen;
      default: return Brain;
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const todaysStudyTime = sessions
    .filter(session => session.date === new Date().toISOString().split('T')[0])
    .reduce((total, session) => total + session.duration, 0);

  const averageFocus = sessions.length > 0 
    ? sessions.reduce((sum, session) => sum + session.focus_rating, 0) / sessions.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 pt-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Study Planner
          </h1>
          <p className="text-muted-foreground">
            Balance your academics with your mental wellbeing
          </p>
        </div>

        {/* Study Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{Math.round(completionRate)}%</p>
                </div>
              </div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Study</p>
                  <p className="text-2xl font-bold">{todaysStudyTime}min</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-secondary/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Brain className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Focus Score</p>
                  <p className="text-2xl font-bold">{averageFocus.toFixed(1)}/5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Timer
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="pet" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Pet Buddy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => setShowAddTask(true)}
                className="bg-gradient-to-r from-primary to-primary-light hover:shadow-lg transition-all duration-300"
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
              <Button 
                variant="outline" 
                className="border-accent/30 hover:bg-accent/10"
                onClick={() => setActiveTab('timer')}
              >
                <Timer className="w-4 h-4 mr-2" />
                Start Study Timer
              </Button>
              <Button 
                variant="outline" 
                className="border-secondary/30 hover:bg-secondary/10"
                onClick={() => setActiveTab('progress')}
              >
                <Award className="w-4 h-4 mr-2" />
                View Progress
              </Button>
            </div>

            {/* Add New Task Form */}
            {showAddTask && (
          <Card className="bg-card/80 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Study Task
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <Input
                  placeholder="Subject"
                  value={newTask.subject}
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                />
              </div>
              
              <Textarea
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value as any })}
                >
                  <option value="assignment">Assignment</option>
                  <option value="reading">Reading</option>
                  <option value="exam">Exam</option>
                  <option value="project">Project</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleAddTask} 
                  className="bg-gradient-to-r from-primary to-primary-light"
                  disabled={loading}
                >
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setShowAddTask(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
            )}

            {/* Tasks List */}
            <Card className="bg-card/50 backdrop-blur border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Your Study Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No study tasks yet. Add your first task to get started!</p>
              </div>
            ) : (
              tasks.map((task) => {
                const TaskIcon = getTaskIcon(task.type);
                const isOverdue = new Date(task.due_date) < new Date() && !task.completed;
                
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      task.completed 
                        ? 'bg-success/10 border-success/20' 
                        : isOverdue
                        ? 'bg-destructive/10 border-destructive/20'
                        : 'bg-card border-border hover:shadow-elegant'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 transition-colors duration-200"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                        )}
                      </button>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">{task.subject}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {isOverdue && !task.completed && (
                              <AlertCircle className="w-4 h-4 text-destructive" />
                            )}
                            <TaskIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.estimated_time}min
                          </span>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timer">
            <PomodoroTimer onSessionComplete={handlePomodoroComplete} />
          </TabsContent>

          <TabsContent value="progress">
            <StudyStreaks />
          </TabsContent>

          <TabsContent value="pet">
            <VirtualPet />
          </TabsContent>
        </Tabs>

        {/* Wellness Reminder */}
        <Card className="bg-gradient-to-r from-accent/10 to-secondary/10 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-full">
                <Brain className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Remember Your Wellbeing</h3>
                <p className="text-sm text-muted-foreground">
                  Take breaks, practice mindfulness, and don't forget to check in with your mood!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};