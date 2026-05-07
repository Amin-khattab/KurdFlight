import { NextResponse } from "next/server";
import { mockFlights } from "@/lib/mock-flights";

export async function POST(request:Request) {
    const body = await request.json()

    const {flightId,fare,bag,seat,adults,children,infants} = body

    if(!flightId || !fare || !bag || !seat){
        return NextResponse.json(
            {error:"missing required quote fields"},
            {status:400}
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

    const basesubTotal =adultsubTotal + childrensubTotal + infantsubStotal

    let farecharge = 0

    if(fare === "standard"){
        farecharge = 25
    }else if(fare === "flex"){
        farecharge = 60
    }

    let farechargePerPerson = adults + children

    farecharge =  farecharge * farechargePerPerson

    let bagCharge = 0

    if(bag === "cabin-bag"){
        bagCharge = 18
    }else if(bag === "checked-bag"){
        bagCharge = 42
    }

    let bagChargePerPerson = adults + children

    bagCharge = bagCharge * bagChargePerPerson

    let seatcharge = 0

    if(seat === "standard-seat"){
        seatcharge = 14
    }else if(seat === "extra-legroom"){
        seatcharge = 36
    }

    let seatChargeperPerson = adults + children

    seatcharge = seatcharge * seatChargeperPerson

    const total = basesubTotal + farecharge + bagCharge + seatcharge

    return NextResponse.json({
        flightId,
        passengers:{
        adults,
        children,
        infants},
        pricing:{
        basePrise : flight.price,
        basesubTotal,
        fare,
        farecharge,
        bag,
        bagCharge,
        seat,
        seatcharge},
        total
    })
}