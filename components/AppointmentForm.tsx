import { useEffect, useState } from "react";

const AppointmentForm = ({ onSubmit, appointment }: any) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (appointment) {
      setDate(appointment.date);
      setTime(appointment.time);
      setReason(appointment.reason);
    }
  }, [appointment]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit({ date, time, reason });
    setDate("");
    setTime("");
    setReason("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason"
        required
      />
      <button type="submit">
        {appointment ? "Update Appointment" : "Schedule Appointment"}
      </button>
    </form>
  );
};

export default AppointmentForm;
