import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { getCurrentUser, getProfileStatus, getRedirectPath } from "@/lib/auth";

const ROLES = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
  { value: "family", label: "Patient's Family" },
];

export default function RoleSelection() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    // Check if user is authenticated and handle smart redirect
    const checkAuthAndRedirect = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          navigate("/login");
          return;
        }
        
        // Check if user already has complete profile
        const profileStatus = await getProfileStatus();
        if (profileStatus && profileStatus.hasRole) {
          const redirectPath = getRedirectPath(profileStatus);
          if (redirectPath !== "/role-selection") {
            navigate(redirectPath, { replace: true });
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login");
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Save role to user profile
      const response = await fetch("/api/auth/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save role");
      }

      toast({
        title: "Success",
        description: "Role selected successfully",
      });

      // Redirect to role-specific details form
      navigate(`/details/${role}`);
    } catch (error: any) {
      console.error("Role selection error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Select Your Role</CardTitle>
          <CardDescription className="text-center">
            Please select your role to continue using CodeVeda
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Continue"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}