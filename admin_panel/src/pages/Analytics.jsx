// src/pages/Analytics.jsx
import React from "react";
import AnalyticsHeader from "../components/AnalyticsHeader";

export default function Analytics() {
  return (
    <div className="p-2 sm:p-4">
      {/* Page Header with Stats */}
      <AnalyticsHeader />

      {/* Placeholder for charts or other analytics */}
      <div className="mt-6 bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Sales Overview
        </h3>
        <p className="text-gray-500">Your analytics graphs will go here.</p>
      </div>
    </div>
  );
}
