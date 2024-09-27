import { RegisterSchemaDoctors } from "@/app/ValidationSchema";
import prisma from "@/prisma/db";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type IssueForm = z.infer<typeof RegisterSchemaDoctors>;

const createUser = async (data: IssueForm) => {
  const hashedPassword = await hash(data.password, 10);
  return prisma.doctor.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  });
};

const handleValidationErrors = (errors: z.ZodError) => {
  return NextResponse.json(errors.errors, { status: 400 });
};

export async function POST(request: NextRequest) {
  try {
    const body: IssueForm = await request.json();
    const validator = RegisterSchemaDoctors.safeParse(body);

    if (!validator.success) {
      return handleValidationErrors(validator.error);
    }

    await createUser(body);

    return NextResponse.json(
      { message: "Created Owner Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating owner:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
