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
import { CldUploadWidget, CldUploadButton } from "next-cloudinary";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Appointment from "../../Appointment";
import Vaccination from "../../Vacination";

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
  ownerId: string; // Add this line
}

interface CloudinaryResult {
  info: {
    secure_url: string;
  };
}

export default function PetDetailsPage() {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [updatedFields, setUpdatedFields] = useState<Partial<Pet>>({});
  const params = useParams();
  const router = useRouter();
  const petId = params.petId as string;
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

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

  const handleCancel = () => {
    setEditing(false);
    setUpdatedFields({});
    setTempImageUrl(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (result: CloudinaryResult) => {
    console.log("Upload Result:", result); // Add this line for debugging
    const newImageUrl = result.info.secure_url;
    setUpdatedFields((prev) => ({
      ...prev,
      imageUrl: newImageUrl,
    }));

    setTempImageUrl(newImageUrl);

    // setPet((prevPet) => ({
    //   ...prevPet!,
    //   imageUrl: newImageUrl,
    // }));
  };

  const handleSave = async () => {
    if (!pet) return;
    setSaveLoading(true);
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
      setSaveLoading(false);
      setEditing(false);
      setUpdatedFields({});
      setTempImageUrl(null);
      toast.success("Pet information updated successfully!");
    } catch (error) {
      console.error("Error updating pet:", error);
      toast.error("Failed to update pet information");
    } finally {
      setSaveLoading(false);
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
        <CardHeader className="flex justify-end">
          {!editing && (
            <Button
              startContent={<PencilIcon className="h-5 w-5" />}
              onPress={handleEditToggle}
            >
              Edit
            </Button>
          )}
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Image
              src={
                tempImageUrl ||
                pet?.imageUrl ||
                `https://robohash.org/${pet.name}${pet.species}?set=set${
                  pet.species === "dog" ? "1" : "2"
                }&size=200x200`
              }
              alt={pet.name}
              width={300}
              height={300}
              className="rounded-lg object-cover"
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
          {/* {!editing && (
            <Button
              startContent={<PencilIcon className="h-5 w-5" />}
              onPress={handleEditToggle}
            >
              Edit
            </Button>
          )} */}
        </CardBody>
        <Divider />
        <CardBody className="space-y-4">
          {editing && (
            <div className=" p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">Update Pet Picture</h3>
              <p className=" mb-4">
                Click below to upload a new picture of your pet
              </p>
              <CldUploadWidget
                uploadPreset="pet_images"
                onSuccess={(result) => {
                  handleImageUpload(result as CloudinaryResult);
                }}
                onError={(error) => {
                  console.error("Upload error:", error);
                }}
              >
                {({ open }) => {
                  return (
                    <Button
                      color="primary"
                      onPress={() => {
                        setUpdatedFields((prev) => ({
                          ...prev,
                          imageUrl: undefined,
                        }));
                        open();
                      }}
                      className="mx-auto"
                    >
                      Upload Pet Picture
                    </Button>
                  );
                }}
              </CldUploadWidget>
            </div>
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
            <h2 className="text-xl font-poppins font-bold">
              Vaccination Records
            </h2>{" "}
            <Vaccination petId={pet.id} />
          </div>

          <Divider />
          {/* <div>
            <h2 className="text-xl font-poppins font-bold">
              Upcoming Appointments
            </h2>
            <p>{pet.nextTreatment || "No upcoming treatments scheduled."}</p>
          </div> */}
          {/* <Divider /> */}
        </CardBody>

        <Appointment petId={petId} petOwnerId={pet.ownerId} />
        {editing && (
          <div className="flex justify-center gap-4 p-4">
            <Button color="danger" onPress={handleCancel}>
              Cancel
            </Button>
            <Button
              isLoading={saveLoading}
              color="primary"
              startContent={<CheckIcon className="h-5 w-5" />}
              onPress={handleSave}
            >
              Save
            </Button>
          </div>
        )}
      </Card>

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
