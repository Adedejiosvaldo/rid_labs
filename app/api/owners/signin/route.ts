import LoginSchema from "@/app/ValidationSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validator = LoginSchema.safeParse(body);

  if (!validator.success) {
    return NextResponse.json(validator.error.errors, { status: 400 });
  }

  return NextResponse.json({ message: "Registered" }, { status: 200 }); 
}
