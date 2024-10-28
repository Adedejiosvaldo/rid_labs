import React from "react";
import SidebarDoc from "@/components/sidebardoc";
import AppointmentList from "./AppointmentList";
import LogoutButton from "@/components/Logout";
import VaccinationList from "./VaccinationRecords";
import PetList from "./Petlist";
import { Divider } from "@nextui-org/react";
const DoctorsDashboard = () => {
  return (
    <div className=" h-screen">
      <div className="flex-1 flex-col overflow-y-auto p-4">
        <AppointmentList />
        {/* <div className="flex-1 overflow-y-auto p-4"> */}
        <VaccinationList />
        {/* <Divider /> */}
        <PetList />
        {/* </div> */}
      </div>
      <LogoutButton />
    </div>
  );
};

export default DoctorsDashboard;
