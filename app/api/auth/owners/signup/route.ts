// import { RegisterSchema } from "@/app/ValidationSchema";
// import prisma from "@/prisma/db";
// import { hash } from "bcrypt";
// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
// type IssueForm = z.infer<typeof RegisterSchema>;

// export async function POST(request: NextRequest) {
//   const body: IssueForm = await request.json();

//   const validator = RegisterSchema.safeParse(body);

//   if (!validator.success) {
//     return NextResponse.json(validator.error.errors, { status: 400 });
//   }

//   const { email, password, name, phoneNumber } = body;

//   const hashedPassword = await hash(password, 10);

//   const user = await prisma.petOwner.create({
//     data: {
//       phoneNumber,
//       email,
//       password: hashedPassword,
//       name,
//     },
//   });

//   return NextResponse.json(
//     { message: "Created Owner Sucessfully" },
//     { status: 201 }
//   );
// }



import { RegisterSchema } from "@/app/ValidationSchema";
import prisma from "@/prisma/db";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type IssueForm = z.infer<typeof RegisterSchema>;

const createUser = async (data: IssueForm) => {
  const hashedPassword = await hash(data.password, 10);
  return prisma.petOwner.create({
    data: {
      phoneNumber: data.phoneNumber,
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
    const validator = RegisterSchema.safeParse(body);

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
