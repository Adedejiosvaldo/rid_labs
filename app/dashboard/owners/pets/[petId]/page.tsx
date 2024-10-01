"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Image,
  Divider,
  Spinner,
  Button,
  Input,
  Textarea,
} from "@nextui-org/react";
import {
  ArrowLeftIcon,
  PencilIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { CldUploadWidget } from "next-cloudinary";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  imageUrl?: string;
  description?: string;
  vaccinationRecords?: { name: string; date: string }[];
  nextTreatment?: string;
}

interface CloudinaryResult {
  info: {
    secure_url: string;
  };
}

export default function PetDetailsPage() {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updatedFields, setUpdatedFields] = useState<Partial<Pet>>({});
  const params = useParams();
  const router = useRouter();
  const petId = params.petId as string;

  useEffect(() => {
    fetchPetDetails();
  }, [petId]);

  const fetchPetDetails = async () => {
    try {
      const response = await fetch(`/api/pets/${petId}`);
      if (!response.ok) throw new Error("Failed to fetch pet details");
      const data = await response.json();
      setPet(data);
    } catch (error) {
      console.error("Error fetching pet details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => router.back();

  const handleEditToggle = () => {
    if (editing) {
      // If we're exiting edit mode, reset updatedFields
      setUpdatedFields({});
    } else {
      // If we're entering edit mode, initialize updatedFields with current pet data
      setUpdatedFields({
        name: pet?.name,
        age: pet?.age,
        description: pet?.description,
        imageUrl: pet?.imageUrl,
      });
    }
    setEditing(!editing);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (result: CloudinaryResult) => {
    setUpdatedFields((prev) => ({ ...prev, imageUrl: result.info.secure_url }));
  };

  const handleSave = async () => {
    if (!pet) return;

    try {
      const response = await fetch(`/api/pets/${petId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });
      if (!response.ok) throw new Error("Failed to update pet");
      const updatedPet = await response.json();
      setPet(updatedPet);
      setEditing(false);
      setUpdatedFields({});
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  };

  if (loading) return <Spinner label="Loading pet details..." />;
  if (!pet) return <div>Pet not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button
        startContent={<ArrowLeftIcon className="h-5 w-5" />}
        onPress={handleBackClick}
        className="mb-4"
      >
        Back to Pets
      </Button>
      <Card className="shadow-lg">
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              alt={pet.name}
              src={
                updatedFields.imageUrl ||
                pet.imageUrl ||
                `https://robohash.org/${pet.name}${pet.species}?set=set${
                  pet.species === "dog" ? "1" : "2"
                }&size=100x100`
              }
              width={100}
              height={100}
              className="rounded-full object-cover"
            />
            <div>
              {editing ? (
                <Input
                  name="name"
                  value={updatedFields.name || ""}
                  onChange={handleInputChange}
                  className="max-w-xs"
                />
              ) : (
                <h2 className="text-2xl font-bold">{pet.name}</h2>
              )}
              <p className="text-default-500">
                {pet.species} - {pet.breed}
              </p>
            </div>
          </div>
          <Button
            startContent={
              editing ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <PencilIcon className="h-5 w-5" />
              )
            }
            onPress={editing ? handleSave : handleEditToggle}
          >
            {editing ? "Save" : "Edit"}
          </Button>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          {editing && (
            <CldUploadWidget
              uploadPreset="your_upload_preset"
              onUpload={(result) =>
                handleImageUpload(result as CloudinaryResult)
              }
            >
              {({ open }) => (
                <Button onClick={() => open()}>Upload Image</Button>
              )}
            </CldUploadWidget>
          )}
          <div>
            <h3 className="text-lg font-semibold mb-2">Age</h3>
            {editing ? (
              <Input
                name="age"
                value={updatedFields.age?.toString() || ""}
                onChange={handleInputChange}
                type="number"
                className="max-w-xs"
              />
            ) : (
              <p>{pet.age} years</p>
            )}
          </div>
          <Divider />
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            {editing ? (
              <Textarea
                name="description"
                value={updatedFields.description || ""}
                onChange={handleInputChange}
                className="w-full"
              />
            ) : (
              <p>{pet.description || "No description available."}</p>
            )}
          </div>
          <Divider />
          <div>
            <h3 className="text-lg font-semibold mb-2">Vaccination Records</h3>
            {pet.vaccinationRecords && pet.vaccinationRecords.length > 0 ? (
              <ul className="list-disc list-inside">
                {pet.vaccinationRecords.map((record, index) => (
                  <li key={index}>
                    {record.name} - {record.date}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No vaccination records available.</p>
            )}
          </div>
          <Divider />
          <div>
            <h3 className="text-lg font-semibold mb-2">Next Treatment</h3>
            <p>{pet.nextTreatment || "No upcoming treatments scheduled."}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
