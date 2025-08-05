import { NextResponse } from "next/server";
//import xss from "xss";

//import { lucia } from "@/app/(general)/lib/auth";
//import { prisma } from "@/app/(general)/lib/db";
//import { logError } from "@/app/(general)/lib/utils";

export async function POST(/*req: Request*/) {

    return NextResponse.json({ message: "This API is deprecated. Use /narkdown, /image or /link instead." }, { status: 308 });

    /*try {

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

        let { title, content, communityId, tagline, image, imagealt, href } = body;

        const providedFields = [content, image, imagealt, href].filter(field => field !== undefined);

        if (providedFields.length > 1 || image && !imagealt || imagealt && !image) {
            return NextResponse.json({ message: "You must provide only one of the following fields at a time: content, image & imagealt (passed together), href."}, { status: 400 })
        }

        communityId = Number(communityId);

        const sanitizedTitle = xss(title);
        const sanitizedContent = xss(content);
        const sanitizedTagline = xss(tagline);
        const sanitizedImageurl = image ? xss(image) : null;
        const sanitizedImagealt = imagealt ? xss(imagealt) : null;
        const sanitizedHref = href ? xss(href) : null;

        const data = {
            title: sanitizedTitle,
            content: sanitizedContent,
            tagline: sanitizedTagline,
            public: user.public,
            image: sanitizedImageurl,
            imagealt: sanitizedImagealt,
            href: sanitizedHref,

            author: {
                connect: {
                    id: user.id,
                },
            },
            community: {
                connect: {
                    id: communityId,
                },
            },
        };

        // This seems to bypass the sanitization, but I don"t know why I put this here and I don"t want to risk breaking anything now. Will revisit at some point.
        if (image) {
            data.image = image;
        }
        if (imagealt) {
            data.imagealt = imagealt;
        }

        const post = await prisma.post.create({
            data,
        });

        return NextResponse.json(post, { status: 201 });
        
    } catch (error) {
        logError(error);
        return NextResponse.json({ message: "Error occurred while creating post, please check your request for errors."}, { status: 500 });
    }*/
}
