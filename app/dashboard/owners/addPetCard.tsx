"use client";
import React from "react";
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/solid";

const AddPetCardDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="max-w-[600px] mx-auto">
      <CardHeader className="pb-0 pt-6 px-6 flex-col items-start">
        <h4 className="font-bold text-2xl mb-1">Add Your Pet</h4>
        <p className="text-default-500 text-sm">Cats, dogs, birds, and more!</p>
      </CardHeader>
      <CardBody className="overflow-visible py-6 px-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Image
            alt="Various pets"
            className="object-cover rounded-xl w-full md:w-1/2"
            src="/images/pets-collage.jpg"
            height={200}
          />
          <div className="w-full md:w-1/2 space-y-4">
            <p className="text-default-700">
              Keep all your furry, feathery, or scaly friends' information in
              one place:
            </p>
            <ul className="list-disc list-inside text-default-600 space-y-2">
              <li>Health records</li>
              <li>Vaccination schedules</li>
              <li>Dietary information</li>
              <li>Vet appointments</li>
            </ul>
            <Button
              color="primary"
              size="lg"
              className="w-full mt-4"
              startContent={<PlusCircleIcon className="h-5 w-5" />}
            >
              Add New Pet
            </Button>
          </div>
        </div>
      </CardBody>
      </Card>
    </div>
  );
};

export default AddPetCardDashboard;
