// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import React from "react";
// import Doctors from "./Form";

// export default async function DoctorsPage() {
//   const session = await getServerSession();
//   if (session) {
//     redirect("/dashboard/doctor");
//   }
//   return <Doctors />;
// }

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";
import Doctors from "./Form";
import { authOptions } from "../api/auth/[...nextauth]/auth";

export default async function DoctorsPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.role === "doctor") {
      redirect("/dashboard/doctor");
    } else {
      // If the user is authenticated but not a doctor, redirect to a different page
      redirect("/dashboard/owners"); // or wherever non-doctor users should go
    }
  }

  // If there's no session, render the Doctors form (presumably a login form)
  return <Doctors />;
}
