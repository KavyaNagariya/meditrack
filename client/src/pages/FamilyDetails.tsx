import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getCurrentUser, getUserDetails, setUserDetails } from "@/lib/auth";

export default function FamilyDetails() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    relationWithPatient: "",
    patientName: "",
    gender: "",
    age: "",
  });
  const [, navigate] = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          // If not authenticated, redirect to login
          navigate("/login");
        } else {
          // Load existing details if available
          try {
            const details = await getUserDetails();
            setFormData({
              name: details.name || "",
              contactNo: details.contactNo || "",
              relationWithPatient: details.relationWithPatient || "",
              patientName: details.patientName || "",
              gender: details.gender || "",
              age: details.age ? details.age.toString() : "",
            });
          } catch (error) {
            console.log("No existing details found");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Save details to user profile
      await setUserDetails({
        name: formData.name,
        contactNo: formData.contactNo,
        relationWithPatient: formData.relationWithPatient,
        patientName: formData.patientName,
        gender: formData.gender,
        age: formData.age ? parseInt(formData.age) : undefined,
      });

      toast({
        title: "Success",
        description: "Family details saved successfully",
      });

      // Redirect to family dashboard
      navigate("/dashboard/family");
    } catch (error) {
      console.error("Family details error:", error);
      toast({
        title: "Error",
        description: "Failed to save family details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Family Member Details</CardTitle>
          <CardDescription className="text-center">
            Please provide your details to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNo">Contact Number</Label>
                <Input
                  id="contactNo"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationWithPatient">Relation with Patient</Label>
                <Input
                  id="relationWithPatient"
                  name="relationWithPatient"
                  value={formData.relationWithPatient}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient's Name</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Details"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}