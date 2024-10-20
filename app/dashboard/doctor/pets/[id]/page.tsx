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
} from "@nextui-org/react";

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

// interface MedicalRecord {
//   id: string;
//   history: string;
//   clinicalParameters: string;
//   diagnosis: string;
//   treatment: string;
//   recommendations: string;
//   nextAppointment: string; // or Date if you want to store it as a Date object
//   signature: string;
// }
// interface Pet {
//   id: string;
//   name: string;
//   species: string;
//   breed: string;
//   age: number;
//   imageUrl?: string;
//   description?: string;
//   owner?: {
//     name: string;
//     phoneNumber: string;
//     email: string;
//   };
//   vaccinations: Array<{
//     id: string;
//     name: string;
//     date: string;
//     status: string;
//   }>;
//   appointments: Array<{
//     id: string;
//     date: string;
//     reason: string;
//     status: string;
//   }>;
//   medicalRecords?: MedicalRecord[];
// }

const PetDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newVaccination, setNewVaccination] = useState({ name: "", date: "" });
  const [newRecord, setNewRecord] = useState({
    history: "",
    clinicalParameters: "",
    diagnosis: "",
    treatment: "",
    recommendations: "",
    nextAppointment: "",
    signature: "",
  });

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await fetch(`/api/pets/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch pet details");
        }
        const data = await response.json();
        setPet(data);

        // Fetch medical records
        const recordsResponse = await fetch(`/api/pets/${params.id}/records`);
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

    // const fetchPetDetails = async () => {
    //   try {
    //     const response = await fetch(`/api/pets/${params.id}`);
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch pet details");
    //     }
    //     const data = await response.json();
    //     setPet(data);

    //     // Fetch medical records
    //     const recordsResponse = await fetch(`/api/pets/${params.id}/records`);
    //     if (!recordsResponse.ok) {
    //       throw new Error("Failed to fetch medical records");
    //     }
    //     const recordsData: any = await recordsResponse.json(); // Ensure the records are typed

    //     setPet((prevPet) => ({
    //       ...(prevPet || { medicalRecords: [] }), // Initialize medicalRecords if prevPet is null
    //       medicalRecords: recordsData, // Update medical records
    //     }));
    //   } catch (err) {
    //     setError("Failed to fetch pet details. Please try again later.");
    //     console.error("Error fetching pet details:", err);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    if (params.id) {
      fetchPetDetails();
    }
  }, [params.id]);

  const handleAddVaccination = async () => {
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
          status: "upcoming",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add vaccination");
      }

      //   // Refresh pet details
      //   const updatedPetResponse = await fetch(`/api/pets/${params.id}`);
      //   const updatedPetData = await updatedPetResponse.json();
      //   setPet(updatedPetData);

      onClose();
    } catch (err) {
      console.error("Error adding vaccination:", err);
      setError("Failed to add vaccination. Please try again.");
    }
  };

  const handleAddRecord = async () => {
    try {
      const response = await fetch(`/api/pets/${pet?.id}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newRecord, // This should include your new record data
          petId: pet?.id, // Ensure you're including the petId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add medical record");
      }

      // Refresh pet details
      const updatedPetResponse = await fetch(`/api/pets/${params.id}`);
      const updatedPetData = await updatedPetResponse.json();
      setPet(updatedPetData);

      onClose();
      setNewRecord({
        history: "",
        clinicalParameters: "",
        diagnosis: "",
        treatment: "",
        recommendations: "",
        nextAppointment: "",
        signature: "",
      });
    } catch (err) {
      console.error("Error adding medical record:", err);
      setError("Failed to add medical record. Please try again.");
    }
  };

  const navigateToVaccinationDetails = (vaccinationId: string) => {
    router.push(`/dashboard/doctor/vaccinations/${vaccinationId}`);
  };

  if (isLoading) return <Spinner label="Loading pet details..." />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!pet) return <div>No pet found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pet Details: {pet.name}</h1>
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
            <strong>Age:</strong> {pet.age}
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
              <Button color="primary" onClick={onOpen} className="mt-4">
                Add Vaccination
              </Button>
            </div>
          ) : (
            <div>
              <p>No vaccinations recorded</p>
              <Button color="primary" onClick={onOpen} className="mt-4">
                Start New Vaccination
              </Button>
            </div>
          )}
          <h2 className="text-xl font-bold mt-4 mb-2">Medical Records</h2>
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
          )}
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

      <Modal isOpen={isOpen} onClose={onClose}>
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
            <Input
              type="date"
              label="Vaccination Date"
              value={newVaccination.date}
              onChange={(e) =>
                setNewVaccination({ ...newVaccination, date: e.target.value })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleAddVaccination}>
              {pet.vaccinations && pet.vaccinations.length > 0
                ? "Add Vaccination"
                : "Start Vaccination"}
            </Button>
            <Button color="danger" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose}>
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
            <Input
              label="Clinical Parameters"
              value={newRecord.clinicalParameters}
              onChange={(e) =>
                setNewRecord({
                  ...newRecord,
                  clinicalParameters: e.target.value,
                })
              }
            />
            <Input
              label="Diagnosis"
              value={newRecord.diagnosis}
              onChange={(e) =>
                setNewRecord({ ...newRecord, diagnosis: e.target.value })
              }
            />
            <Input
              label="Treatment"
              value={newRecord.treatment}
              onChange={(e) =>
                setNewRecord({ ...newRecord, treatment: e.target.value })
              }
            />
            <Input
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
            <Input
              label="Signature"
              value={newRecord.signature}
              onChange={(e) =>
                setNewRecord({ ...newRecord, signature: e.target.value })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleAddRecord}>
              Add Record
            </Button>
            <Button color="danger" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PetDetails;
