import { useState } from "react";
import { useRegisterUserMutation } from "../../app/ApiSlice.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import config from "../../../config.js";

export const Signup = () => {
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });

  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    try {
      const { confirmPassword, ...payload } = user;
      const result = await registerUser(payload);
     
    toast.success(result.data?.message || "Account created successfully ✅");
    navigate("/");
  
     
    } catch (err) {
      toast.error(err?.data?.message || "Signup failed. Please try again.");
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
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm mb-1 text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              placeholder="Enter your name"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-60"
              style={{ outlineColor: config.THEME_COLOR }}
            />
          </div>

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
              placeholder="Create a password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-60"
              style={{ outlineColor: config.THEME_COLOR }}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm mb-1 text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter your password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-60"
              style={{ outlineColor: config.THEME_COLOR }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 mt-2 text-white font-semibold rounded-md"
            style={{ backgroundColor: config.THEME_COLOR }}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/" className="font-medium" style={{ color: config.THEME_COLOR }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};
