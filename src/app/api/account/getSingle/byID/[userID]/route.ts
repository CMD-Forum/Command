import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { legacy_logError } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: Promise<{ userID: string }> }) {
    try {
        const { userID } = await params;
        const UserDetails = await db.user.findUnique({
            where: {
                id: userID,
            },
            omit: {
                password_hash: true,
                email: true,
            }
        });

        if (UserDetails) {
            return NextResponse.json(UserDetails, { status: 200 });
        } else if (!UserDetails) {
            return NextResponse.json({ message: "User was not found." }, { status: 404 });
        }

    } catch(error) {
        legacy_logError(error);
        return NextResponse.json({ message: "An error occurred, check your formatting and that all required fields are present."}, { status: 500 });
    }
}
