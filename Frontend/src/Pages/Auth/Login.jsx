import { useState } from "react"; 
import { useLoginUserMutation } from "../../app/ApiSlice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import config from "../../../config.js";

export const Login = () => {
  const [loginUser, { isLoading: loggingIn }] = useLoginUserMutation();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    // Using RTK Query .unwrap() to throw on error automatically
    const result = await loginUser(user).unwrap();

    // Save data to localStorage
    localStorage.setItem("token", result.token);
    localStorage.setItem("role", result.role);
    localStorage.setItem("username", result.username);
    localStorage.setItem("userId", result.userId);

    toast.success(result.message);

    navigate(result.role === "Admin" ? "/admin/dashboard" : "/user/dashboard");
  } catch (err) {
    const errorMessage =
      err?.data?.message || err?.error || "Login failed. Please try again.";

    toast.error(errorMessage);
    console.error("Login Error:", err);
  }
};


  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-gray-100 px-4"
      style={{ fontFamily: config.HEADING_FONT }}
    >
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: config.THEME_COLOR }}
        >
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1 text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-60"
              style={{ outlineColor: config.THEME_COLOR }}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1 text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-60"
              style={{ outlineColor: config.THEME_COLOR }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 text-white font-semibold rounded-md"
            style={{ backgroundColor: config.THEME_COLOR }}
          >
            {loggingIn ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="font-medium" style={{ color: config.THEME_COLOR }}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};
