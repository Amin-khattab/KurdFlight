import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

export async function POST(request: Request) {
  const body = await request.json();

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");
  const confirmPassword = String(body?.confirmPassword ?? "");

  if (!name || !email || !password) {
    return NextResponse.json({ error: "One or more required fields are missing." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Password and confirm password must match." }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return NextResponse.json({ error: "This email is already in use. Try another one." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await prisma.session.create({
    data: {
      token: sessionToken,
      userId: user.id,
      expiresAt,
    },
  });

  const response = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
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
