import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { TbSquareToggle } from "react-icons/tb";

const DashboardLayout = ({ role, navlinks }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex font-poppins bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white/80 backdrop-blur-md shadow-xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex justify-end p-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <TbSquareToggle />
          </button>
        </div>
        <div className="h-full overflow-y-auto">
          <Sidebar navlinks={navlinks} />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header (fixed height) */}
        <div className="shrink-0">
          <Header title={`${role} Dashboard`} onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
