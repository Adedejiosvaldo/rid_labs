"use client";

import React from "react";
import AddPets from "./addPets";
import PetList from "./petList";
import UserWelcome from "./welcome";
import { Card, CardBody, Divider } from "@nextui-org/react";
import AddPetCardDashboard from "./addPetCard";
import { useTheme } from "next-themes";
import Appointment from "./Appointment";
import AppointmentList from "./appointmentList";

const PetOwnersDashboard = () => {
  return (
    <div>
      <UserWelcome />
      {/* Add Pets */}
      {/* <AddPetCardDashboard /> */}
      {/* <div className="flex flex-col md:flex-row gap-4 justify-evenly items-center"> */}
      <h1 className="text-2xl font-poppins text-left font-bold mt-4 mb-7">
        Add Your Pet{" "}
      </h1>{" "}
      <AddPets />
      {/* </div> */}
      {/* My Pets */}
      <Divider className="my-4" />
      <h1 className="text-2xl font-poppins text-left font-bold mt-4 mb-7">
        My Pets
      </h1>
      {/* List of pets with details */}
      <PetList />
      <Divider className="my-4" />
      <AppointmentList />
      <Divider className="my-4" />
      {/* List of upcoming appointments */}
      <h2>Vaccination Records</h2>
      {/* Access to vaccination records */}
    </div>
  );
};

export default PetOwnersDashboard;
