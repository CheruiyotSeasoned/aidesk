import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, FileText, Building2, Users, CheckCircle2, ArrowRight } from "lucide-react";

interface CaseStudyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CaseStudyDialog = ({ open, onOpenChange }: CaseStudyDialogProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    industry: "",
    companySize: "",
    agreeToTerms: false,
    subscribeToUpdates: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call and download
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsDownloaded(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsDownloaded(false);
      onOpenChange(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        jobTitle: "",
        industry: "",
        companySize: "",
        agreeToTerms: false,
        subscribeToUpdates: false,
      });
    }, 3000);
  };

  const caseStudies = [
    {
      id: "fintech-ai",
      title: "FinTech AI Transformation",
      description: "How a leading financial services company reduced data processing time by 85% using our AI platform",
      downloadCount: "2.3K downloads",
      industry: "Financial Services",
      results: ["85% faster data processing", "60% cost reduction", "99.9% accuracy rate"]
    },
    {
      id: "healthcare-ml",
      title: "Healthcare ML Implementation",
      description: "A healthcare provider's journey to implementing machine learning for patient data analysis",
      downloadCount: "1.8K downloads",
      industry: "Healthcare",
      results: ["40% improvement in diagnosis accuracy", "50% reduction in processing time", "ROI of 300% in 6 months"]
    },
    {
      id: "retail-automation",
      title: "Retail Automation Success",
      description: "E-commerce giant automates inventory management and customer service with AI",
      downloadCount: "3.1K downloads",
      industry: "Retail & E-commerce",
      results: ["70% automation rate", "45% cost savings", "95% customer satisfaction"]
    }
  ];

  if (isDownloaded) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Case Study Downloaded!</h3>
            <p className="text-muted-foreground mb-4">
              Thank you for your interest. The case study has been sent to your email and is ready for download.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <p className="font-medium mb-2">What's included:</p>
              <ul className="text-left space-y-1 text-muted-foreground">
                <li>• Detailed implementation timeline</li>
                <li>• ROI calculations and metrics</li>
                <li>• Technical architecture overview</li>
                <li>• Lessons learned and best practices</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6 text-primary" />
            Download Case Studies
          </DialogTitle>
          <DialogDescription className="text-base">
            Access detailed case studies from real implementations. See how industry leaders achieved success with AIDESK SPACE.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Case Studies Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {caseStudies.map((study) => (
              <div key={study.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm">{study.title}</h4>
                  <span className="text-xs text-muted-foreground">{study.downloadCount}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{study.description}</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{study.industry}</span>
                  </div>
                  <div className="text-xs">
                    <p className="font-medium mb-1">Key Results:</p>
                    <ul className="space-y-0.5">
                      {study.results.map((result, index) => (
                        <li key={index} className="text-muted-foreground">• {result}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Download Form */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Get Instant Access</h3>
            <form onSubmit={handleDownload} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Your first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Your last name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@company.com"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Your company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    placeholder="Your job title"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail & E-commerce</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size *</Label>
                  <Select value={formData.companySize} onValueChange={(value) => handleInputChange("companySize", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    required
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a> *
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="subscribeToUpdates"
                    checked={formData.subscribeToUpdates}
                    onCheckedChange={(checked) => handleInputChange("subscribeToUpdates", checked as boolean)}
                  />
                  <Label htmlFor="subscribeToUpdates" className="text-sm">
                    Subscribe to receive more case studies and industry insights
                  </Label>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  What You'll Get
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All 3 detailed case studies (PDF format)</li>
                  <li>• Implementation timelines and roadmaps</li>
                  <li>• ROI calculations and success metrics</li>
                  <li>• Technical architecture diagrams</li>
                  <li>• Best practices and lessons learned</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Download className="mr-2 h-4 w-4 animate-pulse" />
                      Preparing Download...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download All Case Studies
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
