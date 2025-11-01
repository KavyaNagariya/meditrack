import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, getUserDetails, getUserRole } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import {
  Users,
  Calendar,
  Shield,
  Activity,
  FileText,
  AlertTriangle,
  Clock,
  User,
  Settings,
  Bell,
  Phone,
  Heart,
  MessageCircle,
} from "lucide-react";

export default function FamilyDashboard() {
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
        if (role.role !== "family") {
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

  const currentTime = new Date();
  const greeting =
    currentTime.getHours() < 12
      ? "Good Morning"
      : currentTime.getHours() < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">MediCare Pro</h1>
                <p className="text-blue-100">Advanced Healthcare Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-blue-700"
              >
                <Bell className="h-4 w-4 mr-2" />
                <Badge variant="destructive" className="ml-1">
                  1
                </Badge>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-blue-700"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-blue-700"
                onClick={async () => {
                  try {
                    const response = await fetch("/api/auth/logout", {
                      method: "POST",
                      credentials: "include"
                    });
                    if (response.ok) {
                      navigate("/login");
                    }
                  } catch (error) {
                    console.error("Logout error:", error);
                  }
                }}
              >
                Logout
              </Button>
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500 rounded-full p-2">
                  <span className="text-sm font-medium">
                    {userDetails?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "FM"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {userDetails?.name || "Family Member"}
                  </p>
                  <p className="text-xs text-blue-100">
                    {userDetails?.relationWithPatient || "Guardian"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center text-sm text-blue-100 mb-2">
              <Clock className="h-4 w-4 mr-2" />
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              •{" "}
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <h2 className="text-3xl font-bold">
              {greeting}, {userDetails?.name?.split(" ")[0] || "Family Member"}
            </h2>
            <p className="text-blue-100 mt-2">
              {userDetails?.patientName || "Your patient"} has{" "}
              <span className="font-semibold">1 upcoming appointment</span> this
              week. Their health status is{" "}
              <span className="font-semibold">stable</span>, and there are{" "}
              <span className="font-semibold">no active alerts</span> at this
              time.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Patient Status
                  </p>
                  <p className="text-3xl font-bold text-gray-900">Stable</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <Heart className="h-4 w-4 mr-1" />
                    Good condition
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Next Visit
                  </p>
                  <p className="text-3xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-600 mt-1">Days remaining</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Safety Status
                  </p>
                  <p className="text-3xl font-bold text-gray-900">Safe</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <Shield className="h-4 w-4 mr-1" />
                    No exposure alerts
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Overview */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Dashboard Overview
          </h3>
          <p className="text-gray-600 mb-6">
            Monitor and manage your patient's healthcare journey
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Patient Info</h4>
                  <p className="text-sm text-gray-600">View patient details</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      {userDetails?.patientName || "Not provided"}
                    </span>
                    <Button variant="ghost" size="sm">
                      →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    Health Tracking
                  </h4>
                  <p className="text-sm text-gray-600">
                    Monitor patient vitals
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-green-600">
                      All Normal
                    </span>
                    <Button variant="ghost" size="sm">
                      →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    Medical Records
                  </h4>
                  <p className="text-sm text-gray-600">Access health history</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-purple-600">
                      3 Records
                    </span>
                    <Button variant="ghost" size="sm">
                      →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Appointments</h4>
                  <p className="text-sm text-gray-600">
                    Schedule & track visits
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-orange-600">
                      1 Upcoming
                    </span>
                    <Button variant="ghost" size="sm">
                      →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Alerts</h4>
                  <p className="text-sm text-gray-600">Health notifications</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-green-600">
                      No Alerts
                    </span>
                    <Button variant="ghost" size="sm">
                      →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-teal-100 p-3 rounded-full">
                  <MessageCircle className="h-6 w-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Communication</h4>
                  <p className="text-sm text-gray-600">Contact care team</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-teal-600">
                      Available
                    </span>
                    <Button variant="ghost" size="sm">
                      →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Family & Patient Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Family Member Information
              </CardTitle>
              <CardDescription>Your registered details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Name:
                  </span>
                  <span className="text-gray-900">
                    {userDetails?.name || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Contact:
                  </span>
                  <span className="text-gray-900">
                    {userDetails?.contactNo || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Relation:
                  </span>
                  <span className="text-gray-900">
                    {userDetails?.relationWithPatient || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Gender:
                  </span>
                  <span className="text-gray-900">
                    {userDetails?.gender || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Age:
                  </span>
                  <span className="text-gray-900">
                    {userDetails?.age || "Not provided"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Patient Information
              </CardTitle>
              <CardDescription>Details about your patient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Patient Name:
                  </span>
                  <span className="text-gray-900">
                    {userDetails?.patientName || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Relationship:
                  </span>
                  <span className="text-gray-900">
                    {userDetails?.relationWithPatient || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Status:
                  </span>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    Stable
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Last Visit:
                  </span>
                  <span className="text-gray-900">2 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Next Appointment:
                  </span>
                  <span className="text-gray-900">In 3 days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>© 2025 MediCare Pro. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-700">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-700">
                HIPAA Compliance
              </a>
              <a href="#" className="hover:text-gray-700">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-700">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
