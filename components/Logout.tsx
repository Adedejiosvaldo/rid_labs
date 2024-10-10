"use client";
import { signOut } from "next-auth/react";
import { Button } from "@nextui-org/react";

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button color="danger" variant="flat" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
