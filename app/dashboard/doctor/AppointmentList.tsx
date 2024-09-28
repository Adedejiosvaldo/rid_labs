"use client";

import { useEffect, useState } from "react";
import AppointmentForm from "@/components/AppointmentForm";

// Define the Appointment type
type Appointment = {
  id: number;
  date: string;
  time: string;
  doctorId: number;
  patientId: number;
  // Add other relevant fields
};

const AppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]); // Specify the correct type
  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      setAppointments(data);
    };
    fetchAppointments();
  }, []);

  const handleCreate = async (appointment: any) => {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    });
    const newAppointment = await res.json();
    setAppointments((prev: any[]) => [...prev, newAppointment]);
  };

  const handleUpdate = async (appointment: Appointment) => {
    // if (editingAppointment?.id) {
    //   const res = await fetch(`/api/appointments/${editingAppointment.id}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(appointment),
    //   });
    //   const updatedAppointment = await res.json();
    //   setAppointments((prev: any) =>
    //     prev.map((appt: any) =>
    //       appt.id === updatedAppointment.id ? updatedAppointment : appt
    //     )
    //   );
    //   setEditingAppointment(null);
  };

  const handleDelete = async (id: any) => {
    await fetch(`/api/appointments/${id}`, {
      method: "DELETE",
    });
    setAppointments((prev) => prev.filter((appt: any) => appt.id !== id));
  };

  return (
    <div>
      <h2>Upcoming Appointments</h2>
      <AppointmentForm
        onSubmit={editingAppointment ? handleUpdate : handleCreate}
        appointment={editingAppointment}
      />
      <ul>
        {appointments.map((appointment: any) => (
          <li key={appointment.id}>
            {appointment.date} - {appointment.reason}
            <button onClick={() => setEditingAppointment(appointment)}>
              Edit
            </button>
            <button onClick={() => handleDelete(appointment.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default AppointmentList;
