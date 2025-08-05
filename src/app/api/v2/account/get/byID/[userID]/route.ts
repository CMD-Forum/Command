import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { ErrorResponse } from "@/lib/types/api";
import { legacy_logError } from "@/lib/utils";

export type GetAccountByIDResponse = {
    response: {
        id: string;
        github_id: number | null;
        emailVerified: Date | null;
        username: string | null;
        usernameLastUpdate: Date | null;
        description: string,
        createdAt: Date;
        updatedAt: Date;
        profile_image: string;
        image: string | null;
        name: string | null;
        public: boolean;
    }
    
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ userID: string }> }): Promise<NextResponse<GetAccountByIDResponse | ErrorResponse>> {
    try {   
        const { userID } = await params;

        const USER_DETAILS = await db.user.findUnique({
            where: {
                id: userID,
            },
            omit: {
                password_hash: true,
                email: true,
                emailLastUpdate: true
            }
        });

        if (USER_DETAILS?.public === false) return NextResponse.json({ data: null, error: "This profile is private." }, { status: 403 });
        if (USER_DETAILS) return NextResponse.json({ response: USER_DETAILS, error: null }, { status: 200 });

        return NextResponse.json({ response: null, error: "User was not found." }, { status: 404 });
    } catch(error) {
        legacy_logError(error);
        return NextResponse.json({ response: null, error: "Something went wrong, please try again later."}, { status: 500 });
    }
}
