import React, { useState } from "react";
import { useGetAllPaymentsQuery, useDeletePaymentMutation, useVerifyPaymentMutation } from "../../app/ApiSlice.js";
import { FaTrash, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Payments() {
  const { data: payments = [], isLoading } = useGetAllPaymentsQuery();
  const [deletePayment] = useDeletePaymentMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

const handleDelete = async (paymentId) => {
  if (window.confirm("Are you sure you want to delete this payment?")) {
    try {
      const response = await deletePayment(paymentId); 
      toast.success(response.data?.message || "Payment deleted successfully!");
    } catch (err) {
      console.error("Error deleting payment:", err);
      const errorMessage = err.response?.data?.message || "Failed to delete payment. Please try again.";
      toast.error(errorMessage);
    }
  }
};

const handleDownload = (payment) => {
  const doc = new jsPDF();
  doc.setFillColor(240, 248, 255);
  doc.rect(10, 10, 190, 110, "F");

  doc.setFontSize(18);
  doc.setTextColor(0, 51, 102);
  doc.text("Exam Payment Receipt", 105, 25, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  const cardData = [
    ["Student Name", payment.userName],
    ["Email", payment.email],
    ["Form", payment.formTitle],
    ["Amount Paid", `${payment.amount.toFixed(2)}`],
    ["Payment Gateway", payment.paymentGateway],
    ["Payment Method", payment.paymentMethod],
    ["Transaction ID", payment.transactionId],
    ["Status", payment.status],
    ["Date", payment.paymentDate],
  ];

  autoTable(doc, {
    startY: 35,
    theme: "grid",
    head: [["Field", "Details"]],
    body: cardData,
    styles: { cellPadding: 3, fontSize: 11 },
    headStyles: { fillColor: [0, 51, 102], textColor: 255 },
    columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 120 } },
  });

  const finalY = doc.lastAutoTable.finalY || 35; 

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `© ${new Date().getFullYear()} Exam Portal | Receipt generated automatically`,
    105,
    finalY + 10,
    { align: "center" }
  );

  doc.save(`Payment_Receipt_${payment.paymentId}.pdf`);
};

  const handleStatusChange = async (payment, newStatus) => {
      if(window.confirm("are you sure you want to update status ")){
    try {
  
      await verifyPayment({ TransactionId: payment.transactionId, Status: newStatus }).unwrap();
      toast.success("Payment status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update payment status.");
    }
  };
  }
  const totalPayments = payments?.length || 0;
  const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (isLoading)
    return <div className="text-center py-10 text-gray-500">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto relative">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Payments</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-100  p-6 rounded-2xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-gray-600">Total Payments</h4>
          <p className="text-3xl font-bold mt-2">{totalPayments}</p>
        </div>

        <div className="bg-blue-100  p-6 rounded-2xl shadow-md text-center">
          <h4 className="text-lg font-semibold text-gray-600">Total Revenue</h4>
          <p className="text-3xl font-bold mt-2">₹{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Form</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Gateway</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p, index) => (
                <tr key={p.paymentId} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{p.userName}</td>
                  <td className="px-4 py-3">{p.formTitle}</td>
                  <td className="px-4 py-3">₹{p.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">{p.paymentGateway}</td>
                  <td className="px-4 py-3">{p.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={p.status}
                      onChange={(e) => handleStatusChange(p, e.target.value)}
                    >
                      <option value="Success">Success</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">{p.paymentDate}</td>
                  <td className="px-4 py-3 text-center flex justify-center gap-3">
                    <button
                      onClick={() => handleDownload(p)}
                      className="text-green-600 hover:text-green-800"
                      title="Download Receipt"
                    >
                      <FaDownload />
                    </button>
                    <button
                      onClick={() => handleDelete(p.paymentId)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Payment"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500 italic">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
