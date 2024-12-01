import { NextResponse } from 'next/server';

import { prisma } from '@/app/(general)/lib/db';
import { logError } from '@/app/(general)/lib/utils';

export async function POST( req: Request ) {

    try {

        if (!req.body) {
            return NextResponse.json({ message: "Request body is required." }, { status: 400 });
        }

        const body = await req.json();

        let { communityID } = body;

        if (!communityID) {
            return NextResponse.json({ message: "CommunityID is required." }, { status: 400 })
        }

        const admins = await prisma.communityAdminship.findMany({ 
            where: { 
                communityId: communityID 
            },
            include: {
                user: {
                    select: {
                        username: true,
                        image: true,
                        adminships: true,
                    },
                },
            },
        });


        if (!admins || admins === null) {
            return NextResponse.json({ message: "This community has no administrators."}, { status: 404 })
        }
              
        return NextResponse.json(admins, { status: 200 })

    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while fetching community administrators."}, { status: 500 })
    }
}