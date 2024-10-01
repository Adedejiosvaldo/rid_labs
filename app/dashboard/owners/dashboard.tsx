"use client";
import React from "react";
import { Button, Image } from "@nextui-org/react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";

const PetOwnersDashboardA = () => {
  const { theme } = useTheme();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        {/* Left side - Text content */}
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
            Welcome to Your Pet's Digital Home
          </h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
            Keep all your furry friend's information in one place. Track health
            records, set reminders, and manage your pet's life with ease.
          </p>
          <div className="space-y-4 mb-8">
            {[
              "Health tracking",
              "Vaccination records",
              "Vet appointments",
              "Dietary logs",
            ].map((feature, index) => (
              <div key={index} className="flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-200">
                  {feature}
                </span>
              </div>
            ))}
          </div>
          <Button
            color="primary"
            variant="shadow"
            size="lg"
            startContent={<PlusCircleIcon className="h-5 w-5" />}
            onPress={() => console.log("Add pet button clicked")}
            className="font-semibold"
          >
            Add Your Pet Now
          </Button>
        </div>

        {/* Right side - Image */}
        <div className="lg:w-1/2 flex justify-center">
          <Image
            alt="Happy pets"
            src={
              theme === "dark"
                ? "/pets-illustration-dark.png"
                : "/pets-illustration-light.png"
            }
            width={500}
            height={500}
            className="object-cover rounded-lg shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default PetOwnersDashboardA;
