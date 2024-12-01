import { NextResponse } from 'next/server'

import { lucia } from '@/app/(general)/lib/auth';
import { prisma } from '@/app/(general)/lib/db';

export async function POST( req: Request ) {

    try {

        const authorizationHeader = req.headers.get("Authorization");
        const sessionId = lucia.readBearerToken(authorizationHeader ?? "");

        if ( ! sessionId ) {
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
        let { postID } = body;

        const dbUser = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
        })

        if ( dbUser ) {
            // @ts-ignore
            const postAlreadySaved = dbUser.savedPosts.map(post => post.trim()).includes(postID.trim());

            if ( postAlreadySaved ) {
                return NextResponse.json({ message: "Post is saved." }, { status: 201 })
            }            
        }
        
        return NextResponse.json({ message: "Post is not saved." }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error occurred."}, { status: 500 });
    }

}
