// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || !session.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const ownerId = session.user.id;

//     const appointments = await prisma.appointment.findMany({
//       where: {
//         pet: {
//           ownerId: ownerId,
//         },
//       },
//       include: {
//         pet: {
//           select: {
//             name: true,
//           },
//         },
//       },
//       orderBy: {
//         date: "asc",
//       },
//     });

//     const formattedAppointments = appointments.map((apt) => ({
//       id: apt.id,
//       date: apt.date.toISOString(),
//       time: apt.time,
//       petName: apt.pet.name,
//       reason: apt.reason,
//     }));

//     return NextResponse.json(formattedAppointments);
//   } catch (error) {
//     console.error("Failed to fetch appointments:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch appointments" },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/auth";
import prisma from "@/prisma/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerId = session.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await prisma.appointment.findMany({
      where: {
        pet: {
          ownerId: ownerId,
        },
      },
      include: {
        pet: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const formattedAppointments = appointments.map((apt) => {
      const appointmentDate = new Date(apt.date);
      appointmentDate.setHours(0, 0, 0, 0);

      let status: "upcoming" | "today" | "ended";
      if (appointmentDate.getTime() === today.getTime()) {
        status = "today";
      } else if (appointmentDate > today) {
        status = "upcoming";
      } else {
        status = "ended";
      }

      return {
        id: apt.id,
        date: apt.date.toISOString(),
        petName: apt.pet.name,
        reason: apt.reason,
        status: apt.status,
      };
    });

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
