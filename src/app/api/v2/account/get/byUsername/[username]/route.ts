import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { APIResponse } from "@/lib/types/api";
import { legacy_logError } from "@/lib/utils";
import { UserRole } from "@prisma/client";

export interface GetAccountByUsernameResponse {
    username: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    image: string | null;
    public: boolean;
    github_id: number | null;
    emailVerified: Date | null;
    emailLastUpdate: Date | null;
    usernameLastUpdate: Date | null;
    role: UserRole;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }): Promise<NextResponse<APIResponse<GetAccountByUsernameResponse>>> {
    try {
        const { username } = await params;

        const USER_DETAILS = await db.user.findUnique({
            where: {
                username: username,
            },
            omit: {
                password_hash: true,
                email: true,
            }
        });

        if (USER_DETAILS?.public === false) return NextResponse.json({ data: null, error: "This profile is private." }, { status: 403 });
        if (USER_DETAILS) return NextResponse.json({ data: USER_DETAILS, error: null }, { status: 200 });

        return NextResponse.json({ data: null, error: "User was not found." }, { status: 404 });
    } catch(error) {
        legacy_logError(error);
        return NextResponse.json({ data: null, error: "Something went wrong, please try again later."}, { status: 500 });
    }
}
