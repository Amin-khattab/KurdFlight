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

export async function GET(request:Request,
  { params } : {params : Promise <{bookingId:string}>}
) {
  
  const {bookingId} = await params

  if(!bookingId){
    return NextResponse.json(
      {error:"there is no Bookings by this id"},
      {status:404}
    )
  }

  const theBookingId = await prisma.booking.findUnique({
    where:{
      bookingId
    }
  })

  if(!theBookingId){
    return NextResponse.json(
      {error:"booking Not Found"},
      {status:404}
    )
  }

  return NextResponse.json(
    {booking : theBookingId}
  )
}