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
  daysUntil: number; // Change to number for better type safety
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
    // const fetchVaccinations = async () => {
    //   try {
    //     const response = await fetch("/api/vaccinations");
    //     if (!response.ok) {
    //       throw new Error("Failed to fetch vaccinations");
    //     }
    //     const data = await response.json();

    //     const formattedVaccinations = data.map((vac: Vaccination) => ({
    //       ...vac,
    //       date: new Date(vac.date).toLocaleDateString(),
    //     }));

    //     setVaccinations(formattedVaccinations);
    //   } catch (err) {
    //     setError("Failed to fetch vaccinations. Please try again later.");
    //     console.error("Error fetching vaccinations:", err);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    const fetchVaccinations = async () => {
      try {
        const response = await fetch("/api/vaccinations");
        if (!response.ok) {
          throw new Error("Failed to fetch vaccinations");
        }
        const data = await response.json();

        const today = new Date();
        const formattedVaccinations = data
          .map((vac: Vaccination) => ({
            ...vac,
            date: new Date(vac.date),
          }))
          .filter((vac: any) => vac.date > today && vac.status === "upcoming") // Filter for upcoming vaccinations
          .map((vac: any) => ({
            ...vac,
            date: vac.date.toLocaleDateString(),
            daysUntil: Math.ceil(
              (vac.date.getTime() - today.getTime()) / (1000 * 3600 * 24)
            ), // Calculate days until vaccination
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
      <h1 className="text-2xl text-left font-poppins font-bold mb-4">
        Upcoming Vaccinations
      </h1>
      <Table aria-label="Vaccinations table">
        <TableHeader>
          <TableColumn>Date</TableColumn>
          <TableColumn>Vaccination</TableColumn>
          <TableColumn>Pet</TableColumn>
          <TableColumn>Days Until</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {vaccinations.map((vaccination) => (
            <TableRow key={vaccination.id}>
              <TableCell>{vaccination.date}</TableCell>
              <TableCell>{vaccination.name}</TableCell>
              <TableCell>{vaccination.pet.name}</TableCell>
              <TableCell>{vaccination.daysUntil} days</TableCell>
              {/* Display days until vaccination */}
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
