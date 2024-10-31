"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Input,
  Button,
  Textarea,
  Spinner,
} from "@nextui-org/react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { CldUploadWidget } from "next-cloudinary";

interface Vaccination {
  id: string /*  */;
  name: string;
  date: string;
  status: string;
  notes?: string;
  nextDate?: string;
  pet: {
    name: string;
    species: string;
    breed: string;
    age: number;
    owner: {
      name: string;
    };
  };
}
interface CloudinaryResult {
  info: {
    secure_url: string;
  };
}

const VaccinationDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [vaccination, setVaccination] = useState<Vaccination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    const fetchVaccinationDetails = async () => {
      try {
        const response = await fetch(`/api/vaccinations/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch vaccination details");
        }
        const data = await response.json();
        setVaccination(data);
        setNotes(data.notes || "");
        setNextDate(
          data.nextDate
            ? new Date(data.nextDate).toISOString().split("T")[0]
            : ""
        );
        setImageUrl(data.imageUrl || null); // Set the image URL from the fetched data
      } catch (err) {
        setError(
          "Failed to fetch vaccination details. Please try again later."
        );
        console.error("Error fetching vaccination details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchVaccinationDetails();
    }
  }, [params.id]);
  /*  */
  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/vaccinations/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
          notes,
          nextDate,
          imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update vaccination");
      }

      router.push("/dashboard/doctor");
    } catch (err) {
      setError("Failed to update vaccination. Please try again.");
      console.error("Error updating vaccination:", err);
    }
  };

  if (isLoading) return <Spinner label="Loading vaccination details..." />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!vaccination) return <div>No vaccination found</div>;
  const isCompleted =
    vaccination.status === "completed" || vaccination.status === "ended";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vaccination Details</h1>
      <button
        className="flex flex-row  justify-start items-center mb-3"
        onClick={() => router.push("/dashboard/doctor")}
      >
        <MdOutlineKeyboardBackspace
          //   className="bg-white"
          //   color="black"
          size={30}
        />{" "}
      </button>
      <Card>
        <CardBody>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Vaccination:</strong> {vaccination.name}
            </div>
            <div>
              <strong>Date:</strong>{" "}
              {new Date(vaccination.date).toLocaleDateString()}
            </div>
            <div>
              <strong>Pet:</strong> {vaccination.pet.name}
            </div>
            <div>
              <strong>Species:</strong> {vaccination.pet.species}
            </div>
            <div>
              <strong>Breed:</strong> {vaccination.pet.breed}
            </div>
            <div>
              <strong>Age:</strong>{" "}
              {new Date(vaccination.pet.age).toLocaleDateString()}{" "}
              {/* Assuming age is a date */}
            </div>
            <div>
              <strong>Owner:</strong> {vaccination.pet.owner.name}
            </div>
          </div>
          <Textarea
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-4"
          />
          <Input
            type="date"
            label="Next Vaccination Date"
            value={nextDate}
            onChange={(e) => setNextDate(e.target.value)}
            className="mt-4"
          />
          <CldUploadWidget
            uploadPreset="pet_images" // Replace with your Cloudinary upload preset
            onSuccess={(result) => {
              const image_cloud = result as CloudinaryResult;
              const newImageUrl = image_cloud.info.secure_url;

              setImageUrl(newImageUrl);
            }}
            onError={(error) => {
              console.error("Upload error:", error);
            }}
          >
            {({ open }) => (
              <Button
                onClick={() => {
                  setImageUrl(null);
                  // open();
                  open();
                }}
                className="mt-4"
              >
                Upload Vaccine Image
              </Button>
            )}
          </CldUploadWidget>
          {imageUrl && (
            <img src={imageUrl} alt="Vaccine" className="mt-4" /> // Display the uploaded image
          )}
          <Button
            color={isCompleted ? "default" : "primary"}
            onClick={handleUpdate}
            disabled={isCompleted} // Disable button if completed or ended
            className="mt-4"
          >
            {isCompleted ? "Vaccinated" : "Complete Vaccination"}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default VaccinationDetails;
