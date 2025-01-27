"use client";
import { SelectorIcon } from "@/components/SelectorIcon";
import { animals } from "@/config/data";
import { CreatePetInput, createPetSchema } from "@/schemas/PetValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePetInput>({
    resolver: zodResolver(createPetSchema),
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleCreatePet = async (data: CreatePetInput) => {
    setLoading(true);
    try {
      console.log("Data being sent:", data); // Log the data being sent
      const petData = {
        ...data,
        // age: new Date(data.age).toISOString(), // Convert the Date object to ISO string
        age: data.age.toISOString(),
        // Convert Date to ISO string
      };
      console.log("Pet data:", petData); // Log the pet data
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(petData), // Send the pet data
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response data:", errorData);

        if (Array.isArray(errorData.error)) {
          const errorMessages = errorData.error
            .map((err: any) => err.message)
            .join(", ");
          throw new Error(errorMessages);
        } else {
          throw new Error(errorData.error || "Failed to create pet");
        }
      }

      const newPet = await response.json();
      reset(); // Reset form after successful submission
      onOpenChange(); // Close modal
    } catch (error) {
      console.log("Error:", error);
      // Improved error logging
      if (error instanceof Error) {
        setErrorMessage(error.message); // Set the error message

        console.error("Error creating pet:", error.message); // Log the error message
      } else {
        setErrorMessage("An unexpected error occurred."); // Set a generic error message

        console.error("Error creating pet:", error); // Log the entire error object
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        size="lg"
        className="font-medium p-4 w-full sm:w-auto sm:min-w-[200px] mb-4"
      >
        <span className="text-md font-bold ">Add Your Pet</span>
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          onOpenChange();
          if (!open) reset();
        }}
        placement="top-center"
      >
        <ModalContent className="dark:bg-gray-800">
          {(onClose) => (
            <form onSubmit={handleSubmit(handleCreatePet)}>
              <ModalHeader className="flex flex-col gap-1">
                Add New Pet
              </ModalHeader>
              <ModalBody>
                {errorMessage && (
                  <div className="text-red-500 font-semibold text-sm">
                    {errorMessage}
                  </div>
                )}{" "}
                {/* Display error message */}
                <Input
                  {...register("name")}
                  label="Pet Name"
                  placeholder="Enter pet's name"
                  variant="bordered"
                  isInvalid={Boolean(errors.name)}
                  errorMessage={errors.name?.message}
                />
                <Select
                  {...register("species")}
                  label="Pet Type"
                  placeholder="Select an animal"
                  labelPlacement="outside"
                  className="max-w-xs"
                  disableSelectorIconRotation
                  selectorIcon={<SelectorIcon />}
                  isInvalid={Boolean(errors.species)}
                  errorMessage={errors.species?.message}
                >
                  {animals.map((animal) => (
                    <SelectItem key={animal.key}>{animal.label}</SelectItem>
                  ))}
                </Select>
                <Input
                  {...register("breed")}
                  label="Pet Breed"
                  placeholder="Enter pet's breed"
                  variant="bordered"
                  isInvalid={Boolean(errors.breed)}
                  errorMessage={errors.breed?.message}
                />
                <Input
                  {...register("age", {
                    setValueAs: (value) => new Date(value),
                  })}
                  label="Pet Age"
                  placeholder="Enter pet's age"
                  type="date"
                  variant="bordered"
                  isInvalid={Boolean(errors.age)}
                  errorMessage={errors.age?.message}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" isLoading={loading}>
                  Add Pet
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
