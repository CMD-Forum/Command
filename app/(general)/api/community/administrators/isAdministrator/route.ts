import { NextResponse } from 'next/server';

import { prisma } from '@/app/(general)/lib/db';
import { logError } from '@/app/(general)/lib/utils';

export async function POST( req: Request ) {

    try {

        if (!req.body) {
            return NextResponse.json({ message: "Request body is required." }, { status: 400 });
        }

        const body = await req.json();

        let { userID, communityID } = body;

        if (!communityID) {
            return NextResponse.json({ message: "CommunityID is required." }, { status: 400 })
        }

        const admin = await prisma.communityAdminship.findUnique({ 
            where: { 
                userId_communityId: { userId: userID, communityId: communityID } 
            },
            include: {
                user: {
                    select: {
                        username: true,
                        image: true,
                    }
                }
            }
        });

        if (!admin) {
            return NextResponse.json(false, { status: 200 })
        }

        return NextResponse.json(admin, { status: 200 })

    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while fetching community administrators."}, { status: 500 })
    }
}