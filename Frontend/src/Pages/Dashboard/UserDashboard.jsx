import React from "react";
import { useGetAllFormsQuery, useGetAllPaymentsQuery } from "../../app/ApiSlice";
import { useNavigate } from "react-router-dom";
import config from "../../../config";

const UserDashboard = () => {
  const { data: forms } = useGetAllFormsQuery();
  const { data: payments } = useGetAllPaymentsQuery();
  const welcomeMessage = localStorage.getItem("username");
  const navigate = useNavigate();

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-blue-100 p-6 rounded-2xl shadow-lg mb-8 text-center">
        <h3
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3"
          style={{ color: config.THEME_COLOR, fontFamily: config.HEADING_FONT }}
        >
          Welcome {welcomeMessage}!
        </h3>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Total Forms Card */}
        <div
          className="bg-blue-100 p-6 rounded-2xl shadow-md text-center cursor-pointer hover:bg-blue-200 transition"
          onClick={() => navigate("/user/forms")}
        >
          <h4 className="text-lg font-semibold text-gray-600">Total Forms</h4>
          <p className="text-3xl font-bold mt-2">{forms?.length || 0}</p>
        </div>

        {/* Total Payments Card */}
        <div
          className="bg-blue-100 p-6 rounded-2xl shadow-md text-center cursor-pointer hover:bg-blue-200 transition"
          onClick={() => navigate("/user/payments")}
        >
          <h4 className="text-lg font-semibold text-gray-600">Total Payments</h4>
          <p className="text-3xl font-bold mt-2">{payments?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
