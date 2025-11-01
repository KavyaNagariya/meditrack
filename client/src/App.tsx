import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import RoleSelection from "./pages/RoleSelection";
import PatientDetails from "./pages/PatientDetails";
import DoctorDetails from "./pages/DoctorDetails";
import FamilyDetails from "./pages/FamilyDetails";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import FamilyDashboard from "./pages/FamilyDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/role-selection" component={RoleSelection} />
      <Route path="/details/patient" component={PatientDetails} />
      <Route path="/details/doctor" component={DoctorDetails} />
      <Route path="/details/family" component={FamilyDetails} />
      <Route path="/dashboard/patient" component={PatientDashboard} />
      <Route path="/dashboard/doctor" component={DoctorDashboard} />
      <Route path="/dashboard/family" component={FamilyDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;