"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
  Chip,
  Card,
  CardBody,
  Button,
} from "@nextui-org/react";
import EditAppointmentModal from "./EditModal";

interface Appointment {
  id: string;
  date: string;
  petName: string;
  reason: string;
  time: string;
  status: "upcoming" | "ended" | "no-show";
  notes?: string;
  petOwner: {
    name: string;
    email: string;
  };
  pet: {
    name: string;
    species: string;
  };
}

const DoctorAppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointment");
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();

      const formattedAppointments = data.map((apt: Appointment) => ({
        ...apt,
        date: new Date(apt.date).toLocaleDateString(),
        time: new Date(apt.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      setAppointments(formattedAppointments);
    } catch (err) {
      setError("Failed to fetch appointments. Please try again later.");
      console.error("Error fetching appointments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (appointment: Appointment) => {
    if (appointment.status !== "ended") {
      setSelectedAppointment(appointment);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateAppointment = async (
    id: string,
    status: string,
    notes: string
  ) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/appointment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, notes }),
      });

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      await fetchAppointments();
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError("Failed to update appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Spinner label="Loading appointments..." />;
  if (error) return <div className="text-red-600">{error}</div>;

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500";
      case "ended":
        return "bg-green-500";
      case "no-show":
        return "bg-red-500";
      default:
        return "";
    }
  };

  const renderEditButton = (appointment: Appointment) => {
    if (appointment.status === "ended") {
      return (
        <Button size="sm" disabled>
          Ended
        </Button>
      );
    }
    return (
      <Button size="sm" onClick={() => handleEditClick(appointment)}>
        Edit
      </Button>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl text-left font-poppins font-bold mb-4">
        Doctor's Appointments
      </h1>
      <div className="hidden md:block">
        <Table aria-label="Doctor's appointments table">
          <TableHeader>
            <TableColumn>Date</TableColumn>
            <TableColumn>Time</TableColumn>
            <TableColumn>Pet Name</TableColumn>
            <TableColumn>Owner Name</TableColumn>
            <TableColumn>Reason</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.pet.name}</TableCell>
                <TableCell>{appointment.petOwner.name}</TableCell>
                <TableCell>{appointment.reason}</TableCell>
                <TableCell>
                  <Chip className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  {/* <Button
                    size="sm"
                    onClick={() => handleEditClick(appointment)}
                  >
                    Edit
                  </Button> */}
                  {renderEditButton(appointment)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="md:hidden space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id}>
            <CardBody>
              <p>
                <strong>Date:</strong> {appointment.date}
              </p>
              <p>
                <strong>Time:</strong> {appointment.time}
              </p>
              <p>
                <strong>Pet:</strong> {appointment.pet.name}
              </p>
              <p>
                <strong>Owner:</strong> {appointment.petOwner.name}
              </p>
              <p>
                <strong>Reason:</strong> {appointment.reason}
              </p>

              <strong>Status:</strong>
              <Chip className={`${getStatusColor(appointment.status)} ml-2`}>
                {appointment.status}
              </Chip>
              {renderEditButton(appointment)}
              {/* <Button size="sm" onClick={() => handleEditClick(appointment)}>
                Edit
              </Button> */}
            </CardBody>
          </Card>
        ))}
      </div>
      {selectedAppointment && (
        <EditAppointmentModal
          loading={loading}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          appointment={selectedAppointment}
          onUpdate={handleUpdateAppointment}
        />
      )}
    </div>
  );
};

export default DoctorAppointmentList;
