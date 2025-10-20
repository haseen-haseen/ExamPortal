import React, { useState } from "react";
import {
  useGetAllFormsQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
} from "../../app/ApiSlice.js";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Forms() {
  const { data: forms = [], isLoading } = useGetAllFormsQuery();
  const [createForm] = useCreateFormMutation();
  const [updateForm] = useUpdateFormMutation();
  const [deleteForm] = useDeleteFormMutation();

  const [open, setOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const createdBy = localStorage.getItem("userId") || "";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    examDate: "",
    registrationStartDate: "",
    registrationEndDate: "",
    fee: "",
    createdBy: createdBy,
  });

  const handleOpen = (form = null) => {
    setEditingForm(form);
    setFormData(
      form
        ? {
            title: form.title,
            description: form.description,
            examDate: form.examDate.split("T")[0],
            registrationStartDate: form.registrationStartDate.split("T")[0],
            registrationEndDate: form.registrationEndDate.split("T")[0],
            fee: form.fee,
            createdBy: createdBy,
          }
        : {
            title: "",
            description: "",
            examDate: "",
            registrationStartDate: "",
            registrationEndDate: "",
            fee: "",
            createdBy: createdBy,
          }
    );
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      examDate: formData.examDate
        ? new Date(formData.examDate).toISOString()
        : null,
      registrationStartDate: formData.registrationStartDate
        ? new Date(formData.registrationStartDate).toISOString()
        : null,
      registrationEndDate: formData.registrationEndDate
        ? new Date(formData.registrationEndDate).toISOString()
        : null,
      fee: Number(formData.fee),
      createdBy: createdBy,
    };

    try {
      if (editingForm) {
        const result = await updateForm({
          id: editingForm.formId,
          data: payload,
        });
        console.log("Update result:", result);
        toast.success("Form updated successfully!");
      } else {
        const result = await createForm(payload);
        console.log("Create result:", result);
        toast.success("Form added successfully!");
      }
      setOpen(false);
    } catch (err) {
      console.error("Error saving form:", err);
      toast.error("Failed to save form. Please try again.");
    }
  };

const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this form?")) {
    try {
      const result = await deleteForm(id).unwrap(); 
      toast.success(result?.message || "Form deleted successfully!");
    } catch (err) {
      console.error("Error deleting form:", err);
      toast.error(err?.data?.message || "Failed to delete form. Please try again.");
    }
  }
};


  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split(" ")[0].split("-");
    return `${day}-${month}-${year}`;
  };

  if (isLoading)
    return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Forms</h1>
        <button
          onClick={() => handleOpen()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <FaPlus /> Add Form
        </button>
      </div>

      {/* Table */}
    
      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Exam Date</th>
              <th className="px-4 py-3">Reg. Start</th>
              <th className="px-4 py-3">Reg. End</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.length > 0 ? (
              forms.map((form, index) => (
                <tr
                  key={form.formId}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{form.title}</td>
                  <td className="px-4 py-3">{formatDate(form.examDate)}</td>
                  <td className="px-4 py-3">
                    {formatDate(form.registrationStartDate)}
                  </td>
                  <td className="px-4 py-3">
                    {formatDate(form.registrationEndDate)}
                  </td>
                  <td className="px-4 py-3">₹{form.fee}</td>
                  <td className="px-4 py-3">{form.creator}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleOpen(form)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(form.formId)}
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
                  colSpan="8"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No forms available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Floating Modal over table */}
      {open && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-lg z-10">
          <h2 className="text-xl font-semibold mb-4">
            {editingForm ? "Edit Form" : "Add New Form"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Exam Date
                </label>
                <input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) =>
                    setFormData({ ...formData, examDate: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fee (₹)</label>
                <input
                  type="number"
                  value={formData.fee}
                  onChange={(e) =>
                    setFormData({ ...formData, fee: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Registration Start
                </label>
                <input
                  type="date"
                  value={formData.registrationStartDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationStartDate: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Registration End
                </label>
                <input
                  type="date"
                  value={formData.registrationEndDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationEndDate: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded-md focus:outline-blue-500"
                />
              </div>
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
                {editingForm ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
