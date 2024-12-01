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

        const postAlreadySaved = await prisma.user.findUnique({
            where: {
                id: user.id,
                savedPosts: {
                    has: postID,
                }
            },
        })

        if ( postAlreadySaved ) {
            return NextResponse.json({ message: "Post is already saved." }, { status: 400 })
        }

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                savedPosts: {
                    push: postID,
                },
            },
        });

        return NextResponse.json({ message: "Successfully saved post." }, { status: 201 });

    } catch (error) {

        console.error(error);
        return NextResponse.json({ message: "Error occurred while creating post, please check your request for errors."}, { status: 500 });

    }

}
