import { TbSquareToggle } from "react-icons/tb";
import toast from "react-hot-toast";
import config from "../../../config";
import { IoLogOut } from "react-icons/io5";
export const Header = ({ title = "", onMenuClick }) => {

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
    <div className="flex justify-between items-center mb-6">
      
      {/* Sidebar Toggle (for mobile) */}
      {onMenuClick && (
        <button
          className="md:hidden p-2 rounded bg-blue-100 hover:bg-blue-200 transition"
          onClick={onMenuClick}
        >
          <TbSquareToggle />
        </button>
      )}

      {/* Page Title */}
      <h2
        className="text-xl sm:text-2xl md:text-3xl font-bold"
        style={{
          color: config.THEME_COLOR,
          fontFamily: config.HEADING_FONT,
        }}
      >
      </h2>

      {/* Logout Button */}
      <button
  type="submit"
  onClick={handleLogout}
  className="flex items-center gap-6 px-4 py-2 bg-red-100 mr-10 mt-10 hover:bg-red-200 text-red-600 font-medium rounded-lg shadow transition"
>
  <IoLogOut className="w-4 h-4 sm:w-7 sm:h-7 md:w-5 md:h-5" />
</button>

    
    </div>
  );
};