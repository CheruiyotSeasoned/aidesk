
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  ListTodo,
  DollarSign,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Clock,
  TrendingUp,
  Award,
  Target,
  Calendar,
  BarChart3,
  FileText,
  Bell,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Users,
  Menu,
  X,
  Bot,
  Loader2
} from "lucide-react";
import { TasksList } from "@/components/TasksList";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { Chatbot } from "@/components/Chatbot";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "tasks", label: "Tasks", icon: <ListTodo className="h-4 w-4" />, badge: "New" },
  { id: "earnings", label: "Earnings", icon: <DollarSign className="h-4 w-4" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "achievements", label: "Achievements", icon: <Award className="h-4 w-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
  { id: "help", label: "Help", icon: <HelpCircle className="h-4 w-4" /> },
];

// View Components
const EarningsView = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Earnings</h1>
      <p className="text-muted-foreground">Track your earnings and payment history</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          <DollarSign className="h-8 w-8 text-green-600" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">$0.00</p>
          </div>
          <Clock className="h-8 w-8 text-orange-600" />
        </div>
      </Card>
    </div>

    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>
      <div className="text-center py-8 text-muted-foreground">
        <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No payments yet. Complete tasks to start earning!</p>
      </div>
    </Card>
  </div>
);

const AnalyticsView = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="text-muted-foreground">View your performance metrics and insights</p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Task Completion Rate</h3>
        <div className="text-center py-8">
          <div className="text-4xl font-bold text-primary mb-2">0%</div>
          <p className="text-muted-foreground">No tasks completed yet</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Average Task Time</h3>
        <div className="text-center py-8">
          <div className="text-4xl font-bold text-primary mb-2">0m</div>
          <p className="text-muted-foreground">No data available</p>
        </div>
      </Card>
    </div>

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Earnings Over Time</h3>
      <div className="text-center py-8 text-muted-foreground">
        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Complete tasks to see your earnings analytics</p>
      </div>
    </Card>
  </div>
);

const AchievementsView = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Achievements</h1>
      <p className="text-muted-foreground">Unlock badges and track your progress</p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { title: "First Task", description: "Complete your first task", icon: Target, unlocked: false },
        { title: "Earning Streak", description: "Earn money for 7 consecutive days", icon: TrendingUp, unlocked: false },
        { title: "Task Master", description: "Complete 100 tasks", icon: Award, unlocked: false },
        { title: "Speed Demon", description: "Complete a task in under 30 minutes", icon: Clock, unlocked: false },
        { title: "Quality Expert", description: "Maintain 95%+ accuracy for 10 tasks", icon: CheckCircle2, unlocked: false },
        { title: "Team Player", description: "Help 5 other contributors", icon: Users, unlocked: false },
      ].map((achievement, index) => {
        const Icon = achievement.icon;
        return (
          <Card key={index} className={`p-6 ${achievement.unlocked ? 'border-green-200 bg-green-50' : 'opacity-60'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-green-100' : 'bg-muted'
                }`}>
                <Icon className={`h-6 w-6 ${achievement.unlocked ? 'text-green-600' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

const SettingsView = ({ user }: { user: any }) => {
  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getApprovalStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'under_review': return 'Under Review';
      case 'pending': return 'Pending Approval';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Approval Status Card */}
      <Card className="p-6 border-l-4 border-l-primary">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Account Status</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getApprovalStatusColor(user?.approvalStatus || 'pending')}`}>
            {getApprovalStatusText(user?.approvalStatus || 'pending')}
          </span>
        </div>
        {user?.approvalNotes && (
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-1">Admin Notes:</p>
            <p className="text-sm text-muted-foreground">{user.approvalNotes}</p>
          </div>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          {user?.approvalStatus === 'pending' && 'Your profile is being reviewed. You\'ll be notified once approved.'}
          {user?.approvalStatus === 'under_review' && 'Your profile is currently under review by our team.'}
          {user?.approvalStatus === 'approved' && 'Congratulations! Your account has been approved and you can start earning.'}
          {user?.approvalStatus === 'rejected' && 'Your profile needs some adjustments. Please review the notes above and update your information.'}
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <p className="text-sm text-muted-foreground">{user?.name || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">{user?.email || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <p className="text-sm text-muted-foreground">{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <p className="text-sm text-muted-foreground">{user?.location || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Bio</label>
              <p className="text-sm text-muted-foreground">{user?.bio || 'Not provided'}</p>
            </div>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Skills & Availability</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Skills</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {user?.skills?.length > 0 ? (
                  user.skills.map((skill: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills added</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Availability</label>
              <p className="text-sm text-muted-foreground">
                {user?.availability?.hours_per_week ? `${user.availability.hours_per_week} hours/week` : 'Not specified'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Timezone</label>
              <p className="text-sm text-muted-foreground">{user?.availability?.timezone || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Preferred Schedule</label>
              <p className="text-sm text-muted-foreground">{user?.availability?.preferred_schedule || 'Not specified'}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Payment Method</label>
            <p className="text-sm text-muted-foreground capitalize">
              {user?.payment_details?.method || 'Not specified'}
            </p>
          </div>
          {user?.payment_details?.method === 'paypal' && user?.payment_details?.paypal_email && (
            <div>
              <label className="text-sm font-medium">PayPal Email</label>
              <p className="text-sm text-muted-foreground">{user.payment_details.paypal_email}</p>
            </div>
          )}
          {user?.payment_details?.method === 'bank_transfer' && (
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium">Bank Account Name</label>
                <p className="text-sm text-muted-foreground">{user.payment_details.bank_account_name || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Account Number</label>
                <p className="text-sm text-muted-foreground">
                  {user.payment_details.bank_account_number ? '••••••••' + user.payment_details.bank_account_number.slice(-4) : 'Not provided'}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Task Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified about new tasks</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Earnings Updates</p>
              <p className="text-sm text-muted-foreground">Get notified about payments</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Download Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <HelpCircle className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
          <Button variant="destructive" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

const HelpView = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Help & Support</h1>
      <p className="text-muted-foreground">Get help and find answers to common questions</p>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            How to complete your first task
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Understanding task requirements
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Payment and withdrawal guide
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Support</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Email Support</p>
              <p className="text-sm text-muted-foreground">support@aideskspace.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Phone Support</p>
              <p className="text-sm text-muted-foreground">+1 9715160108</p>
            </div>
          </div>
          <Button className="w-full">
            <HelpCircle className="mr-2 h-4 w-4" />
            Start Live Chat
          </Button>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">AI Assistant Available</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Click the chat icon in the bottom-right corner to get instant help from our AI assistant.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bot className="h-4 w-4" />
              <span>Powered by ChatGPT integration</span>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h4 className="font-medium mb-2">How do I get paid?</h4>
          <p className="text-sm text-muted-foreground">Payments are processed weekly via PayPal or bank transfer. You can withdraw your earnings every Friday.</p>
        </div>
        <div className="border-b pb-4">
          <h4 className="font-medium mb-2">What if I make a mistake on a task?</h4>
          <p className="text-sm text-muted-foreground">Don't worry! You can always redo a task if you're not satisfied with your work. Quality is more important than speed.</p>
        </div>
        <div>
          <h4 className="font-medium mb-2">How do I improve my task accuracy?</h4>
          <p className="text-sm text-muted-foreground">Take your time, read instructions carefully, and use the provided guidelines. Higher accuracy leads to better task recommendations.</p>
        </div>
      </div>
    </Card>
  </div>
);

const DashboardOverview = ({ user, setActiveTab, setSidebarOpen }: any) => {
  const stats = [
    { label: "Total Earnings", value: "$0.00", icon: DollarSign, color: "text-green-600", change: "+0%" },
    { label: "Tasks Completed", value: "0", icon: TrendingUp, color: "text-blue-600", change: "+0" },
    { label: "Hours Worked", value: "0", icon: Clock, color: "text-purple-600", change: "+0h" },
    { label: "Current Streak", value: "0 days", icon: Target, color: "text-orange-600", change: "Start today!" },
  ];

  const recentActivities = [
    { type: "task_completed", message: "Completed 'Image Classification' task", time: "2 hours ago", icon: CheckCircle2 },
    { type: "earnings", message: "Earned $15.50 from data labeling", time: "1 day ago", icon: DollarSign },
    { type: "achievement", message: "Unlocked 'First Task' achievement", time: "2 days ago", icon: Award },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Here's your AIDESK SPACE overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("tasks");
                setSidebarOpen(false);
              }}
            >
              <ListTodo className="mr-2 h-4 w-4" />
              Browse Available Tasks
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("earnings");
                setSidebarOpen(false);
              }}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              View Earnings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setActiveTab("analytics");
                setSidebarOpen(false);
              }}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <Icon className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No activity yet. Complete your onboarding to get started!</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Welcome to AIDESK SPACE!</p>
              <p className="text-xs text-muted-foreground">Complete your profile to start earning</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">New tasks available</p>
              <p className="text-xs text-muted-foreground">5 new tasks matching your skills</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protected route - redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/?login=1');
    }
  }, [user, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "tasks":
        return <TasksList />;
      case "earnings":
        return <EarningsView />;
      case "analytics":
        return <AnalyticsView />;
      case "achievements":
        return <AchievementsView />;
      case "settings":
        return <SettingsView user={user} />;
      case "help":
        return <HelpView />;
      case "dashboard":
      default:
        return <DashboardOverview />;
    }
  };

  const DashboardOverview = () => {
    const stats = [
      { label: "Total Earnings", value: "$0.00", icon: DollarSign, color: "text-green-600", change: "+0%" },
      { label: "Tasks Completed", value: "0", icon: TrendingUp, color: "text-blue-600", change: "+0" },
      { label: "Hours Worked", value: "0", icon: Clock, color: "text-purple-600", change: "+0h" },
      { label: "Current Streak", value: "0 days", icon: Target, color: "text-orange-600", change: "Start today!" },
    ];

    const recentActivities = [
      { type: "task_completed", message: "Completed 'Image Classification' task", time: "2 hours ago", icon: CheckCircle2 },
      { type: "earnings", message: "Earned $15.50 from data labeling", time: "1 day ago", icon: DollarSign },
      { type: "achievement", message: "Unlocked 'First Task' achievement", time: "2 days ago", icon: Award },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Here's your AIDESK SPACE overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("tasks");
                  setSidebarOpen(false);
                }}
              >
                <ListTodo className="mr-2 h-4 w-4" />
                Browse Available Tasks
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("earnings");
                  setSidebarOpen(false);
                }}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                View Earnings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("analytics");
                  setSidebarOpen(false);
                }}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <Icon className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No activity yet. Complete your onboarding to get started!</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Welcome to AIDESK SPACE!</p>
                <p className="text-xs text-muted-foreground">Complete your profile to start earning</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">New tasks available</p>
                <p className="text-xs text-muted-foreground">5 new tasks matching your skills</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Aidesk Logo"
            className="h-10 w-auto object-contain"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`w-64 bg-card border-r min-h-screen transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static z-50 lg:z-auto`}>
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="Aidesk Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>

            <Separator className="my-6" />

            {/* Logout */}
            <Button
              variant="ghost"
              onClick={async () => {
                await logout();
                navigate('/?login=1');
                setSidebarOpen(false);
              }}
              className="w-full justify-start gap-3"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Onboarding Progress */}
          {!user?.onboardingCompleted && (
            <OnboardingProgress />
          )}

          {/* Page Content */}
          {renderContent()}
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Dashboard;
