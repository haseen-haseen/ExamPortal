import React, { useState } from "react";
import {
  useGetAllSubmissionsQuery,
  useUpdateSubmissionStatusMutation,
  useDeleteSubmissionMutation,
} from "../../app/ApiSlice";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa";

const AdminSubmissions = () => {
  const { data: submissions = [], isLoading, isError, refetch } = useGetAllSubmissionsQuery();
  const [updateStatus] = useUpdateSubmissionStatusMutation();
  const [deleteSubmission] = useDeleteSubmissionMutation();

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = dayjs(dateStr, "YYYY-MM-DD HH:mm:ss");
    return date.isValid() ? date.format("DD MMM YYYY, hh:mm A") : "Invalid date";
  };

  const handleEdit = (submission) => {
    setEditingId(submission.submissionId);
    setEditValues((prev) => ({
      ...prev,
      [submission.submissionId]: {
        status: submission.status || "Pending",
        remarks: submission.remarks || "",
      },
    }));
  };

  const handleSave = async (submissionId) => {
    const { status, remarks } = editValues[submissionId] || {};
    try {
      await updateStatus({ id: submissionId, status, remarks });
          console.log("Saving:", { id: submissionId, status, remarks });

      toast.success("Submission updated successfully!");
      setEditingId(null);
      setEditValues((prev) => {
        const updated = { ...prev };
        delete updated[submissionId];
        return updated;
      });
      refetch();
    } catch (err) {
      toast.error("Failed to update submission.");
    }

  };

 const handleDelete = async (submissionId) => {
  if (!window.confirm("Are you sure you want to delete this submission?")) return;

  try {
    const response = await deleteSubmission(submissionId); 
    toast.success(response.data?.message || "Submission deleted successfully!");
    refetch();
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Failed to delete submission.";
    toast.error(errorMessage);
  }
};


  if (isLoading)
    return <div className="text-center py-10 text-gray-500">Loading submissions...</div>;
  if (isError)
    return <div className="text-center py-10 text-red-500">Failed to load submissions.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-grey-700">All Submissions</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">User Name</th>
              <th className="px-4 py-3">Form Title</th>
              <th className="px-4 py-3">Fee (₹)</th>
              <th className="px-4 py-3">Reference No</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Remarks</th>
              <th className="px-4 py-3">Submitted At</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? (
              submissions.map((sub, index) => {
                const isEditing = editingId === sub.submissionId;
                const currentEdit = editValues[sub.submissionId] || {};

                return (
                  <tr key={sub.submissionId} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{sub.userName || "N/A"}</td>
                    <td className="px-4 py-3">{sub.formTitle || "N/A"}</td>
                    <td className="px-4 py-3">{sub.fee?.toFixed(2) || "0.00"}</td>
                    <td className="px-4 py-3">{sub.referenceNo || "N/A"}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          className="border rounded px-2 py-1 text-sm w-full"
                          value={currentEdit.status}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              [sub.submissionId]: {
                                ...prev[sub.submissionId],
                                status: e.target.value,
                              },
                            }))
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Approved">Approved</option>
                        </select>
                      ) : (
                        sub.status || "Pending"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                      <input
  type="text"
  value={currentEdit.remarks || ""}
  onChange={(e) =>
    setEditValues((prev) => ({
      ...prev,
      [sub.submissionId]: {
        ...prev[sub.submissionId],
        remarks: e.target.value,
      },
    }))
  }
  className="border rounded px-2 py-1 w-full"
  placeholder="Enter remarks"
/>

                      ) : (
                        sub.remarks || "-"
                      )}
                    </td>
                    <td className="px-4 py-3">{formatDateTime(sub.submittedAt)}</td>
                    <td className="px-4 py-3 text-center flex justify-center gap-3">
                      {isEditing ? (
                        <button
                          onClick={() => handleSave(sub.submissionId)}
                          className="text-green-600 hover:text-green-800"
                          title="Save"
                        >
                          <FaSave />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(sub)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(sub.submissionId)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500 italic">
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubmissions;
