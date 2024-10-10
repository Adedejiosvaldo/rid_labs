"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, Image, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  imageUrl: string;
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const router = useRouter();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("/api/pets");
        if (!response.ok) {
          throw new Error("Failed to fetch pets");
        }
        const data = await response.json();
        console.log(data);
        setPets(data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPets();
  }, []);

  // Function to determine which RoboHash set to use based on species
  const getSetForSpecies = (species: string) => {
    switch (species.toLowerCase()) {
      case "dog":
        return 1; // Robot set
      case "cat":
        return 2; // Monster set
      case "bird":
        return 3; // Robot head set
      case "fish":
        return 4; // Kitten set
      default:
        return 5; // Random set
    }
  };

  const getRoboHashImage = (name: string, species: string) => {
    const set = getSetForSpecies(species);
    return `https://robohash.org/${name}${species}?set=set${set}&size=150x150`;
  };

  const handlePetClick = (petId: string) => {
    router.push(`/dashboard/owners/pets/${petId}`);
  };

  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      {loading
        ? // Show skeletons while loading
          Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} shadow="sm">
              <CardBody className="overflow-visible p-0">
                <Skeleton className="w-full h-[140px]" />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <Skeleton className="w-1/2" />
                <Skeleton className="w-1/4" />
              </CardFooter>
            </Card>
          ))
        : // Render pets once loaded
          pets.map((pet) => (
            <Card
              shadow="sm"
              key={pet.id}
              isPressable
              onPress={() => handlePetClick(pet.id)}
            >
              <CardBody className="overflow-visible p-0">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={pet.name}
                  className="w-full object-cover h-[140px]"
                  src={pet.imageUrl || getRoboHashImage(pet.name, pet.species)}
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b className="font-poppins font-bold text-md">{pet.name}</b>
                <p className="text-default-400 font-poppins font-medium">
                  {pet.species.charAt(0).toUpperCase() +
                    pet.species.slice(1).toLowerCase()}
                </p>
              </CardFooter>
            </Card>
          ))}
    </div>
  );
}
