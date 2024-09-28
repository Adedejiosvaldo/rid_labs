import React from "react";
import SidebarDoc from "@/components/sidebardoc";
import AppointmentList from "./AppointmentList";

const DoctorsDashboard = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Dashboard content goes here */}
        <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
        {/* Add your dashboard content here */}
        <AppointmentList />
      </div>
    </div>
  );
};

export default DoctorsDashboard;
