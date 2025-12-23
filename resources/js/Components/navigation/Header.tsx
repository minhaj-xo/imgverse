import React, { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { type SharedData } from "@/types";
import { Bell, Search, SquarePlus, TextAlignJustify } from "lucide-react";

interface HeaderProps {
  onOpenDrawer: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenDrawer }) => {
  const [headerSearch, setHeaderSearch] = useState("");

  return (
    <div className="w-full flex justify-center sticky top-0 bg-white z-30 border-b border-gray-100">
      <header className="p-4 bg-white flex items-center w-full sm:max-w-5xl">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2 items-center font-bold text-lg">
            {/* Hidden at 480px and above */}
            <TextAlignJustify
              size={20}
              className="cursor-pointer hover:text-purple-700 min-[480px]:hidden"
              onClick={onOpenDrawer}
            />
            <Link href="/" style={{ fontFamily: '"Delius", sans-serif' }}>
              OceanPrompt
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.get("/search", { q: headerSearch });
              }}
              className="relative hidden sm:block"
            >
              <input
                type="text"
                className="border border-gray-200 rounded-full text-sm pl-8 pr-3 py-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Search..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
              />
              <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>

            <Bell size={20} className="cursor-pointer text-gray-600" />

            <Link href="/prompts/create">
              <div className="flex items-center gap-1 bg-purple-700 text-white px-3 py-1 rounded-full hover:bg-purple-800">
                <SquarePlus size={16} />
                <span className="text-sm font-medium">Post</span>
              </div>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;