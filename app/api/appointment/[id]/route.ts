import prisma from "@/prisma/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!appointment) {
    return NextResponse.json(
      { message: "Appointment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(appointment);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const { date, time, reason } = body;

  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: { date, time, reason },
  });

  return NextResponse.json(updatedAppointment);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await prisma.appointment.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Appointment deleted" }, { status: 204 });
}
