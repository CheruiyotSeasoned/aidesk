import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image, Mic, Type, Video, Languages, MapPin, ArrowRight, DollarSign, Clock, Star, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const taskTypes = [
  {
    icon: Image,
    title: "Computer Vision",
    example: "Object detection, semantic segmentation, image classification for autonomous systems",
    useCase: "Self-driving cars, robotics, retail analytics",
    color: "primary",
    hourlyRate: "$12-25",
    difficulty: "Medium",
    avgTime: "2-4 hours",
    rating: 4.8,
  },
  {
    icon: Type,
    title: "NLP & Text Annotation",
    example: "Named entity recognition, sentiment analysis, intent classification for LLMs",
    useCase: "Chatbots, content moderation, search engines",
    color: "secondary",
    hourlyRate: "$8-18",
    difficulty: "Easy",
    avgTime: "1-3 hours",
    rating: 4.9,
  },
  {
    icon: Mic,
    title: "Speech & Audio",
    example: "Transcription, speaker identification, audio event detection across 100+ languages",
    useCase: "Voice assistants, call analytics, accessibility",
    color: "accent",
    hourlyRate: "$10-20",
    difficulty: "Medium",
    avgTime: "2-5 hours",
    rating: 4.7,
  },
  {
    icon: Video,
    title: "Video Intelligence",
    example: "Action recognition, scene understanding, temporal annotation for video AI",
    useCase: "Security, content delivery, sports analytics",
    color: "primary",
    hourlyRate: "$15-30",
    difficulty: "Hard",
    avgTime: "3-6 hours",
    rating: 4.6,
  },
  {
    icon: Languages,
    title: "Localization & Testing",
    example: "Multi-language QA, cultural adaptation, linguistic validation for global products",
    useCase: "E-commerce, gaming, SaaS platforms",
    color: "secondary",
    hourlyRate: "$6-15",
    difficulty: "Easy",
    avgTime: "1-2 hours",
    rating: 4.8,
  },
  {
    icon: MapPin,
    title: "Geospatial & IoT",
    example: "Satellite image analysis, sensor data labeling, map validation for location intelligence",
    useCase: "Agriculture, urban planning, logistics",
    color: "accent",
    hourlyRate: "$12-22",
    difficulty: "Medium",
    avgTime: "2-4 hours",
    rating: 4.7,
  },
];

export const TaskExamples = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      // This will be handled by the AvailableTasksDialog
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Solutions Across AI Domains</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive data services powering every stage of your AI development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {taskTypes.map((task, index) => {
            const Icon = task.icon;
            return (
              <Card key={index} className="p-6 border-border hover:shadow-card transition-all hover:-translate-y-1 group">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg bg-${task.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 text-${task.color}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{task.rating}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{task.example}</p>
                  </div>

                  {/* Task Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">{task.hourlyRate}/hr</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-muted-foreground">{task.avgTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <Badge className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                      {task.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Available Now</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Use Cases</p>
                    <p className="text-sm text-foreground">{task.useCase}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Earning?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Choose from hundreds of AI tasks across different domains. No experience required - we provide training and support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-base"
                onClick={handleGetStarted}
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                {user ? "Browse Tasks" : "Get Started Now"}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base"
              >
                <Star className="mr-2 h-5 w-5" />
                View All Categories
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>No Experience Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Flexible Schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Instant Payouts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
