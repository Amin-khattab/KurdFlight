import { NextResponse } from "next/server";
import { mockFlights } from "@/lib/mock-flights";
import { error } from "node:console";

export async function GET(request:Request,
     {params} : {params : Promise<{id : string}>}) {
    
    const { id } = await params

    const flight = mockFlights.find((item) => item.id === id)

    if(!flight){
        return NextResponse.json(
            {error:"flight not found"},
            {status:404}
        )
    }

    return NextResponse.json({flight})

}