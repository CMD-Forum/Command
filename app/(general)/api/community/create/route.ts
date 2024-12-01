import { NextResponse } from 'next/server';

import { lucia } from '@/app/(general)/lib/auth';
import { prisma } from '@/app/(general)/lib/db';
import { CreateCommunitySchema } from '@/app/(general)/lib/schemas';

export async function POST(req: Request) {

    try {

        const authorizationHeader = req.headers.get("Authorization");
        const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

        if ( ! sessionId) {
            return new NextResponse(null, {
                status: 401
            });
        }   
        
        const { user } = await lucia.validateSession(sessionId);

        if ( ! user?.id ) {
            return new NextResponse(null, {
                status: 401
            });
        }

        const body = await req.json();
        const { name, short_description, image_url } = CreateCommunitySchema.parse(body);

        const CommunityNameExists = await prisma.community.findUnique({
            where: { name: name }
        });

        const CommunityDisplayNameExists = await prisma.community.findUnique({
            where: { display_name: name }
        });

        if ( CommunityNameExists || CommunityDisplayNameExists ) {
            return NextResponse.json({ community: null, message: "Community with this name already exists."}, { status: 400 })
        }

        const newCommunity = await prisma.community.create({
            data: {
                name: name.toLowerCase(),
                display_name: name,
                description: short_description,
                image: image_url,
            }
        });

        await prisma.communityAdminship.create({
            data: {
                userId: user.id,
                communityId: newCommunity.id,
            },
        });

        return NextResponse.json({ community: newCommunity, message: "Community has been created."}, { status: 201 })

    } catch(error) {
        console.error(error);
        return NextResponse.json({ message: "An error occurred while creating the community."}, { status: 500 });
    }

}
