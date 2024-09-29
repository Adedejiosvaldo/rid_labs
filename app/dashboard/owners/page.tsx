import React from "react";
import AddPets from "./addPets";

const PetOwnersDashboard = () => {
  return (
    <div>
      PetOwnersDashboard
      {/* Add Pets */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="w-full md:w-1/2">
          <p>Add Pet</p>
        </div>

        <div className="w-full md:w-1/2">
          <AddPets />
        </div>
      </div>
      {/* My Pets */}
      <h2>My Pets</h2>
      {/* List of pets with details */}
      <h2>Upcoming Appointments</h2>
      {/* List of upcoming appointments */}
      <h2>Vaccination Records</h2>
      {/* Access to vaccination records */}
    </div>
  );
};

export default PetOwnersDashboard;
