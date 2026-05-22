import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request:Request) {

    const user = await getCurrentUser()

    if(!user){
        return NextResponse.json(
            {error:"user was not found"},
            {status:401}
        )
    }
    
    const body = await request.json()
    const { name , email } = body

    if(!email || typeof email !== "string"){
        return NextResponse.json(
            { error: "Email is required." },
            { status: 400 }
        )
    }

    if(!name || typeof name !== "string" || name.trim().length < 2){
        return NextResponse.json(
            {error:"name must be at least 3 chars long"},
            {status:400}
        )
    }

    const normalizedEmail = email.trim().toLowerCase()

    if(!normalizedEmail.includes("@")){
        return NextResponse.json(
            {error:"enter a valid email."},
            {status:400}
        )
    }

    const existingUser = await prisma.user.findFirst({
        where:{
            email:{
                equals: normalizedEmail,
                mode:"insensitive"
            },
        },
    })

    if(existingUser && existingUser.id !== user.id){
        return NextResponse.json(
            {error:"email is alrdeay in use"},
            {status:409}
        )
    }

     const updatedUser = await prisma.user.update({
        where:{
            id : user.id
        },
        data:{
            name : name.trim(),
            email:normalizedEmail
        }
    })

    return NextResponse.json({
        message:"updated the profile",
        user:{
            id:updatedUser.id,
            name:updatedUser.name,
            email:updatedUser.email
        }
    })

}