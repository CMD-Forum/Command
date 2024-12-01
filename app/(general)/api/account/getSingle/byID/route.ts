import { NextResponse } from 'next/server';

import { prisma } from '@/app/(general)/lib/db';
import { logError } from '@/app/(general)/lib/utils';

export async function POST(req: Request) {
    try {

        if ( ! req.body) {
            return NextResponse.json({ message: "Request body is required." }, { status: 400 });
        }

        const body = await req.json();
        const { userID } = body;

        /*if ( userId !== String ) {
            return NextResponse.json({ message: "UserID must be a string."})
        }*/

        const UserDetails = await prisma.user.findUnique({
            where: {
                id: userID,
            },
            omit: {
                password_hash: true,
                email: true,
            }
        });

        if ( UserDetails ) {
            return NextResponse.json(UserDetails, { status: 201 });
        } else if ( ! UserDetails ) {
            return NextResponse.json({ message: "User was not found." }, { status: 404 });
        }

    } catch(error) {
        logError(error);
        return NextResponse.json({ message: "Internal Server Error, check your formatting and that all required fields are present."}, { status: 500 });
    }
}
