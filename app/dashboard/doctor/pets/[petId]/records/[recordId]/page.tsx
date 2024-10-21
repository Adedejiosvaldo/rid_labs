// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import {
//   Button,
//   Input,
//   Card,
//   Text,
//   Spinner,
//   CardBody,
// } from "@nextui-org/react";
// import { toast } from "react-toastify";

// // types.ts (or directly in your component file)
// export interface MedicalRecord {
//   id: string;
//   history: string;
//   clinicalParameters: string;
//   diagnosis: string;
//   treatment: string;
//   recommendations: string;
//   nextAppointment: Date;
//   signature: string;
//   petId: string; // Include petId if needed
// }

// const MedicalRecordDetail = () => {
//   const router = useRouter();
//   const { petId, recordId } = router.query; // Get both petId and recordId from the query
//   const [record, setRecord] = useState<MedicalRecord | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     const fetchRecord = async () => {
//       if (!petId || !recordId) return; // Ensure both IDs are available
//       try {
//         const response = await fetch(`/api/pets/${petId}/records/${recordId}`);
//         if (!response.ok) throw new Error("Failed to fetch medical record");
//         const data: MedicalRecord = await response.json();
//         setRecord(data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecord();
//   }, [petId, recordId]);
//   const handleEdit = async () => {
//     if (!record) return; // Ensure record is available
//     try {
//       const response = await fetch(`/api/pets/${petId}/records/${recordId}`, {
//         method: "PATCH", // Use PATCH for updating
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(record),
//       });

//       if (!response.ok) throw new Error("Failed to update medical record");
//       toast.success("Medical record updated successfully");
//       setIsEditing(false);
//     } catch (err: any) {
//       toast.error(err.message);
//     }
//   };

//   if (loading) return <Spinner />;
//   if (error) return <Text color="error">{error}</Text>;

//   return (
//     <Card>
//       <CardBody>
//         <Text h2>Medical Record Details</Text>
//         {isEditing ? (
//           <>
//             <Input
//               label="History"
//               value={record?.history || ""} // Provide a default value to avoid uncontrolled input
//               onChange={(e) =>
//                 setRecord((prev) => {
//                   if (prev) {
//                     // Check if prev is not null
//                     return {
//                       ...prev, // Spread the previous state
//                       history: e.target.value, // Update the history field correctly
//                     };
//                   }
//                   return null; // Return null if prev is null
//                 })
//               }
//             />

//             <Input
//               label="Diagnosis"
//               value={record.diagnosis}
//               onChange={(e) =>
//                 setRecord({ ...record, diagnosis: e.target.value })
//               }
//             />
//             <Input
//               label="Treatment"
//               value={record.treatment}
//               onChange={(e) =>
//                 setRecord({ ...record, treatment: e.target.value })
//               }
//             />
//             <Input
//               label="Next Appointment"
//               type="date"
//               value={new Date(record.nextAppointment)
//                 .toISOString()
//                 .substring(0, 10)}
//               onChange={(e) =>
//                 setRecord({
//                   ...record,
//                   nextAppointment: new Date(e.target.value),
//                 })
//               }
//             />
//             <Input
//               label="Signature"
//               value={record.signature}
//               onChange={(e) =>
//                 setRecord({ ...record, signature: e.target.value })
//               }
//             />
//             <Button onClick={handleEdit}>Save Changes</Button>
//             <Button onClick={() => setIsEditing(false)} color="error">
//               Cancel
//             </Button>
//           </>
//         ) : (
//           <>
//             <Text>
//               <strong>History:</strong> {record.history}
//             </Text>
//             <Text>
//               <strong>Diagnosis:</strong> {record.diagnosis}
//             </Text>
//             <Text>
//               <strong>Treatment:</strong> {record.treatment}
//             </Text>
//             <Text>
//               <strong>Next Appointment:</strong>{" "}
//               {new Date(record.nextAppointment).toLocaleDateString()}
//             </Text>
//             <Text>
//               <strong>Signature:</strong> {record.signature}
//             </Text>
//             <Button onClick={() => setIsEditing(true)}>Edit</Button>
//           </>
//         )}
//       </CardBody>
//     </Card>
//   );
// };

// export default MedicalRecordDetail;

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Input,
  Card,
  Spinner,
  CardBody,
  Textarea,
} from "@nextui-org/react";

import { toast } from "react-toastify";
import { useParams } from "next/navigation";

// Define the MedicalRecord interface
export interface MedicalRecord {
  id: string;
  history: string;
  clinicalParameters: string;
  diagnosis: string;
  treatment: string;
  recommendations: string;
  nextAppointment: Date;
  signature: string;
  petId: string; // Include petId if needed
}

const MedicalRecordDetail = () => {
  const router = useRouter();

  const params = useParams();
    
  const { petId, recordId } = params; // Get both petId and recordId from the query
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedFields, setUpdatedFields] = useState<Partial<MedicalRecord>>(
    {}
  );

  useEffect(() => {
    const fetchRecord = async () => {
      if (!petId || !recordId) return; // Ensure both IDs are available
      try {
        const response = await fetch(`/api/pets/${petId}/records/${recordId}`);
        if (!response.ok) throw new Error("Failed to fetch medical record");
        const data: MedicalRecord = await response.json();
        setRecord(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [petId, recordId]);

  const handleEditToggle = () => {
    if (isEditing) {
      // If we're exiting edit mode, reset updatedFields
      setUpdatedFields({});
    } else {
      // If we're entering edit mode, initialize updatedFields with current record data
      setUpdatedFields({
        history: record?.history,
        clinicalParameters: record?.clinicalParameters,
        diagnosis: record?.diagnosis,
        treatment: record?.treatment,
        recommendations: record?.recommendations,
        nextAppointment: record?.nextAppointment,
        signature: record?.signature,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!record) return; // Ensure record is available
    try {
      const response = await fetch(`/api/pets/${petId}/records/${recordId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) throw new Error("Failed to update medical record");
      const updatedRecord = await response.json();
      setRecord(updatedRecord);
      setIsEditing(false);
      setUpdatedFields({});
      toast.success("Medical record updated successfully!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p color="error">{error}</p>;

  return (
    <Card>
      <CardBody>
        <h2>Medical Record Details</h2>
        {isEditing ? (
          <>
            <Input
              label="History"
              name="history"
              value={updatedFields.history || ""}
              onChange={handleInputChange}
            />
            <Textarea
              label="Diagnosis"
              name="diagnosis"
              value={updatedFields.diagnosis || ""}
              onChange={handleInputChange}
            />
            <Textarea
              label="Treatment"
              name="treatment"
              value={updatedFields.treatment || ""}
              onChange={handleInputChange}
            />
            <Input
              label="Next Appointment"
              type="date"
              name="nextAppointment"
              value={
                updatedFields.nextAppointment
                  ? new Date(updatedFields.nextAppointment)
                      .toISOString()
                      .substring(0, 10)
                  : ""
              }
              onChange={(e) =>
                setUpdatedFields({
                  ...updatedFields,
                  nextAppointment: new Date(e.target.value),
                })
              }
            />
            <Input
              label="Signature"
              name="signature"
              value={updatedFields.signature || ""}
              onChange={handleInputChange}
            />
            <Button onClick={handleSave}>Save Changes</Button>
            <Button onClick={handleEditToggle}>Cancel</Button>
          </>
        ) : (
          <>
            <p>
              <strong>History:</strong> {record?.history}
            </p>
            <p>
              <strong>Diagnosis:</strong> {record?.diagnosis}
            </p>
            <p>
              <strong>Treatment:</strong> {record?.treatment}
            </p>
            <p>
              <strong>Next Appointment:</strong>{" "}
              {new Date(record!.nextAppointment).toLocaleDateString()}
            </p>
            <p>
              <strong>Signature:</strong> {record?.signature}
            </p>
            <Button onClick={handleEditToggle}>Edit</Button>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default MedicalRecordDetail;
