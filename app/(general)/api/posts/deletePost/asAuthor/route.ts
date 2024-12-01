import { NextResponse } from 'next/server';

import { lucia } from '@/app/(general)/lib/auth';
import { deletePostAsAuthor } from '@/app/(general)/lib/data';
import { logError } from '@/app/(general)/lib/utils';

export async function DELETE(req: Request) {

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

        try {
            const deletedPost = await deletePostAsAuthor({ userID: user.id, postID: postID });
            return NextResponse.json(deletedPost, { status: deletedPost?.status });
        } catch (error) {
            return NextResponse.json({ message: error }, { status: 500 });
        }
        
    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while deleting post, please check your request for errors."}, { status: 500 });
    }
}
