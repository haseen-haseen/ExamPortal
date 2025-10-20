
import React, { useState } from "react";
import { useGetAllFormsQuery, useSubmitExamFormMutation } from "../../app/ApiSlice";
import toast from "react-hot-toast";

const Forms = () => {
  const { data: forms = [], isLoading, isError } = useGetAllFormsQuery();
  const [submitExamForm] = useSubmitExamFormMutation();

const handleSubmit = async (form) => {
  try {
    const isConfirmed = window.confirm("Are you sure you want to apply for this exam?");
    if (!isConfirmed) return;

    const userId = localStorage.getItem("userId");
    if (!userId) return toast.error("User not logged in");

    // Submit the form
    const result = await submitExamForm({
      userId: parseInt(userId),
      formId: form.formId,
      submittedData: "",
    }).unwrap(); // unwrap will throw if API returns error

    // ✅ Show backend message
    toast.success(result?.message || "Form submitted successfully!");

  } catch (err) {
    console.error("Form submission failed:", err);

    const errorMessage =
      err?.data?.message || err?.error || "Failed to submit form.";

    toast.error(errorMessage);
  }
};

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const [datePart] = dateStr.split(" "); 
    const [day, month, year] = datePart.split("-").map(Number);
    if (!day || !month || !year) return "Invalid date";
    const date = new Date(year, month - 1, day); 
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) return <div className="text-center py-10 text-gray-500">Loading forms...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load forms.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Available Exam Forms</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Exam Date</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form, index) => (
              <tr key={form.formId} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-medium">{form.title}</td>
                <td className="px-4 py-3">{formatDate(form.examDate)}</td>
                <td className="px-4 py-3">₹{form.fee}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleSubmit(form)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Apply Now
                  </button>

                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Forms;
