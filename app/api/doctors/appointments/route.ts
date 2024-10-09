import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

const APPOINTMENT_DURATION = 30; // minutes
const WORK_START_TIME = 9 * 60; // 9:00 AM in minutes
const WORK_END_TIME = 17 * 60; // 5:00 PM in minutes

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const dateStr = searchParams.get("date");

//   if (!dateStr) {
//     return NextResponse.json({ error: "Date is required" }, { status: 400 });
//   }

//   const date = new Date(dateStr);
//   date.setHours(0, 0, 0, 0); // Set to start of day

//   try {
//     // Fetch existing appointments for the given date
//     const existingAppointments = await prisma.appointment.findMany({
//       where: {
//         date: {
//           gte: date,
//           lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Next day
//         },
//       },
//       select: { time: true },
//     });

//     // Generate all possible time slots
//     const allTimeSlots = generateTimeSlots();

//     // Filter out booked time slots
//     const availableTimes = allTimeSlots.filter(
//       (time) =>
//         !existingAppointments.some(
//           (apt: { time: Date }) => apt.time.toDateString() === time
//         )
//     );

//     return NextResponse.json(availableTimes);
//   } catch (error) {
//     console.error("Error fetching available times:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch available times" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");

  if (!dateStr) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0); // Set to start of day

  try {
    // Fetch existing appointments for the given date across all pets
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: date,
          lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Next day
        },
      },
      select: { time: true },
    });

    // Generate all possible time slots
    const allTimeSlots = generateTimeSlots();

    // Filter out booked time slots
    const availableTimes = allTimeSlots.filter(
      (time) =>
        !existingAppointments.some(
          (apt) => apt.time.toTimeString().slice(0, 5) === time
        )
    );

    return NextResponse.json(availableTimes);
  } catch (error) {
    console.error("Error fetching available times:", error);
    return NextResponse.json(
      { error: "Failed to fetch available times" },
      { status: 500 }
    );
  }
}
function generateTimeSlots(): string[] {
  const slots = [];
  for (
    let minutes = WORK_START_TIME;
    minutes < WORK_END_TIME;
    minutes += APPOINTMENT_DURATION
  ) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    slots.push(
      `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
    );
  }
  return slots;
}
