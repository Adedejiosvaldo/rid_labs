import React from "react";
import SidebarDoc from "@/components/sidebardoc";
import AppointmentList from "./AppointmentList";
import LogoutButton from "@/components/Logout";

const DoctorsDashboard = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        <AppointmentList />
      </div>
      {/* <LogoutButton /> */}
    </div>
  );
};

export default DoctorsDashboard;
