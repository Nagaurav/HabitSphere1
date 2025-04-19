
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DigitalHabits from "./pages/DigitalHabits";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Social from "./pages/Social";
import Challenges from "./pages/Challenges";
import Partnerships from "./pages/Partnerships";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";

const queryClient = new QueryClient();

export default function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/digital-habits" element={<DigitalHabits />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/social" element={<Social />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/partnerships" element={<Partnerships />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}
