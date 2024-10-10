import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    status: string;
    notes?: string;
  };
  onUpdate: (id: string, status: string, notes: string) => void;
  loading: boolean;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onUpdate,
  loading,
}) => {
  const [status, setStatus] = useState(appointment.status);
  const [notes, setNotes] = useState(appointment.notes || "");

  const handleSubmit = () => {
    onUpdate(appointment.id, status, notes);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Edit Appointment</ModalHeader>
        <ModalBody>
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <SelectItem key="upcoming" value="upcoming">
              Upcoming
            </SelectItem>
            <SelectItem key="ended" value="ended">
              Ended
            </SelectItem>
            <SelectItem key="no-show" value="no-show">
              No Show
            </SelectItem>
          </Select>
          <Input
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes here..."
            multiple
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit} isLoading={loading}>
            Update
          </Button>
          <Button color="danger" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAppointmentModal;
