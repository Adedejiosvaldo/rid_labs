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
  Button,
} from "@nextui-org/react";
import Link from "next/link";

interface Vaccination {
  id: string;
  name: string;
  date: string;
  status: string;
  pet: {
    name: string;
    owner: {
      name: string;
    };
  };
}

const VaccinationList: React.FC = () => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        const response = await fetch("/api/vaccinations");
        if (!response.ok) {
          throw new Error("Failed to fetch vaccinations");
        }
        const data = await response.json();

        const formattedVaccinations = data.map((vac: Vaccination) => ({
          ...vac,
          date: new Date(vac.date).toLocaleDateString(),
        }));

        setVaccinations(formattedVaccinations);
      } catch (err) {
        setError("Failed to fetch vaccinations. Please try again later.");
        console.error("Error fetching vaccinations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaccinations();
  }, []);

  if (isLoading) return <Spinner label="Loading vaccinations..." />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Vaccinations</h1>
      <Table aria-label="Vaccinations table">
        <TableHeader>
          <TableColumn>Date</TableColumn>
          <TableColumn>Vaccination</TableColumn>
          <TableColumn>Pet</TableColumn>
          <TableColumn>Owner</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {vaccinations.map((vaccination) => (
            <TableRow key={vaccination.id}>
              <TableCell>{vaccination.date}</TableCell>
              <TableCell>{vaccination.name}</TableCell>
              <TableCell>{vaccination.pet.name}</TableCell>
              <TableCell>{vaccination.pet.owner.name}</TableCell>
              <TableCell>
                <Chip
                  color={
                    vaccination.status === "upcoming" ? "primary" : "success"
                  }
                >
                  {vaccination.status}
                </Chip>
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/doctor/vaccinations/${vaccination.id}`}>
                  <Button size="sm">View Details</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VaccinationList;
