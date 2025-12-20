import React, { useState, useLayoutEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { type SharedData } from "@/types";
import { Bell, Search, SquarePlus, TextAlignJustify } from "lucide-react";
import Sidebar from "@/Components/navigation/Sidebar";

const SIDEBAR_WIDTH_PX = 256;
const CONTENT_MAX_WIDTH_PX = 672;

const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [sidebarLeft, setSidebarLeft] = useState(0);
  const [headerSearch, setHeaderSearch] = useState("");

  const { auth } = usePage<SharedData>().props;
  const isLoggedIn = !!auth?.user;

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);

const handleProfileClick = () => {
    closeDrawer();
    if (!isLoggedIn) {
      router.visit("/login");
      return;
    }

    const username = auth.user.username;
    router.visit(`/u/${username}`);
  };

  const handleFollowingClick = () => {
    closeDrawer();
    if (!isLoggedIn) {
      router.visit("/register");
      return;
    }
    router.visit("/following");
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const updateLayout = () => {
      const vw = window.innerWidth;
      const container = document.getElementById("app");
      if (!container) return;

      const totalWidth = SIDEBAR_WIDTH_PX + CONTENT_MAX_WIDTH_PX;

      if (vw < 768) {
        if (!isDrawerOpen) {
          setSidebarLeft(0);
          container.style.marginLeft = "auto";
          container.style.marginRight = "auto";
          return;
        }

        let blockLeft = (vw - totalWidth) / 2;
        if (blockLeft < 0) blockLeft = 0;

        setSidebarLeft(blockLeft);
        const contentLeft = blockLeft + SIDEBAR_WIDTH_PX;
        container.style.marginLeft = `${contentLeft}px`;
        container.style.marginRight = `${blockLeft}px`;
        return;
      }

      let blockLeft = (vw - totalWidth) / 2;
      if (blockLeft < 0) blockLeft = 0;

      setSidebarLeft(blockLeft);
      const contentLeft = blockLeft + SIDEBAR_WIDTH_PX;
      container.style.marginLeft = `${contentLeft}px`;
      container.style.marginRight = `${blockLeft}px`;
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [isDrawerOpen]);

  return (
    <>
      <header className="p-4 bg-white flex items-center w-full md:pl-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2 items-center font-bold text-lg">
            <TextAlignJustify
              size={20}
              className="cursor-pointer md:hidden"
              onClick={toggleDrawer}
            />
            <Link href="/">
              <h1
                className="md:hidden"
                style={{ fontFamily: '"Delius", sans-serif' }}
              >
                OceanPrompt
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.get("/search", { q: headerSearch });
              }}
              className="relative"
            >
              <input
                type="text"
                className="border border-gray-200 rounded-full text-sm pl-8 pr-3 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder="Search..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
              />
              <button
                type="submit"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <Search size={16} className="cursor-pointer" />
              </button>
            </form>

            <Bell className="cursor-pointer" size={20} />

            <Link className="z-30" href="/prompts/create">
              <div className="flex items-center text-white gap-1 bg-[#800080] px-3 py-1 rounded-full cursor-pointer">
                <SquarePlus className="text-white" stroke="white" size={16} />
                <span className="text-sm font-normal">Post</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <Sidebar
        isOpen={isDrawerOpen}
        isMoreOpen={isMoreOpen}
        sidebarLeft={sidebarLeft}
        isLoggedIn={isLoggedIn}
        onClose={closeDrawer}
        onToggleMore={() => setIsMoreOpen((prev) => !prev)}
        onProfileClick={handleProfileClick}
        onFollowingClick={handleFollowingClick}
      />
    </>
  );
};

export default Header;
