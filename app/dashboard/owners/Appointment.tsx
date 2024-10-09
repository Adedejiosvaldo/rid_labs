"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  useDisclosure,
  Select,
  SelectItem,
  Card,
  CardBody,
  TableColumn,
  TableHeader,
  TableBody,
  Table,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";
import {
  today,
  getLocalTimeZone,
  parseDate,
  DateValue,
} from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { toast, ToastContainer } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, isValid, parseISO } from "date-fns";
import { isBefore } from "date-fns";

interface Appointment {
  id: string;
  reason: string;
  date: Date;
  time: string;
  appointmentStatus: string;
}

interface PetAppointmentsProps {
  petId: string;
  petOwnerId: string;
}

const appointmentSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  date: z.string(),
  time: z.string(),
});

type AppointmentInput = z.infer<typeof appointmentSchema>;

const PetAppointments: React.FC<PetAppointmentsProps> = ({
  petId,
  petOwnerId,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateValue>(
    today(getLocalTimeZone())
  );

  const { locale } = useLocale();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    fetchAppointments();
  }, [petId]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`/api/pets/${petId}/appointments`);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    }
  };

  const isDateUnavailable = (date: DateValue) => {
    const currentDate = date.toDate(getLocalTimeZone());
    return appointments.some(
      (apt) => currentDate.toDateString() === new Date(apt.date).toDateString()
    );
  };

  const fetchAvailableTimes = async (date: DateValue) => {
    try {
      const dateString = date.toString();

      const response = await fetch(
        `/api/doctors/appointments?date=${dateString}`
      );
      if (!response.ok) throw new Error("Failed to fetch available times");
      const times = await response.json();

      console.log("All times:", times);
      const bookedTimes = appointments
        .filter((apt) => {
          const aptDate = new Date(apt.date);
          return aptDate.toISOString().split("T")[0] === dateString;
        })
        .map((apt) => {
          const aptTime = new Date(apt.time);
          return `${aptTime.getHours().toString().padStart(2, "0")}:${aptTime
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
        });
      console.log("Booked times:", bookedTimes);

      const availableTimes = times.filter(
        (time: string) => !bookedTimes.includes(time)
      );
      console.log("Available times:", availableTimes);
      setAvailableTimes(availableTimes);
    } catch (error) {
      console.error("Error fetching available times:", error);
      toast.error("Failed to load available times");
    }
  };

  const handleDateSelect = (date: DateValue) => {
    setSelectedDate(date);
    setValue("date", date.toString());
    fetchAvailableTimes(date);
  };

  const handleCreateAppointmentClick = () => {
    setSelectedDate(today(getLocalTimeZone()));
    // fetchAvailableTimes(today(getLocalTimeZone()));
    onOpen();
  };

  const handleCreateAppointment = async (data: AppointmentInput) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/pets/${petId}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          petOwnerId: petOwnerId, // Add this line
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create appointment");
      }

      await fetchAppointments();
      onOpenChange();
      reset();
      toast.success("Appointment created successfully");
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentStatus = (date: string, time: string) => {
    const appointmentDate = parseISO(`${date}T${time}`);
    const now = new Date();
    return isBefore(appointmentDate, now) ? "Completed" : "Upcoming";
  };

  //   function renderCell(item: Appointment, key: keyof Appointment) {
  //     const value = item[key];
  //     if (value instanceof Date) {
  //       return value.toLocaleString();
  //     }
  //     return String(value);
  //   }

  function renderCell(item: Appointment, key: keyof Appointment) {
    const value = item[key];
    if (value === undefined) return "-";

    if (key === "date") {
      try {
        const date = parseISO(value as string);
        if (isValid(date)) {
          return format(date, "MMMM d, yyyy");
        }
      } catch (error) {
        console.error("Invalid date:", value);
      }
      return String(value); // Fallback to original value if parsing fails
    }
    if (key === "time") {
      try {
        const dateTime = parseISO(value as string);
        if (isValid(dateTime)) {
          return format(dateTime, "h:mm a");
        }
      } catch (error) {
        console.error("Invalid time:", value);
      }
      return String(value);
    }

    return String(value);
  }
  const StatusChip = ({ status }: { status: string }) => {
    const color = status === "Completed" ? "success" : "primary";
    return <Chip color={color}>{status}</Chip>;
  };
  return (
    <div className="space-y-4">
      <Button
        color="primary"
        onPress={handleCreateAppointmentClick}
        className="mb-2 mt-2"
      >
        Book An Appointment
      </Button>

      <Table aria-label="Appointments table">
        <TableHeader>
          <TableColumn>Date</TableColumn>
          <TableColumn>Time</TableColumn>
          <TableColumn>Reason</TableColumn>
          <TableColumn>Status</TableColumn>
        </TableHeader>
        <TableBody>
          {appointments.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{renderCell(item, "date")}</TableCell>
              <TableCell>{renderCell(item, "time")}</TableCell>
              <TableCell>{renderCell(item, "reason")}</TableCell>
              <TableCell>
                <StatusChip
                  status={getAppointmentStatus(
                    item.date.toString(),
                    item.time.toString()
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          onOpenChange();
          if (!open) reset();
        }}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(handleCreateAppointment)}>
              <ModalHeader className="flex flex-col gap-1">
                Create New Appointment
              </ModalHeader>
              <ModalBody>
                <Textarea
                  {...register("reason")}
                  label="Reason for Visit"
                  placeholder="Enter reason for the appointment"
                  isInvalid={Boolean(errors.reason)}
                  errorMessage={errors.reason?.message}
                />
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      aria-label="Select Date"
                      value={selectedDate}
                      onChange={(date) => {
                        handleDateSelect(date);
                        field.onChange(date.toString());
                      }}
                    />
                  )}
                />
                <Controller
                  name="time"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Available Times"
                      placeholder="Select an available time"
                      isInvalid={Boolean(errors.time)}
                      errorMessage={errors.time?.message}
                    >
                      {availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={loading}>
                  Create Appointment
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PetAppointments;
