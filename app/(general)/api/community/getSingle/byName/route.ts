import { NextResponse } from 'next/server';

import { prisma } from '@/app/(general)/lib/db';

export async function POST( req: Request ) {

    try {

        if ( ! req.body) {
            return NextResponse.json({ message: "Request body is required." }, { status: 400 });
        }

        const body = await req.json();
        let { communityName } = body;

        if ( ! communityName ) {
            return NextResponse.json({ message: "CommunityName is required." }, { status: 400 })
        }

        const community = await prisma.community.findUnique({
            where: {
                name: communityName
            }
        });        

        if ( ! community ) {
            return NextResponse.json({ message: "Community not found."}, { status: 404 })
        }

        if ( community.public === false ) {
            return NextResponse.json({ message: "Community is private."}, { status: 401 })
        }
              
        return NextResponse.json(community, { status: 200 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error occurred while fetching community."}, { status: 500 })
    }
}