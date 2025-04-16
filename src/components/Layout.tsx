
import React from "react";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className={cn("flex-1 container py-8", className)}>
        {children}
      </main>
      <footer className="py-6 border-t border-border/40">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Habit Sphere - Build better habits, one day at a time
        </div>
      </footer>
    </div>
  );
};

export default Layout;
