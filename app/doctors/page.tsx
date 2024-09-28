import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import Doctors from "./Form";

export default async function DoctorsPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard/doctor");
  }
  return <Doctors />;
}
