"use client"; // Ensure this is a client component

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Spinner,
} from "@nextui-org/react";
import { toast, ToastContainer } from "react-toastify";
import SignaturePad from "@/components/SignaturePad";

const AddMedicalRecord: React.FC = () => {
  const router = useRouter();
  const params = useParams();

  const { petId } = params; // Get petId from the query
  const [newRecord, setNewRecord] = useState({
    history: "",
    clinicalParameters: "",
    diagnosis: "",
    treatment: "",
    recommendations: "",
    nextAppointment: "",
    signature: "",
  });
  const [isFormLoading, setIsFormLoading] = useState(false);

  const handleCancel = () => {
    // Redirect back to the pet details page without saving
    setNewRecord({
      history: "",
      clinicalParameters: "",
      diagnosis: "",
      treatment: "",
      recommendations: "",
      nextAppointment: "",
      signature: "",
    });
    router.push(`/dashboard/doctor/pets/${petId}`);
  };

  const handleAddRecord = async () => {
    setIsFormLoading(true);
    try {
      const response = await fetch(`/api/pets/${petId}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newRecord,
          petId: petId, // Ensure petId is correctly set
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add medical record");
      }

      toast.success("Medical record added successfully");
      router.push(`/dashboard/doctor/pets/${petId}`); // Redirect back to the pet details page
    } catch (err: any) {
      console.error("Error adding medical record:", err);
      toast.error(err.message || "Failed to add medical record");
    } finally {
      setIsFormLoading(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <h2 className="mt-3 mb-3 text-center font-bold font-poppings text-2xl">
          Add Medical Record
        </h2>
        <Input
          label="History/Complaint"
          value={newRecord.history}
          className="mt-3"
          onChange={(e) =>
            setNewRecord({ ...newRecord, history: e.target.value })
          }
        />
        <Textarea
          label="Clinical Parameters"
          value={newRecord.clinicalParameters}
          className="mt-3"
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
          className="mt-3"
          onChange={(e) =>
            setNewRecord({ ...newRecord, diagnosis: e.target.value })
          }
        />
        <Textarea
          label="Treatment"
          className="mt-3"
          value={newRecord.treatment}
          onChange={(e) =>
            setNewRecord({ ...newRecord, treatment: e.target.value })
          }
        />
        <Textarea
          label="Recommendations"
          value={newRecord.recommendations}
          className="mt-3"
          onChange={(e) =>
            setNewRecord({ ...newRecord, recommendations: e.target.value })
          }
        />
        <Input
          type="date"
          label="Next Appointment"
          className="mt-3"
          placeholder="Pick date for the next appointment"
          value={newRecord.nextAppointment}
          onChange={(e) =>
            setNewRecord({ ...newRecord, nextAppointment: e.target.value })
          }
        />

        <SignaturePad
          onChange={(signature) => setNewRecord({ ...newRecord, signature })}
        />

        {/* Include SignaturePad or Input for signature if needed */}

        <div className="flex flex-row w-full justify-evenly items-center">
          <Button
            className="w-1/2 mr-2" // Make the button take half the width and add some right margin
            color="primary"
            isLoading={isFormLoading}
            onClick={handleAddRecord}
          >
            Add Record
          </Button>
          <Button
            className="w-1/2 ml-2" // Make the button take half the width and add some left margin
            color="danger"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
        {/* <div className="flex flex-row  w-full justify-evenly items-center">
          <Button
            color="primary"
            isLoading={isFormLoading}
            onClick={handleAddRecord}
          >
            Add Record
          </Button>
          <Button
            className="mt-3"
            color="danger"
            onClick={handleCancel}
            style={{ marginLeft: "0" }} // Optional styling for spacing
          >
            Cancel
          </Button>
        </div> */}
      </CardBody>
      <ToastContainer />
    </Card>
  );
};

export default AddMedicalRecord;
