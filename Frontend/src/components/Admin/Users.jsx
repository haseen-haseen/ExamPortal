import React, { useState } from "react";
import {
  useGetAllUsersQuery,
useRegisterUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../app/ApiSlice.js";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Users() {
  const { data: users = [], isLoading } = useGetAllUsersQuery();
  const [createUser] = useRegisterUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "",
    role: "User",
    isActive: true,
  });

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setUserData(
      user
        ? {
            userName: user.userName || "",
            email: user.email || "",
            password: user.password,
            phone: user.phone || "",
            role: user.role || "User",
            isActive: user.isActive ?? true,
          }
        : {
            userName: "",
            email: "",
            password: "",
            phone: "",
            role: "User",
            isActive: true,
          }
    );
    setOpen(true);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...userData,
  };

  try {
    if (editingUser) {
      await updateUser({ id: editingUser.userId, data: payload });
      toast.success("User updated successfully!");
    } else {
      await createUser(payload);
      toast.success("User added successfully!");
    }
    setOpen(false);
  } catch (err) {
    console.error("Error saving user:", err);
    toast.error("Failed to save user. Please try again.");
  }
};


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully!");
      } catch (err) {
        console.error("Error deleting user:", err);
        toast.error("Failed to delete user. Please try again.");
      }
    }
  };

  if (isLoading)
    return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Users</h1>
        <button
          onClick={() => handleOpen()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <FaPlus /> Add User
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200 relative z-0">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white uppercase uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user.userId}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{user.userName}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">{user.isActive ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleOpen(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(user.userId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Modal */}
      {open && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg z-10">
          <h2 className="text-xl font-semibold mb-4">
            {editingUser ? "Edit User" : "Add New User"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={userData.userName}
                onChange={(e) =>
                  setUserData({ ...userData, userName: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
              />
            </div>

            {!editingUser && (
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={userData.role}
                onChange={(e) =>
                  setUserData({ ...userData, role: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={userData.isActive}
                onChange={(e) =>
                  setUserData({ ...userData, isActive: e.target.checked })
                }
                id="activeCheck"
              />
              <label htmlFor="activeCheck" className="text-sm">
                Active
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingUser ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
