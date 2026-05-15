import { mockFlights } from "@/lib/mock-flights";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request : Request) {

    const currentUser = await getCurrentUser()

    if(!currentUser){
        return NextResponse.json(
            {error:"your not Logged in. "},
            {status:401}
        )
    }

    const body = await request.json()

    const bookingId = `BK-${Date.now()}`
    const status = "confirmed"
    const createdAt = new Date().toISOString()

    const {outboundFlightId,returnFlightId,tripType,passengers,cabin,selections,total} = body

    if(!outboundFlightId  ||!tripType || !passengers || !cabin || !selections || total == null){
        return NextResponse.json(
            {error:"Missing required booking fields"},
            {status:400}
        )
    }

    if(tripType !== "one-way" && tripType !== "round-trip"){
        return NextResponse.json(
            {error:"tripType must be 'one-way' or 'round-trip'"},
            {status:400}
        )
    }
        const adults = passengers.adults
        const children = passengers.children
        const infants = passengers.infants

        if(adults < 1 || infants === undefined || children === undefined){
            return NextResponse.json(
                {error:"Passengers are invalid or incomplete"},
                {status:400}
            )
        }

        let outboundFlight = null
        let returnFlight = null


    if(tripType === "round-trip"){

        const outbound = mockFlights.find((flight) => flight.id === outboundFlightId)
        const back = mockFlights.find((flight) => flight.id === returnFlightId)

        outboundFlight = outbound ?? null
        returnFlight = back ?? null

        if(!outboundFlight || !returnFlight){
            return NextResponse.json(
                {error:"Outbound or return flight was not found"},
                {status:404}
            )
        }

        const selection_out = selections.outbound
        const selection_back = selections.return 

        if(!selection_out || !selection_back){
            return NextResponse.json(
                {error:"Missing outbound or return selections"},
                {status:400}
            )
        }

        //back
        const selection_bag_back = selection_back.bag
        const selection_fare_back = selection_back.fare
        const selection_seat_back = selection_back.seat
        //out
        const selection_bag_out = selection_out.bag
        const selection_fare_out = selection_out.fare
        const selection_seat_out = selection_out.seat

        if(!selection_bag_back || !selection_fare_back || !selection_seat_back ||
            !selection_bag_out || !selection_fare_out || !selection_seat_out){
            return NextResponse.json(
                {error:"Missing fare, bag, or seat selection for one or more trip legs"},
                {status:400}
            )
            }
    }else if (tripType === "one-way"){

        const outbound = mockFlights.find((flight) => flight.id === outboundFlightId)

        if(!outbound){
            return NextResponse.json(
                {error:"Outbound flight was not found"},
                {status:404}
            )
        }

        outboundFlight = outbound ?? null

        const selection_out = selections.outbound

        if(!selection_out){
            return NextResponse.json(
                {error:"Missing outbound selections"},
                {status:400}
            )
        }

        const selection_bag_out = selection_out.bag
        const selection_fare_out = selection_out.fare
        const selection_seat_out = selection_out.seat

        
        if(!selection_bag_out || !selection_fare_out || !selection_seat_out){
            return NextResponse.json(
                {error:"Missing outbound fare, bag, or seat selection"},
                {status:400}
            )
        }
    }

    await prisma.booking.create({
        data: {
            bookingId,
            status,
            tripType,
            outboundFlightId,
            returnFlightId,
            passengers,
            cabin,
            selections,
            total: Number(total),
            user: {
                connect: {
                    id: currentUser.id,
                },
            },
        }
    })

    return NextResponse.json({
        bookingId,
        status,
        createdAt,
        outboundFlight,
        returnFlight,
        outboundFlightId,
        returnFlightId,
        tripType,
        passengers,
        cabin,
        selections,
        total: Number(total),
    })
    
}
