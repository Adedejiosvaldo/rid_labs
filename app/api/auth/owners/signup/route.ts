import { RegisterSchema } from "@/app/ValidationSchema";
import prisma from "@/prisma/db";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
type IssueForm = z.infer<typeof RegisterSchema>;

export async function POST(request: NextRequest) {
  const body: IssueForm = await request.json();

  const validator = RegisterSchema.safeParse(body);

  if (!validator.success) {
    return NextResponse.json(validator.error.errors, { status: 400 });
  }

  const { email, password, name, phoneNumber } = body;

  const hashedPassword = await hash(password, 10);

  const user = await prisma.petOwner.create({
    data: {
      phoneNumber,
      email,
      password: hashedPassword,
      name,
    },
  });

  return NextResponse.json(
    { message: "Created Owner Sucessfully" },
    { status: 201 }
  );
}
