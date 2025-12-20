import React from "react";
import { Link } from "@inertiajs/react";
import {
  Bookmark,
  Heart,
  House,
  User,
  Users,
  X,
  LogIn,
  UserPlus,
  Info,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  isMoreOpen: boolean;
  sidebarLeft: number;
  isLoggedIn: boolean;
  onClose: () => void;
  onToggleMore: () => void;
  onProfileClick: () => void;
  onFollowingClick: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isMoreOpen,
  sidebarLeft,
  isLoggedIn,
  onClose,
  onToggleMore,
  onProfileClick,
  onFollowingClick,
}) => {
  return (
    <aside
      style={{ left: sidebarLeft }}
      className={`fixed top-0 z-40 h-full w-64 bg-white transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="p-4 flex items-center justify-between">
        <span className="font-semibold text-lg">OceanPrompt</span>
        <button
          className="text-sm text-gray-800 hover:text-gray-900 md:hidden"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-4">
        <div className="h-px w-full bg-gray-200" />
      </div>

      <nav className="p-4 space-y-4">
        <button
          className="block w-full text-left text-gray-800 hover:text-gray-900 cursor-pointer"
          onClick={onClose}
        >
          <Link href="/" className="contents">
            <div className="flex gap-2 items-center">
              <House size={20} />
              <span>Home</span>
            </div>
          </Link>
        </button>

        <button
          className="block w-full text-left text-gray-800 hover:text-gray-900 cursor-pointer"
          onClick={onClose}
        >
          <Link href="/feed/liked" className="contents">
            <div className="flex gap-2 items-center">
              <Heart size={20} />
              <span>Liked</span>
            </div>
          </Link>
        </button>

        <button
          className="block w-full text-left text-gray-800 hover:text-gray-900 cursor-pointer"
          onClick={onClose}
        >
          <Link href="/feed/saved" className="contents">
            <div className="flex gap-2 items-center">
              <Bookmark size={20} />
              <span>Saved</span>
            </div>
          </Link>
        </button>

        <div className="my-4 h-px w-full bg-gray-200" />

        <button
          className="block w-full text-left text-gray-800 hover:text-gray-900 cursor-pointer"
          onClick={onProfileClick}
        >
          <div className="flex gap-2 items-center">
            {isLoggedIn ? <User size={20} /> : <LogIn size={20} />}
            <span>{isLoggedIn ? "Profile" : "Sign in"}</span>
          </div>
        </button>

        <button
          className="block w-full text-left text-gray-800 hover:text-gray-900 cursor-pointer"
          onClick={onFollowingClick}
        >
          <div className="flex gap-2 items-center">
            {isLoggedIn ? <Users size={20} /> : <UserPlus size={20} />}
            <span>{isLoggedIn ? "Following" : "Sign up"}</span>
          </div>
        </button>

        <div className="my-4 h-px w-full bg-gray-200" />

        <button
          type="button"
          className="block w-full text-left text-gray-800 hover:text-gray-900 cursor-pointer"
          onClick={onToggleMore}
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <Info size={20} />
              <span>More</span>
            </div>
            {isMoreOpen ? (
              <ChevronDown size={18} className="text-gray-500" />
            ) : (
              <ChevronRight size={18} className="text-gray-500" />
            )}
          </div>
        </button>

        {isMoreOpen && (
          <div className="pl-6 pt-2 space-y-2 text-sm">
            <button
              className="block w-full text-left text-gray-700 hover:text-gray-900 cursor-pointer"
              onClick={onClose}
            >
              <Link href="/about" className="contents">
                <span>About</span>
              </Link>
            </button>

            <button
              className="block w-full text-left text-gray-700 hover:text-gray-900 cursor-pointer"
              onClick={onClose}
            >
              <Link href="/contact" className="contents">
                <span>Contact</span>
              </Link>
            </button>

            <button
              className="block w-full text-left text-gray-700 hover:text-gray-900 cursor-pointer"
              onClick={onClose}
            >
              <Link href="/privacy-policy" className="contents">
                <span>Privacy Policy</span>
              </Link>
            </button>

            <button
              className="block w-full text-left text-gray-700 hover:text-gray-900 cursor-pointer"
              onClick={onClose}
            >
              <Link href="/terms" className="contents">
                <span>Terms &amp; Conditions</span>
              </Link>
            </button>

            <button
              className="block w-full text-left text-gray-700 hover:text-gray-900 cursor-pointer"
              onClick={onClose}
            >
              <Link href="/faq" className="contents">
                <span>FAQ</span>
              </Link>
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
