import { NextResponse } from "next/server";
import { mockFlights } from "@/lib/mock-flights";

export async function POST(request:Request) {
    const body = await request.json()

    const {flightId,fare,bag,seat} = body
    const adults = Number(body.adults ?? 0)
    const children = Number(body.children ?? 0)
    const infants = Number(body.infants ?? 0)

    if(!flightId || !fare || !bag || !seat){
        return NextResponse.json(
            {error:"missing required quote fields"},
            {status:400}
        )
    }

    if (Number.isNaN(adults) || Number.isNaN(children) || Number.isNaN(infants) || adults < 1) {
        return NextResponse.json(
            { error: "Passenger counts are invalid" },
            { status: 400 }
        )
    }

    const flight = mockFlights.find((item) => item.id === flightId)
    
    if(!flight){
        return NextResponse.json(
            {error:"flight not found"},
            {status:404}
        )
    }

    const adultsubTotal = flight.price * adults
    const childrensubTotal = flight.price * children
    const infantsubStotal = 0

    const baseSubTotal =adultsubTotal + childrensubTotal + infantsubStotal

    let fareSubTotal = 0

    if(fare === "standard"){
        fareSubTotal = 25
    }else if(fare === "flex"){
        fareSubTotal = 60
    }

    let farechargePerPerson = adults + children

    fareSubTotal =  fareSubTotal * farechargePerPerson

    let bagSubTotal = 0

    if(bag === "cabin-bag"){
        bagSubTotal = 18
    }else if(bag === "checked-bag"){
        bagSubTotal = 42
    }

    let bagChargePerPerson = adults + children

    bagSubTotal = bagSubTotal * bagChargePerPerson

    let seatSubTotal = 0

    if(seat === "standard-seat"){
        seatSubTotal = 14
    }else if(seat === "extra-legroom"){
        seatSubTotal = 36
    }

    let seatChargeperPerson = adults + children

    seatSubTotal = seatSubTotal * seatChargeperPerson

    const total = baseSubTotal + fareSubTotal + bagSubTotal + seatSubTotal

    return NextResponse.json({
        flightId,
        passengers:{
        adults,
        children,
        infants,
        chargeable: adults + children},
        pricing:{
        basePrice : flight.price,
        baseSubtotal : baseSubTotal,
        fareSubtotal : fareSubTotal,
        bagSubtotal : bagSubTotal,
        seatSubtotal : seatSubTotal,
        total},
    })
}
