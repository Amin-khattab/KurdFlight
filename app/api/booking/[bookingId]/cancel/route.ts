import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "You must be signed in to cancel a booking." }, { status: 401 });
  }

  const { bookingId } = await params;

  if (!bookingId) {
    return NextResponse.json({ error: "Booking id is required." }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { bookingId },
  });

  if (!booking || booking.userId !== currentUser.id) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  const updatedBooking = await prisma.booking.update({
    where: { bookingId },
    data: {
      status: "cancelled",
    },
  });

  return NextResponse.json({
    success: true,
    booking: updatedBooking,
  });
}
