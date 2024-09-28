import React from "react";

const DoctorsDashboard = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        <h2>Upcoming Appointments</h2>
        {/* List of upcoming appointments */}
        <h2>Pet Owners</h2>
        {/* List of pet owners with their pets */}
        <h2>Vaccination Records</h2>
        {/* Access to vaccination records */}
        <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
};

export default DoctorsDashboard;
