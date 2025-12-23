import React, { useState, ReactNode } from "react";
import { usePage, router } from "@inertiajs/react";
import { type SharedData } from "@/types";
import Header from "@/Components/navigation/Header";
import Sidebar from "@/Components/navigation/Sidebar";

// If you are using Ziggy, you might need to import it depending on your setup
// import { route } from 'ziggy-js'; 

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const { auth } = usePage<SharedData>().props;
  const isLoggedIn = !!auth?.user;

  const handleProfileClick = () => {
    // Only close drawer if we are on "mobile" (less than 480px)
    if (window.innerWidth < 480) setIsDrawerOpen(false);
    
    if (!isLoggedIn) return router.visit("/login");
    router.visit(`/u/${auth.user.username}`);
  };

  const handleLogout = () => {
  if (confirm("Are you sure you want to log out?")) {
    router.post('/logout', {}, {
      // This ensures Inertia handles the redirect properly
      onSuccess: () => {
        // Optional: any local state cleanup
      },
      onError: (errors) => {
        console.error("Logout failed:", errors);
      }
    });
  }
};

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Pass the open trigger to Header */}
      <Header onOpenDrawer={() => setIsDrawerOpen(true)} />

      <div className="flex justify-center w-full">
        {/* max-w-5xl allows room for sidebar + main content */}
        <div className="flex w-full max-w-5xl relative">
          
          {/* 2. Responsive Sidebar */}
          <Sidebar
            isOpen={isDrawerOpen}
            isMoreOpen={isMoreOpen}
            isLoggedIn={isLoggedIn}
            onClose={() => setIsDrawerOpen(false)}
            onToggleMore={() => setIsMoreOpen((v) => !v)}
            onProfileClick={handleProfileClick}
            onLogout={handleLogout}
          />

          {/* 3. Main content */}
          <main className="flex-1 pb-10 flex justify-center min-w-0">
            <div className="w-full sm:max-w-2xl">
              {children}
            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
};

export default AppLayout;