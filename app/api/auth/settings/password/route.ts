import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.json(
            { error: "must be logged in to use this faeture" },
            { status: 401 }
        );
    }

    const response = await request.json();
    const { currentPassword, newPassword } = response;

    if (!currentPassword || typeof currentPassword !== "string") {
        return NextResponse.json(
            { error: "Current password is required." },
            { status: 400 }
        );
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
        return NextResponse.json(
            { error: "New password must be at least 8 characters long." },
            { status: 400 }
        );
    }

    const dbUser = await prisma.user.findUnique({
        where: {
            id: currentUser.id,
        },
    });

    if (!dbUser) {
        return NextResponse.json(
            { error: "user doesnt exist" },
            { status: 404 }
        );
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, dbUser.hashedPassword);

    if (!isPasswordCorrect) {
        return NextResponse.json(
            { error: "current password is incorrect" },
            { status: 400 }
        );
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: {
            id: currentUser.id,
        },
        data: {
            hashedPassword: newHashedPassword,
        },
    });

    return NextResponse.json({
        message: "password changes successfully.",
    });
}
