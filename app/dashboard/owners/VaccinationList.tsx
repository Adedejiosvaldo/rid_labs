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
  Divider,
} from "@nextui-org/react";

interface Vaccination {
  id: string;
  name: string;
  date: string;
  petName: string;
  isUpcoming: boolean;
}

const VaccinationList: React.FC = () => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        const response = await fetch("/api/pets/vaccinations");
        if (!response.ok) {
          throw new Error("Failed to fetch vaccinations");
        }
        const data = await response.json();

        const currentDate = new Date();
        const formattedVaccinations = data.map((vac: Vaccination) => {
          const vacDate = new Date(vac.date);
          return {
            ...vac,
            date: vacDate.toLocaleDateString(),
            isUpcoming: vacDate > currentDate,
          };
        });

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

  const upcomingVaccinations = vaccinations.filter((vac) => vac.isUpcoming);
  const pastVaccinations = vaccinations.filter((vac) => !vac.isUpcoming);

  return (
    <div className="p-4 space-y-8">
      <section>
        <h1 className="text-2xl text-left font-poppins font-bold mb-4">
          Upcoming Vaccinations
        </h1>
        {upcomingVaccinations.length > 0 ? (
          <Table aria-label="Upcoming vaccinations table">
            <TableHeader>
              <TableColumn>Pet Name</TableColumn>
              <TableColumn>Vaccine Name</TableColumn>
              <TableColumn>Date</TableColumn>
            </TableHeader>
            <TableBody>
              {upcomingVaccinations.map((vaccination) => (
                <TableRow key={vaccination.id}>
                  <TableCell>{vaccination.petName}</TableCell>
                  <TableCell>{vaccination.name}</TableCell>
                  <TableCell>
                    <Chip color="warning">{vaccination.date}</Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-left font-poppins">
            No upcoming vaccinations scheduled.
          </p>
        )}
      </section>
      <Divider className="my-4" />

      <section>
        <h1 className="text-2xl text-left font-poppins font-bold mb-4">
          Vaccination History
        </h1>
        {pastVaccinations.length > 0 ? (
          <Table aria-label="Vaccination history table">
            <TableHeader>
              <TableColumn>Pet Name</TableColumn>
              <TableColumn>Vaccine Name</TableColumn>
              <TableColumn>Date</TableColumn>
            </TableHeader>
            <TableBody>
              {pastVaccinations.map((vaccination) => (
                <TableRow key={vaccination.id}>
                  <TableCell>{vaccination.petName}</TableCell>
                  <TableCell>{vaccination.name}</TableCell>
                  <TableCell>{vaccination.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-left font-poppins font-medium">
            No vaccination history available.
          </p>
        )}
      </section>
    </div>
  );
};

export default VaccinationList;
