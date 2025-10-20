
import { NavLink } from "react-router-dom";
import { TbLayoutDashboard, TbFileText, TbUsers, TbCreditCard, TbLogout } from "react-icons/tb";
import toast from "react-hot-toast";

export const Sidebar = ({ navlinks }) => {
  const iconMap = {
    Dashboard: <TbLayoutDashboard className="w-5 h-5" />,
    Forms: <TbFileText className="w-5 h-5" />,
    Payments: <TbCreditCard className="w-5 h-5" />,
    Users: <TbUsers className="w-5 h-5" />,
    Submissions: <TbFileText className="w-5 h-5" />,
    Logout: <TbLogout className="w-5 h-5" />,
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      toast.success("Logged Out Successfully.");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-blue-800 text-white">
      {/* Logo and Title */}
      <div className="flex items-center gap-3 px-4 py-4">
        <img
          src="/dcs.png"
          alt="Logo"
          className="w-6 h-6 sm:w-14 sm:h-14 md:w-10 md:h-10 rounded-full object-cover  bg-white"
        />
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold hidden sm:block">Technosis</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col px-2 py-4 flex-1">
        {navlinks?.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg mb-2 text-white font-medium hover:bg-blue-700 transition ${
                isActive ? "bg-blue-900" : ""
              }`
            }
          >
            {iconMap[link.name] || <TbLayoutDashboard className="w-5 h-5" />}
            <span>{link.name}</span>
          </NavLink>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 mt-auto rounded-lg text-white font-medium hover:bg-red-600 transition"
        >
          {iconMap["Logout"]}
          <span>Logout</span>
        </button>
      </nav>
      <div className="flex-1 p-6 overflow-auto">
  </div>
    </div>
  );
};
