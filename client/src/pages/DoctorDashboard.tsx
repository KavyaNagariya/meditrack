import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser, getUserDetails, getUserRole } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

export default function DoctorDashboard() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is authenticated
        const user = await getCurrentUser();
        if (!user) {
          navigate("/login");
          return;
        }

        // Check user role
        const role = await getUserRole();
        if (role.role !== "doctor") {
          navigate("/role-selection");
          return;
        }

        // Fetch user details
        const details = await getUserDetails();
        setUserDetails(details);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to your MediTrack Pro dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Information</CardTitle>
              <CardDescription>Your professional details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{userDetails?.name || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Contact:</span>
                <span>{userDetails?.contactNo || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Employee ID:</span>
                <span>{userDetails?.employeeId || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Gender:</span>
                <span>{userDetails?.gender || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Age:</span>
                <span>{userDetails?.age || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Experience:</span>
                <span>{userDetails?.experience ? `${userDetails.experience} years` : "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Qualifications:</span>
                <span>{userDetails?.qualifications || "Not provided"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>Manage your patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">No patients assigned</p>
                <Button className="mt-4">View Patient List</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Contact Tracing Dashboard</CardTitle>
              <CardDescription>Monitor and manage exposure events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active exposure events</p>
                <Button className="mt-4">View All Events</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}