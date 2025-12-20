import React, { ReactNode } from "react";
import Header from "@/Components/navigation/Header";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="px-4">
        <div className="h-px w-full" />
      </div>
      <main className="pb-10">{children}</main>
    </div>
  );
};

export default AppLayout;
