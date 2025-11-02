import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Bell, 
  Settings, 
  Clock, 
  Calendar, 
  Shield, 
  User, 
  Activity, 
  FileText,
  Stethoscope,
  Pill,
  Phone,
  MapPin,
  TrendingUp
} from "lucide-react";
import { getCurrentUser, getUserDetails, getUserRole } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

export default function PatientDashboard() {
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
        if (role.role !== "patient") {
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
  const greeting = currentTime.getHours() < 12 ? "Good Morning" : 
                  currentTime.getHours() < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-lg">
                <img src={logo} className="h-8 w-8" alt="CodeVeda Logo" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">CodeVeda</h1>
                <p className="text-blue-100">Advanced Healthcare Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
                <Bell className="h-4 w-4 mr-2" />
                <Badge variant="destructive" className="ml-1">2</Badge>
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
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
                    {userDetails?.name?.split(' ').map((n: string) => n[0]).join('') || 'PT'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{userDetails?.name || 'Patient'}</p>
                  <p className="text-xs text-blue-100">Age: {userDetails?.age || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center text-sm text-blue-100 mb-2">
              <Clock className="h-4 w-4 mr-2" />
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <h2 className="text-3xl font-bold">{greeting}, {userDetails?.name?.split(' ')[0] || 'Patient'}</h2>
            <p className="text-blue-100 mt-2">
              You have <span className="font-semibold">2 upcoming appointments</span> this week. 
              Your health status is <span className="font-semibold">stable</span>, 
              and you have <span className="font-semibold">no active alerts</span> at this time.
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
                  <p className="text-sm font-medium text-gray-600">Health Score</p>
                  <p className="text-3xl font-bold text-gray-900">92%</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <Heart className="h-4 w-4 mr-1" />
                    Excellent condition
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
                  <p className="text-sm font-medium text-gray-600">Next Appointment</p>
                  <p className="text-3xl font-bold text-gray-900">2</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Days remaining
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Safety Status</p>
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Overview</h3>
          <p className="text-gray-600 mb-6">Access your health information and medical services</p>
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
                  <h4 className="font-semibold text-gray-900">Profile</h4>
                  <p className="text-sm text-gray-600">Personal information</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">
                      {userDetails?.name || 'Update required'}
                    </span>
                    <Button variant="ghost" size="sm">→</Button>
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
                  <h4 className="font-semibold text-gray-900">Health Tracking</h4>
                  <p className="text-sm text-gray-600">Monitor vital signs</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-green-600">All Normal</span>
                    <Button variant="ghost" size="sm">→</Button>
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
                  <h4 className="font-semibold text-gray-900">Medical Records</h4>
                  <p className="text-sm text-gray-600">View health history</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-purple-600">5 Records</span>
                    <Button variant="ghost" size="sm">→</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Stethoscope className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Appointments</h4>
                  <p className="text-sm text-gray-600">Schedule & manage</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">Next: Tomorrow</span>
                    <Button variant="ghost" size="sm">→</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Pill className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Medications</h4>
                  <p className="text-sm text-gray-600">Prescriptions & reminders</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">2 active</span>
                    <Button variant="ghost" size="sm">→</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-teal-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Contact Doctor</h4>
                  <p className="text-sm text-gray-600">Secure messaging</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">Dr. Smith</span>
                    <Button variant="ghost" size="sm">→</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Patient Information
              </CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Full Name</p>
                  <p className="text-gray-900">{userDetails?.name || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Contact</p>
                  <p className="text-gray-900">{userDetails?.contactNo || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Age</p>
                  <p className="text-gray-900">{userDetails?.age || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Gender</p>
                  <p className="text-gray-900">{userDetails?.gender || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                  <p className="text-gray-900">{userDetails?.dateOfBirth || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">Occupation</p>
                  <p className="text-gray-900">{userDetails?.occupation || "Not provided"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Health Analytics
              </CardTitle>
              <CardDescription>Your health trends and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Blood Pressure</span>
                  <span className="text-gray-900">120/80 mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Heart Rate</span>
                  <span className="text-gray-900">72 bpm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Weight</span>
                  <span className="text-gray-900">70 kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Height</span>
                  <span className="text-gray-900">175 cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">BMI</span>
                  <span className="text-gray-900">22.9 (Normal)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>© 2025 CodeVeda. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-700">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700">HIPAA Compliance</a>
              <a href="#" className="hover:text-gray-700">Terms of Service</a>
              <a href="#" className="hover:text-gray-700">Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}