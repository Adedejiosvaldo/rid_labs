import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

interface Vaccination {
  id: string;
  name: string;
  date: string;
}

interface VaccinationProps {
  petId: string;
}

export default function Vaccination({ petId }: VaccinationProps) {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVaccinations();
  }, [petId]);

  const fetchVaccinations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/pets/${petId}/vaccinations`);
      if (!response.ok) throw new Error("Failed to fetch vaccinations");
      const data = await response.json();
      setVaccinations(data);
    } catch (error) {
      console.error("Error fetching vaccinations:", error);
      setError("Failed to load vaccinations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  //   if (isLoading) return <p>Loading vaccinations...</p>;
  //   if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="space-y-4">
      {vaccinations.length > 0 ? (
        <Table aria-label="Vaccinations table">
          <TableHeader>
            <TableColumn>Vaccine Name</TableColumn>
            <TableColumn>Date</TableColumn>
          </TableHeader>
          <TableBody>
            {vaccinations.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {new Date(item.date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        ) : (
            <p className="text-left font-poppins">
            No vaccination records found.
          </p>
      )}
    </div>
  );
}
