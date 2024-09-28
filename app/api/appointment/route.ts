import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const appointments = await prisma.appointment.findMany();
  return NextResponse.json(appointments);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { date, time, reason, doctorId, petOwnerId } = body;

  const appointment = await prisma.appointment.create({
    data: { date, time, reason, doctorId, petOwnerId },
  });

  return NextResponse.json(appointment, { status: 201 });
}
