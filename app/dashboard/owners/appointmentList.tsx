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
} from "@nextui-org/react";
import { Chip } from "@nextui-org/react";

interface Appointment {
  id: string;
  date: string;
  petName: string;
  reason: string;
  time: string;
  status: "upcoming" | "today" | "ended";
}

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/pets/appointments");
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();

        const formattedAppointments = data.map((apt: Appointment) => ({
          ...apt,
          date: new Date(apt.date).toLocaleDateString(),
          time: new Date(apt.date).toLocaleTimeString([], {
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

    fetchAppointments();
  }, []);

  if (isLoading) return <Spinner label="Loading appointments..." />;
  if (error) return <div className="text-red-600">{error}</div>;

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500";
      case "today":
        return "bg-green-500";
      case "ended":
        return "bg-gray-500";
      default:
        return "";
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl text-left font-poppins font-bold mb-4">
        Your Appointments
      </h1>
      <Table aria-label="Appointments table">
        <TableHeader>
          <TableColumn>Date</TableColumn>
          <TableColumn>Time</TableColumn>
          <TableColumn>Pet Name</TableColumn>
          <TableColumn>Reason</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.date}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell>{appointment.petName}</TableCell>
              <TableCell>{appointment.reason}</TableCell>
              <TableCell>
                <Chip className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Chip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppointmentList;
