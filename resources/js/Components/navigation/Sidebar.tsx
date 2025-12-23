import React from "react";
import { Link } from "@inertiajs/react";
import {
  Bookmark,
  Heart,
  House,
  User,
  X,
  LogIn,
  LogOut,
  Info,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  isMoreOpen: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onToggleMore: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isMoreOpen,
  isLoggedIn,
  onClose,
  onToggleMore,
  onProfileClick,
  onLogout,
}) => {
  const handleNavClick = () => {
    if (window.innerWidth < 480) onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 min-[480px]:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <aside
        className={`
          fixed min-[480px]:sticky top-0 min-[480px]:top-20 h-full min-[480px]:h-[calc(100vh-80px)] w-64 bg-white 
          z-50 min-[480px]:z-0 transform transition-transform duration-300 ease-in-out
          border-r min-[480px]:border-none border-gray-100
          ${isOpen ? "translate-x-0" : "-translate-x-full min-[480px]:translate-x-0"}
        `}
      >
        <div className="p-4 flex items-center justify-between">
          <span className="font-semibold text-lg min-[480px]:hidden">OceanPrompt</span>
          <button
            className="p-1 text-gray-600 hover:bg-gray-100 rounded-md min-[480px]:hidden"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="p-4 space-y-4">
          <Link href="/" onClick={handleNavClick} className="flex gap-2 items-center hover:text-purple-700">
            <House size={20} /> Home
          </Link>
          <Link href="/feed/liked" onClick={handleNavClick} className="flex gap-2 items-center hover:text-purple-700">
            <Heart size={20} /> Liked
          </Link>
          <Link href="/feed/saved" onClick={handleNavClick} className="flex gap-2 items-center hover:text-purple-700">
            <Bookmark size={20} /> Saved
          </Link>

          <div className="my-4 h-px w-full bg-gray-200" />

          <button onClick={onProfileClick} className="flex gap-2 items-center w-full text-left hover:text-purple-700">
            {isLoggedIn ? <User size={20} /> : <LogIn size={20} />}
            {isLoggedIn ? "Profile" : "Sign in"}
          </button>

          <div className="my-4 h-px w-full bg-gray-200" />

          {/* More Section */}
          <button onClick={onToggleMore} className="flex justify-between items-center w-full hover:text-purple-700">
            <div className="flex gap-2 items-center">
              <Info size={20} /> More
            </div>
            {isMoreOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>

          {isMoreOpen && (
            <div className="pl-6 pt-2 space-y-3 text-sm text-gray-500">
              <Link href="/about" onClick={handleNavClick} className="block hover:text-purple-700">About</Link>
              <Link href="/privacy-policy" onClick={handleNavClick} className="block hover:text-purple-700">Privacy</Link>
              
              {/* Logout inside More, only if logged in */}
              {isLoggedIn && (
                <>
                  <div className="h-px w-full bg-gray-100 my-1" />
                  <button 
                    onClick={onLogout} 
                    className="flex gap-2 items-center w-full text-left text-red-500 hover:text-red-700 pt-1"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              )}
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;