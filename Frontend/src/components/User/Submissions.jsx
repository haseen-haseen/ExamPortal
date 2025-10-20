import React from "react";
import { useGetUserSubmissionsQuery } from "../../app/ApiSlice";
import RazorpayButton from "./RazorPayButton";
import dayjs from "dayjs";

const Submissions = () => {
  const userId = localStorage.getItem("userId");
  const { data: submissions = [], isLoading, isError } = useGetUserSubmissionsQuery(userId);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = dayjs(dateStr, "YYYY-MM-DD HH:mm:ss");
    return date.isValid() ? date.format("DD MMM YYYY, hh:mm A") : "Invalid date";
  };

  if (isLoading)
    return <div className="text-center py-10 text-gray-500">Loading submissions...</div>;
  if (isError)
    return <div className="text-center py-10 text-red-500">Failed to load submissions.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-blue-700">My Submissions</h2>

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
              <th className="px-4 py-3">Remarks </th>
              <th className="px-4 py-3">Submitted At</th>
              <th className="px-4 py-3">Pay</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? (
              submissions.map((s, index) => (
                <tr key={s.submissionId} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{s.formTitle || "N/A"}</td>
                  <td className="px-4 py-3">{s.userName || "N/A"}</td>
                  <td className="px-4 py-3">{s.fee?.toFixed(2) || "0.00"}</td>
                  <td className="px-4 py-3">{s.referenceNo || "N/A"}</td>
                  <td className={`px-4 py-3 font-semibold ${
                    s.status === "Paid"
                      ? "text-green-600"
                      : s.status === "Pending"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}>
                    {s.status || "N/A"}
                  </td>
                  <td className="px-4 py-3">{s.remarks || "-"}</td>
                  <td className="px-4 py-3">{formatDateTime(s.submittedAt)}</td>
                  <td className="px-4 py-3">
                    {s.status !== "Paid" && s.fee > 0 && (
                      <RazorpayButton
                        amount={s.fee}
                        submissionId={s.submissionId}
                        userId={parseInt(userId)}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500 italic">
                  No submissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Submissions;
