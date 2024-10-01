"use client";

import React from "react";
import AddPets from "./addPets";
import PetList from "./petList";
import UserWelcome from "./welcome";
import { Card, CardBody, Divider } from "@nextui-org/react";
import AddPetCardDashboard from "./addPetCard";
import { useTheme } from "next-themes";

const PetOwnersDashboard = () => {
  return (
    <div>
      <UserWelcome />
      {/* Add Pets */}

      {/* <AddPetCardDashboard /> */}

      <div className="flex flex-col md:flex-row justify-evenly items-center">
        <p>Add Your Pet</p>

        <AddPets />
      </div>
      {/* My Pets */}
      <Divider className="my-4" />
      <h2
        className={`text-2xl font-poppins font-medium mb-3 ${
          useTheme().theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        My Pets
      </h2>
      {/* List of pets with details */}
      <PetList />
      <Divider className="my-4" />
      <h2>Upcoming Appointments</h2>
      {/* List of upcoming appointments */}
      <h2>Vaccination Records</h2>
      {/* Access to vaccination records */}
    </div>
  );
};

export default PetOwnersDashboard;
