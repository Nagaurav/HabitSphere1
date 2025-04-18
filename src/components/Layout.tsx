
import React from "react";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className={cn(
        "flex-1 container py-6",
        isMobile && "pb-20", // Add padding for bottom nav
        className
      )}>
        {children}
      </main>
      <BottomNav />
      <footer className="py-6 border-t border-border/40 bg-muted/10">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Habit Sphere - Build better habits, one day at a time
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
