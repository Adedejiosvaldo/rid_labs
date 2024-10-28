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
  Input,
  Button,
} from "@nextui-org/react";
import Link from "next/link";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  owner: {
    name: string;
  };
}
const calculateAge = (dateOfBirth: string) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // Adjust for negative days or months
  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // Get last day of the previous month
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} years, ${months} months, ${days} days`; // Return a formatted string
};

const PetList: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchPets = async (searchTerm: string = "") => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/doctors/pets?search=${searchTerm}`);
      if (!response.ok) {
        throw new Error("Failed to fetch pets");
      }
      const data = await response.json();
      setPets(data);
    } catch (err) {
      setError("Failed to fetch pets. Please try again later.");
      console.error("Error fetching pets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleSearch = () => {
    fetchPets(search);
  };

  if (isLoading)
    return (
      <Spinner className="mb-3 mt-3" label="Loading Doctors Dashboard..." />
    );
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl text-left font-poppins font-bold mb-4">
        Pet List
      </h1>
      <div className="flex mb-4">
        <Input
          placeholder="Search pets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mr-2"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <Table aria-label="Pets table">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Species</TableColumn>
          <TableColumn>Breed</TableColumn>
          <TableColumn>Age</TableColumn>
          <TableColumn>Owner</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {pets.map((pet) => (
            <TableRow key={pet.id}>
              <TableCell>{pet.name}</TableCell>
              <TableCell>{pet.species}</TableCell>
              <TableCell>{pet.breed}</TableCell>
              <TableCell>{calculateAge(pet.age.toString())}</TableCell>
              <TableCell>{pet.owner.name}</TableCell>
              <TableCell>
                <Link href={`/dashboard/doctor/pets/${pet.id}`}>
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

export default PetList;
