import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const { bookingId } = await params;

  if (!bookingId) {
    return NextResponse.json({ error: "Booking id is required" }, { status: 400 });
  }

  const existingBooking = await prisma.booking.findUnique({
    where: { bookingId },
  });

  if (!existingBooking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  await prisma.booking.delete({
    where: { bookingId },
  });

  return NextResponse.json({ success: true, bookingId });
}
