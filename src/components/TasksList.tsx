import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lock, Unlock, Clock, DollarSign, Users, CheckCircle2, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  payRate: string;
  estimatedTime: string;
  availableSlots: number;
  requirements: string[];
  locked: boolean;
  completed: boolean;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Image Annotation for Autonomous Vehicles",
    description: "Label objects in street scene images to train AI for self-driving cars.",
    category: "Computer Vision",
    difficulty: "Beginner",
    payRate: "$15-25/hour",
    estimatedTime: "2-4 hours",
    availableSlots: 150,
    requirements: ["Basic computer skills", "Attention to detail"],
    locked: false,
    completed: false,
  },
  {
    id: "2",
    title: "Medical Text Classification",
    description: "Categorize medical documents and research papers.",
    category: "Natural Language Processing",
    difficulty: "Intermediate",
    payRate: "$20-35/hour",
    estimatedTime: "3-6 hours",
    availableSlots: 75,
    requirements: ["Medical background preferred", "English proficiency"],
    locked: false,
    completed: false,
  },
  {
    id: "3",
    title: "Voice Data Transcription",
    description: "Transcribe audio recordings in multiple languages.",
    category: "Audio Processing",
    difficulty: "Beginner",
    payRate: "$12-20/hour",
    estimatedTime: "1-3 hours",
    availableSlots: 200,
    requirements: ["Native speaker", "Good hearing"],
    locked: false,
    completed: false,
  },
  {
    id: "4",
    title: "3D Object Modeling",
    description: "Create and annotate 3D models for AR applications.",
    category: "3D Modeling",
    difficulty: "Advanced",
    payRate: "$30-50/hour",
    estimatedTime: "4-8 hours",
    availableSlots: 25,
    requirements: ["3D modeling experience", "Blender/Maya skills"],
    locked: false,
    completed: false,
  },
];

const difficultyColors = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
};


export const TasksList = () => {
  const { user, logout, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [unlocking, setUnlocking] = useState<string | null>(null);

  const handleUnlockTask = async (taskId: string) => {
    setUnlocking(taskId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, locked: false } : task
    ));
    
    setUnlocking(null);
  };
  const handleStartTask = (taskId: string) => {
  if (user?.approvalStatus === "pending") {
    toast.warning("Your account is under verification. Please wait for approval before starting tasks.");
    return;
  }

  // Continue with normal start logic
  console.log("Starting task:", taskId);
};


  const getTaskStatus = (task: Task) => {
    if (task.completed) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }
    
    if (task.locked) {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          <Lock className="h-3 w-3 mr-1" />
          Locked
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        <Unlock className="h-3 w-3 mr-1" />
        Available
      </Badge>
    );
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const availableTasks = tasks.filter(task => !task.locked && !task.completed).length;
  const lockedTasks = tasks.filter(task => task.locked).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Available Tasks</h1>
        <p className="text-muted-foreground">Complete tasks to earn money and unlock more opportunities</p>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">{completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Unlock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-xl font-bold">{availableTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Lock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Locked</p>
                <p className="text-xl font-bold">{lockedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-xl font-bold">$0.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
          <CardDescription>
            Browse and manage your available AI tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Pay Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{task.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={difficultyColors[task.difficulty]}>
                      {task.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{task.payRate}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTaskStatus(task)}</TableCell>
                  <TableCell>
                    {task.completed ? (
                      <Button variant="outline" disabled>
                        Completed
                      </Button>
                    ) : task.locked ? (
                      <Button
                        variant="outline"
                        onClick={() => handleUnlockTask(task.id)}
                        disabled={unlocking === task.id}
                      >
                        {unlocking === task.id ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Unlocking...
                          </>
                        ) : (
                          <>
                            <Unlock className="h-4 w-4 mr-2" />
                            Unlock
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button onClick={() => handleStartTask(task.id)}>
                        Start Task
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Tips for Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              Complete beginner tasks first to build your reputation
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              Higher difficulty tasks unlock after completing easier ones
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              Maintain high quality work to unlock premium tasks
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              Check back regularly for new task opportunities
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
