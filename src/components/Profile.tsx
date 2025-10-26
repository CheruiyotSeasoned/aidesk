import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, Phone, UserCheck, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Loading profile...
      </div>
    );
  }

  const onboarding = user.onboardingCompleted ? "Completed" : "In Progress";
  const approval =
    user.approvalStatus === "approved"
      ? { label: "Approved", color: "bg-green-100 text-green-700" }
      : user.approvalStatus === "pending"
      ? { label: "Pending", color: "bg-yellow-100 text-yellow-700" }
      : { label: "Rejected", color: "bg-red-100 text-red-700" };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">My Profile</h2>
        <Button>Edit Profile</Button>
      </div>

      {/* Profile Info Card */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatar || undefined} alt={user.name} />
            <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <Badge className={approval.color}>{approval.label}</Badge>
              <Badge
                className={
                  onboarding === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }
              >
                {onboarding}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{user.location || "No location provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{user.phone || "No phone"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>
                {user.availability?.hours_per_week || 0} hrs/week ·{" "}
                {user.availability?.timezone || "No timezone set"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-muted-foreground" />
              <span>Preferred Schedule: {user.availability?.preferred_schedule || "N/A"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {user.skills && user.skills.length > 0 ? (
            user.skills.map((skill: string, i: number) => (
              <Badge key={i} variant="secondary">
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No skills added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>Method:</strong> {user.payment_details?.method || "N/A"}
          </p>
          {user.payment_details?.method === "paypal" && (
            <p>
              <strong>PayPal:</strong> {user.payment_details?.paypal_email}
            </p>
          )}
          {user.payment_details?.method === "bank_transfer" && (
            <>
              <p>
                <strong>Bank Name:</strong> {user.payment_details?.bank_account_name}
              </p>
              <p>
                <strong>Account Number:</strong> {user.payment_details?.bank_account_number}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              type: "joined",
              message: `Joined as a new contributor.`,
              time: "3 days ago",
              icon: CheckCircle2,
            },
            {
              type: "profile_review",
              message: "Profile submitted for approval.",
              time: "2 days ago",
              icon: Clock,
            },
            {
              type: "verification",
              message: "Waiting for verification.",
              time: "1 day ago",
              icon: XCircle,
            },
          ].map((activity, i) => {
            const Icon = activity.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
              >
                <Icon className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
