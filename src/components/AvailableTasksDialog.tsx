import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Users, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import OnboardingDialog from "./OnboardingDialog";

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
}

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Image Annotation for Autonomous Vehicles",
    description: "Label objects in street scene images to train AI for self-driving cars. Help make transportation safer.",
    category: "Computer Vision",
    difficulty: "Beginner",
    payRate: "$15-25/hour",
    estimatedTime: "2-4 hours",
    availableSlots: 150,
    requirements: ["Basic computer skills", "Attention to detail", "Reliable internet"]
  },
  {
    id: "2",
    title: "Medical Text Classification",
    description: "Categorize medical documents and research papers to improve healthcare AI systems.",
    category: "Natural Language Processing",
    difficulty: "Intermediate",
    payRate: "$20-35/hour",
    estimatedTime: "3-6 hours",
    availableSlots: 75,
    requirements: ["Medical background preferred", "English proficiency", "Research experience"]
  },
  {
    id: "3",
    title: "Voice Data Transcription & Validation",
    description: "Transcribe audio recordings in multiple languages to improve speech recognition AI.",
    category: "Audio Processing",
    difficulty: "Beginner",
    payRate: "$12-20/hour",
    estimatedTime: "1-3 hours",
    availableSlots: 200,
    requirements: ["Native speaker", "Good hearing", "Typing speed 40+ WPM"]
  },
  {
    id: "4",
    title: "3D Object Modeling & Annotation",
    description: "Create and annotate 3D models for augmented reality applications and gaming AI.",
    category: "3D Modeling",
    difficulty: "Advanced",
    payRate: "$30-50/hour",
    estimatedTime: "4-8 hours",
    availableSlots: 25,
    requirements: ["3D modeling experience", "Blender/Maya skills", "Portfolio required"]
  },
  {
    id: "5",
    title: "Social Media Content Moderation",
    description: "Review and categorize social media content to train AI moderation systems.",
    category: "Content Moderation",
    difficulty: "Beginner",
    payRate: "$18-28/hour",
    estimatedTime: "2-5 hours",
    availableSlots: 300,
    requirements: ["Cultural awareness", "English proficiency", "Mature content handling"]
  },
  {
    id: "6",
    title: "Financial Document Analysis",
    description: "Extract and structure data from financial reports to train AI for automated analysis.",
    category: "Data Extraction",
    difficulty: "Intermediate",
    payRate: "$25-40/hour",
    estimatedTime: "3-5 hours",
    availableSlots: 50,
    requirements: ["Finance background", "Excel proficiency", "Analytical skills"]
  }
];

const difficultyColors = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800"
};

export const AvailableTasksDialog = () => {
  const [open, setOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const handleStartOnboarding = () => {
    setOpen(false);
    setOnboardingOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="lg" 
          className="text-base bg-white text-black hover:bg-white/90 shadow-lg"
        >
          Start Earning Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Available AI Tasks</DialogTitle>
          <DialogDescription className="text-lg">
            Browse current opportunities and start earning with meaningful AI projects
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sampleTasks.length}</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">800+</div>
              <div className="text-sm text-muted-foreground">Open Positions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$12-50</div>
              <div className="text-sm text-muted-foreground">Hourly Rate</div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {sampleTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <Badge className={difficultyColors[task.difficulty]}>
                        {task.difficulty}
                      </Badge>
                    </div>
                    <Badge variant="outline">{task.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm">
                    {task.description}
                  </CardDescription>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{task.payRate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>{task.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>{task.availableSlots} slots</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-600" />
                      <span>Flexible</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Requirements:</p>
                    <ul className="text-xs space-y-1">
                      {task.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Start Earning?</h3>
            <p className="text-blue-100 mb-4">
              Join thousands of contributors earning competitive pay on meaningful AI projects.
              Complete your profile to get matched with the right tasks.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleStartOnboarding}
                className="bg-white text-blue-600 hover:bg-white/90"
                size="lg"
              >
                Complete Profile & Start Earning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Browse More Tasks
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      
      {/* Onboarding Dialog */}
      <OnboardingDialog 
        open={onboardingOpen} 
        onOpenChange={setOnboardingOpen} 
      />
    </Dialog>
  );
};
