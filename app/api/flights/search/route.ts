import { NextResponse } from "next/server";
import { mockFlights } from "@/lib/mock-flights";
import { mockAirports } from "@/lib/mock-airports";

function findAirportsByCode(code : string | null){
    return mockAirports.find((airport) => airport.code === code)
}

function resolveAirportCodes(code : string | null){
    const selected = findAirportsByCode(code)

    if(!selected){
        return [];
    }

    if(selected.type === "city"){
        return mockAirports.filter(
            (airport) => airport.city === selected.city).map(
                (airport) => airport.code
            )
    }
    return[selected.code]
}

export async function GET(request:Request){
    const url = new URL(request.url)
    
    const from = url.searchParams.get("from")
    const to = url.searchParams.get("to")
    const departure = url.searchParams.get("departure")
    const returnDate = url.searchParams.get("return")
    const adults = Number(url.searchParams.get("adults") ?? "1")
    const children = Number(url.searchParams.get("children") ?? "0")
    const infants = Number(url.searchParams.get("infants") ?? "0")
    const cabin = url.searchParams.get("cabin") ?? "economy"

    if(!from||!to||!departure){
        return NextResponse.json(
            {"error":"some required iputs are not here"},
            {status:400}
            
        )
    }

    const originCodes = resolveAirportCodes(from)
    const destinationCodes = resolveAirportCodes(to)

    const matchingFlights = mockFlights.filter((flight) =>{
        return originCodes.includes(flight.origin) && destinationCodes.includes(flight.destination)
    })

    const fallbackFlights = mockFlights.filter(
        (flight) => destinationCodes.includes(flight.destination)
    ).slice(0,4)

    const results = matchingFlights.length > 0 ? matchingFlights : fallbackFlights
    
    return NextResponse.json({
        search:{from,
        to,
        departure,
        returnDate,
        adults,
        children,
        infants,
        cabin
    },
    results,
    total:results.length,
    })
}