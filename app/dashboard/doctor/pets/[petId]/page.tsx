"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Button,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
  Textarea,
} from "@nextui-org/react";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import {
  MdDelete,
  MdModeEdit,
  MdOutlineKeyboardBackspace,
} from "react-icons/md";
import SignaturePad from "@/components/SignaturePad";
import { CldUploadWidget } from "next-cloudinary";
interface MedicalRecord {
  id: string;
  history: string;
  clinicalParameters: string;
  diagnosis: string;
  treatment: string;
  recommendations: string;
  nextAppointment: string; // or Date if you want to store it as a Date object
  signature: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number; // or Date if you want to store it as a Date object
  imageUrl?: string;
  description?: string;
  owner?: {
    name: string;
    phoneNumber: string;
    email: string;
  };
  vaccinations: Array<{
    id: string;
    name: string;
    date: string;
    status: string;
  }>;
  appointments: Array<{
    id: string;
    date: string;
    reason: string;
    status: string;
  }>;
  medicalRecords?: MedicalRecord[]; // Ensure this is included
}

interface CloudinaryResult {
  info: {
    secure_url: string;
  };
}

const PetDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const {
    isOpen: isMedicalRecordModalOpen,
    onOpen: onMedicalRecordModalOpen,
    onClose: onMedicalRecordModalClose,
  } = useDisclosure();
  const { isOpen: isVaccinationModalOpen, onOpen, onClose } = useDisclosure();
  const [newVaccination, setNewVaccination] = useState({
    name: "",
    date: "",
    imageUrl: "",
    nextDate: "",
    notes: "",
    // Add imageUrl to the state
  });
  const [newRecord, setNewRecord] = useState({
    history: "",
    clinicalParameters: "",
    diagnosis: "",
    treatment: "",
    recommendations: "",
    nextAppointment: "",
    signature: "",
  });

  const fetchPetDetails = async () => {
    try {
      const response = await fetch(`/api/pets/${params.petId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch pet details");
      }
      const data = await response.json();
      setPet(data);

      // Fetch medical records
      const recordsResponse = await fetch(`/api/pets/${params.petId}/records`);
      if (!recordsResponse.ok) {
        throw new Error("Failed to fetch medical records");
      }
      const recordsData: MedicalRecord[] = await recordsResponse.json(); // Ensure the records are typed
      setPet((prevPet) => ({
        ...(prevPet
          ? prevPet
          : {
              id: "",
              name: "",
              species: "",
              breed: "",
              age: 0,
              vaccinations: [],
              appointments: [],
              medicalRecords: [],
              owner: { name: "", phoneNumber: "", email: "" },
            }),
        medicalRecords: recordsData,
      }));
    } catch (err) {
      setError("Failed to fetch pet details. Please try again later.");
      console.error("Error fetching pet details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("params", params.petId);
    if (params.petId) {
      fetchPetDetails();
    }
  }, [params.petId]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format to YYYY-MM-DD
    setNewVaccination((prev) => ({ ...prev, date: formattedDate })); // Set the current date
  }, []);

  const handleAddVaccination = async () => {
    setIsFormLoading(true);
    try {
      const response = await fetch("/api/vaccinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          petId: pet?.id,
          name: newVaccination.name,
          date: newVaccination.date,
          status: "completed",
          nextDate: newVaccination.nextDate,
          imageUrl: newVaccination.imageUrl, // Include the image URL
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add vaccination");
      }

      onClose();
      toast.success("Medical record added successfully");
      //   router.refresh();
      //   router.refresh();
      location.reload();
    } catch (err) {
      console.error("Error adding vaccination:", err);
      setError("Failed to add vaccination. Please try again.");
      toast(`
        description: "An unexpected error occurred. Please try again.`);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleAddRecord = async () => {
    try {
      console.log("Adding new record for pet ID:", pet?.id); // Debugging line
      console.log("New Record Data:", newRecord); // Debugging line
      console.log(params.id);

      const response = await fetch(`/api/pets/${params.petId}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newRecord,
          petId: params.petId, // Ensure petId is correctly set
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add medical record");
      }

      onMedicalRecordModalClose();

      // Refresh pet details
      const updatedPetResponse = await fetchPetDetails();

      toast.success("Medical record added successfully");
      router.refresh();

      setNewRecord({
        history: "",
        clinicalParameters: "",
        diagnosis: "",
        treatment: "",
        recommendations: "",
        nextAppointment: "",
        signature: "",
      });
    } catch (err: any) {
      console.error("Error adding medical record:", err);

      if (err instanceof TypeError) {
        // Network error
        toast(`
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,`);
      } else if (err.message?.includes("Failed to add medical record")) {
        // Server error
        toast(`
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,`);
      } else {
        // Other errors
        toast(`
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,`);
      }
    } finally {
      setNewRecord({
        history: "",
        clinicalParameters: "",
        diagnosis: "",
        treatment: "",
        recommendations: "",
        nextAppointment: "",
        signature: "",
      });
      setIsFormLoading(false);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      const response = await fetch(
        `/api/pets/${params.petId}/records/${recordId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete medical record");
      }

      // Refresh pet details
      await fetchPetDetails();

      toast.success("Medical record deleted successfully");
      router.refresh();
    } catch (err: any) {
      console.error("Error deleting medical record:", err);

      if (err instanceof TypeError) {
        // Network error
        toast(
          ` title: "Network Error",
          description: "Please check your internet connection and try again.",
          status: "error",
          duration: 5000,
          isClosable: true,`
        );
      } else if (err.message?.includes("Failed to delete medical record")) {
        // Server error
        toast(
          ` title: "Server Error",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,`
        );
      } else {
        // Other errors
        toast(
          ` title: "Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,`
        );
      }
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust for negative days or months
    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // Get last day of the previous month
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const navigateToVaccinationDetails = (vaccinationId: string) => {
    router.push(`/dashboard/doctor/vaccinations/${vaccinationId}`);
  };

  const navigateToMedicalRecordDetails = (recordId: string) => {
    router.push(`/dashboard/doctor/pets/${params.petId}/records/${recordId}`);
  };
  const age = pet?.age ? calculateAge(pet?.age.toString()) : null;

  if (isLoading) return <Spinner label="Loading pet details..." />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!pet) return <div>No pet found</div>;

  return (
    <div className="p-4">
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
      <h1 className="text-2xl font-bold mb-4">Patient Details: {pet.name}</h1>
      <Card>
        <CardBody>
          {pet.imageUrl && (
            <img
              src={pet.imageUrl}
              alt={pet.name}
              className="w-full h-64 object-cover mb-4"
            />
          )}
          <p>
            <strong>Species:</strong> {pet.species}
          </p>
          <p>
            <strong>Breed:</strong> {pet.breed}
          </p>
          <p>
            <strong>Age:</strong>{" "}
            {age
              ? `${age.years} years, ${age.months} months, ${age.days} days`
              : "N/A"}
          </p>
          {pet.owner && (
            <>
              <p>
                <strong>Owner:</strong> {pet.owner.name}
              </p>
              <p>
                <strong>Owner Phone:</strong> {pet.owner.phoneNumber}
              </p>
              <p>
                <strong>Owner Email:</strong> {pet.owner.email}
              </p>
            </>
          )}
          {pet.description && (
            <p>
              <strong>Description:</strong> {pet.description}
            </p>
          )}

          <h2 className="text-xl font-bold mt-4 mb-2">Vaccinations</h2>
          {pet.vaccinations && pet.vaccinations.length > 0 ? (
            <div>
              <ul>
                {pet.vaccinations.map((vac) => (
                  <li key={vac.id} className="mb-2">
                    {vac.name} - {new Date(vac.date).toLocaleDateString()} (
                    {vac.status})
                    <Button
                      size="sm"
                      color="primary"
                      onClick={() => navigateToVaccinationDetails(vac.id)}
                      className="ml-2"
                    >
                      View/Update
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <p>No vaccinations recorded</p>
              <Button color="primary" onClick={onOpen} className="mt-4">
                Start New Vaccination
              </Button>
            </div>
          )}
          {!pet.vaccinations && (
            <Button color="primary" onClick={onOpen} className="mt-4">
              Add Vaccination
            </Button>
          )}
          <h2 className="text-xl font-bold mt-4 mb-2">Medical Records</h2>
          <Button
            color="primary"
            fullWidth={false}
            onClick={() =>
              router.push(`/dashboard/doctor/pets/${params.petId}/records/new`)
            } // Navigate to the new page
            // onClick={onMedicalRecordModalOpen}
            className="mt-4"
          >
            Add Records
          </Button>
          {pet.medicalRecords && pet.medicalRecords.length > 0 ? (
            <Table aria-label="Medical Records table">
              <TableHeader>
                <TableColumn>Date</TableColumn>
                <TableColumn>History</TableColumn>
                <TableColumn>Diagnosis</TableColumn>
                <TableColumn>Next Appointment</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {pet.medicalRecords.map((record) => (
                  <TableRow
                    onClick={() => console.log("row tappex")}
                    key={record.id}
                  >
                    <TableCell>{record.history}</TableCell>
                    <TableCell>{record.history}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    {/* <TableCell>{record.treatment}</TableCell> */}
                    <TableCell>
                      {new Date(record.nextAppointment).toLocaleDateString()}
                    </TableCell>
                    {/* <TableCell>{record.signature}</TableCell> */}
                    <TableCell>
                      <button
                        className=" ml-3 mr-7"
                        onClick={() => handleDeleteRecord(record.id)}
                      >
                        <MdDelete size={24} />{" "}
                      </button>
                      <button
                        className=" ml-3 mr-7"
                        onClick={() =>
                          navigateToMedicalRecordDetails(record.id)
                        }
                      >
                        <Chip>View More</Chip>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="mt-3 mb-3">No medical records found</p>
          )}

          {/* <h2 className="text-xl font-bold mt-4 mb-2">Medical Records</h2>
          {pet.medicalRecords && pet.medicalRecords.length > 0 ? (
            <ul>
              {pet.medicalRecords.map((record) => (
                <li key={record.id} className="mb-2">
                  <strong>History:</strong> {record.history} <br />
                  <strong>Diagnosis:</strong> {record.diagnosis} <br />
                  <strong>Treatment:</strong> {record.treatment} <br />
                  <strong>Next Appointment:</strong>{" "}
                  {new Date(record.nextAppointment).toLocaleDateString()} <br />
                  <strong>Signature:</strong> {record.signature}
                </li>
              ))}
            </ul>
          ) : (
            <p>No medical records found</p>
          )} */}

          <h2 className="text-xl font-bold mt-4 mb-2">Recent Appointments</h2>
          {pet.appointments && pet.appointments.length > 0 ? (
            <ul>
              {pet.appointments.map((app) => (
                <li key={app.id}>
                  {new Date(app.date).toLocaleDateString()} - {app.reason} (
                  {app.status})
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent appointments</p>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isVaccinationModalOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {pet.vaccinations && pet.vaccinations.length > 0
              ? "Add Vaccination"
              : "Start New Vaccination"}
          </ModalHeader>
          <ModalBody>
            <Input
              label="Vaccination Name"
              value={newVaccination.name}
              onChange={(e) =>
                setNewVaccination({ ...newVaccination, name: e.target.value })
              }
            />
            <Textarea
              label="Vaccination Notes"
              value={newVaccination.notes}
              onChange={(e) =>
                setNewVaccination({ ...newVaccination, notes: e.target.value })
              }
            />
            {/* <Input
              type="date"
              label="Vaccination Date"
              value={newVaccination.date}
              onChange={(e) =>
                setNewVaccination({ ...newVaccination, date: e.target.value })
              }
            /> */}
            <Input
              type="date"
              label="Next Vaccination Date"
              value={newVaccination.nextDate} // Ensure this is part of your state
              onChange={(e) =>
                setNewVaccination({
                  ...newVaccination,
                  nextDate: e.target.value,
                })
              }
            />

            {/* <Input
              type="date"
              label="Next Vaccination Date"
              value={newVaccination.nextDate} // Ensure this is part of your state
              onChange={(e) =>
                setNewVaccination({
                  ...newVaccination,
                  nextDate: e.target.value,
                })
              }
            /> */}
            <CldUploadWidget
              uploadPreset="pet_images" // Replace with your Cloudinary upload preset
              onSuccess={(result) => {
                const image_cloud = result as CloudinaryResult;
                const imageUrl = image_cloud.info.secure_url;

                setNewVaccination((prev) => ({ ...prev, imageUrl })); // Set the image URL in state
              }}
              onError={(error) => {
                console.error("Upload error:", error);
              }}
            >
              {({ open }) => (
                <Button
                  onPress={() => {
                    setNewVaccination((prev) => ({
                      ...prev,
                      imageUrl: "     ",
                    })); // Set the image URL in state

                    // open();
                    open();
                  }}
                  className="mt-4"
                >
                  Upload Vaccine Image
                </Button>
              )}
            </CldUploadWidget>
            {newVaccination.imageUrl && (
              <img
                src={newVaccination.imageUrl}
                alt="Vaccine"
                className="mt-4"
              /> // Display the uploaded image
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              isLoading={isFormLoading}
              onClick={handleAddVaccination}
            >
              {pet.vaccinations && pet.vaccinations.length > 0
                ? "Add Vaccinati    on"
                : "Start Vaccination"}
            </Button>
            <Button color="danger" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* <Modal
        isOpen={isMedicalRecordModalOpen}
        onClose={onMedicalRecordModalClose}
      >
        <ModalContent>
          <ModalHeader>Add Medical Record</ModalHeader>
          <ModalBody>
            <Input
              label="History/Complaint"
              value={newRecord.history}
              onChange={(e) =>
                setNewRecord({ ...newRecord, history: e.target.value })
              }
            />
            <Textarea
              label="Clinical Parameters"
              value={newRecord.clinicalParameters}
              onChange={(e) =>
                setNewRecord({
                  ...newRecord,
                  clinicalParameters: e.target.value,
                })
              }
            />
            <Textarea
              label="Diagnosis"
              value={newRecord.diagnosis}
              onChange={(e) =>
                setNewRecord({ ...newRecord, diagnosis: e.target.value })
              }
            />
            <Textarea
              label="Treatment"
              value={newRecord.treatment}
              onChange={(e) =>
                setNewRecord({ ...newRecord, treatment: e.target.value })
              }
            />
            <Textarea
              label="Recommendations"
              value={newRecord.recommendations}
              onChange={(e) =>
                setNewRecord({ ...newRecord, recommendations: e.target.value })
              }
            />
            <Input
              type="date"
              label="Next Appointment"
              value={newRecord.nextAppointment}
              onChange={(e) =>
                setNewRecord({ ...newRecord, nextAppointment: e.target.value })
              }
            />
            <SignaturePad
              onChange={(signature) =>
                setNewRecord({ ...newRecord, signature })
              }
            />
            {/* <Input
              label="Signature"
              value={newRecord.signature}
              onChange={(e) =>
                setNewRecord({ ...newRecord, signature: e.target.value })
              }
            /> */}
      {/* </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              isLoading={isFormLoading}
              onClick={handleAddRecord}
            >
              Add Record
            </Button>
            <Button color="danger" onClick={onMedicalRecordModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent> */}
      {/* </Modal> */}
    </div>
  );
};

export default PetDetails;
