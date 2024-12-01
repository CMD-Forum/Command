import { NextResponse } from 'next/server';

import { prisma } from '@/app/(general)/lib/db';

export async function POST( req: Request ) {

    try {

        if ( ! req.body) {

            return NextResponse.json({ message: "Request body is required." }, { status: 400 });

        }

        const body = await req.json();

        let { communityID } = body;

        if ( ! communityID ) {

            return NextResponse.json({ message: "CommunityID is required." }, { status: 400 })

        }

        const community = await prisma.community.findUnique({

            where: {

                id: communityID

            }
            
        });        

        if ( ! community ) {
            return NextResponse.json({ message: "Community not found."}, { status: 404 })
        }
              
        return NextResponse.json(community, { status: 200 })

    } catch (error) {

        console.error(error);
        return NextResponse.json({ message: "Error occurred while fetching community."}, { status: 500 })

    }
}