"use client";
import { SelectorIcon } from "@/components/SelectorIcon";
import { animals } from "@/config/data";
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

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} color="primary">
        Add Your Pet{" "}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Pet
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Pet Name"
                  placeholder="Enter pet's name"
                  variant="bordered"
                />
                <Select
                  label="Pet Type"
                  placeholder="Select an animal"
                  labelPlacement="outside"
                  className="max-w-xs"
                  disableSelectorIconRotation
                  selectorIcon={<SelectorIcon />}
                >
                  {animals.map((animal) => (
                    <SelectItem key={animal.key}>{animal.label}</SelectItem>
                  ))}
                </Select>

                <Input
                  label="Pet Breed"
                  placeholder="Enter pet's breed"
                  variant="bordered"
                />
                <Input
                  label="Pet Age"
                  placeholder="Enter pet's age"
                  type="number"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Add Pet
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
