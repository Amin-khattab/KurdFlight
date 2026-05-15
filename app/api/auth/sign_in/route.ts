import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

export async function POST(request: Request) {
  const data = await request.json();

  const email = String(data?.email ?? "").trim().toLowerCase();
  const password = String(data?.password ?? "");

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!existingUser) {
    return NextResponse.json({ error: "This email does not exist." }, { status: 400 });
  }

  const correctPassword = await bcrypt.compare(password, existingUser.hashedPassword);

  if (!correctPassword) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 400 });
  }

  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await prisma.session.create({
    data: {
      token: sessionToken,
      userId: existingUser.id,
      expiresAt,
    },
  });

  const response = NextResponse.json({
    user: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    },
  });

  response.cookies.set("session_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return response;
}
