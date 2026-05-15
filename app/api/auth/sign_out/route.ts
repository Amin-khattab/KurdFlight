import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (sessionToken) {
    await prisma.session.deleteMany({
      where: {
        token: sessionToken,
      },
    });
  }

  const response = NextResponse.json({
    success: true,
    message: "Signed out successfully",
  });

  response.cookies.set("session_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
