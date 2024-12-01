import { NextResponse } from 'next/server'

import { lucia } from '@/app/(general)/lib/auth';
import { prisma } from '@/app/(general)/lib/db';
import { logError } from '@/app/(general)/lib/utils';

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
        let { page } = body;

        if ( !page || page === null || page === "" ) {
            return NextResponse.json({ message: "Page is required." }, { status: 400 })
        }

        const savedPostArray = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                savedPosts: true,
            },
        })

        logError(savedPostArray);

        if ( savedPostArray && savedPostArray.savedPosts.length !== 0 ) {
            const savedPosts = await prisma.post.findMany({
                skip: page * 10,
                take: 10,
                where: {
                    id: {
                        in: savedPostArray.savedPosts,
                    },
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            createdAt: true,
                            updatedAt: true,
                            image: true,
                            description: true,
                        },
                    },
                    community: {
                        select: {
                            id: true,
                            name: true,
                            display_name: true,
                            image: true,
                            public: true,
                        },
                    },
                },
            })

            let postCount = 0;
            for (let i = 0; i < savedPostArray.savedPosts.length; i++) {
                if (savedPostArray.savedPosts[i]) postCount++;
            }

            

            return NextResponse.json({ savedPosts, postCount }, { status: 200 } )   
        }

    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while fetching saved posts, please check your request for errors."}, { status: 500 });
    }

}
