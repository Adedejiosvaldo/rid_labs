"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

export default function UserWelcome() {
  const { data: session } = useSession();
  const { theme } = useTheme();

  if (!session || !session.user) {
    return null; // Or a loading state
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const textColor = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const dividerColor = theme === "dark" ? "border-gray-700" : "border-gray-200";

  return (
    <div className="py-4">
      <h1 className={`text-2xl font-medium ${textColor}`}>
        {getGreeting()},{" "}
        <span className="font-semibold">{session.user.name || "Friend"}</span>
      </h1>
      <div className={`my-4 border-b ${dividerColor}`}></div>
    </div>
  );
}
