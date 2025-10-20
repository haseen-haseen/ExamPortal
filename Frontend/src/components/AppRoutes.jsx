import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "../Pages/Auth/Login.jsx";
import { Signup } from "../Pages/Auth/SignUp.jsx";
import { Toaster } from "react-hot-toast";

import AdminDashboard from "../Pages/Dashboard/AdminDashboard.jsx";
import UserDashboard from "../Pages/Dashboard/UserDashboard.jsx";
import Forms from "./Admin/Forms.jsx";
import Payments from "./Admin/Payments.jsx";
import Users from "./Admin/Users.jsx";
import UserForms from "./User/Forms.jsx";
import UserPayments from "./User/Payments.jsx";
import Submissions from "./User/Submissions.jsx";
import DashboardLayout from "../Pages/Dashboard/DashboardLayout.jsx";
import AdminSubmissions from "./Admin/Submissions.jsx";

function AppRoutes() {
  const adminNavlinks = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Forms", path: "/admin/forms" },
     { name: "Users", path: "/admin/users" },
    { name: "Payments", path: "/admin/payments" },
    { name: "Submissions", path: "/admin/submissions" },
  ];

  const userNavlinks = [
    { name: "Dashboard", path: "/user/dashboard" },
    { name: "Forms", path: "/user/forms" },
    { name: "Payments", path: "/user/payments" },
    { name: "Submissions", path: "/user/submissions" },
  ];

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin routes inside one layout */}
          <Route element={<DashboardLayout role="Admin" navlinks={adminNavlinks} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/forms" element={<Forms />} />
            <Route path="/admin/payments" element={<Payments />} />
            <Route path="/admin/users" element={<Users />} />
           <Route path="/admin/submissions" element={<AdminSubmissions />} />

          </Route>

          {/* User routes inside one layout */}
          <Route element={<DashboardLayout role="User" navlinks={userNavlinks} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/forms" element={<UserForms />} />
            <Route path="/user/payments" element={<UserPayments />} />
            <Route path="/user/submissions" element={<Submissions />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px" },
        }}
      />
    </>
  );
}

export default AppRoutes;
