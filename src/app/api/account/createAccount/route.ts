// import { hash } from "@node-rs/argon2";
import { legacy_logError } from "@/lib/utils";
import { NextResponse } from "next/server";
// import * as z from "zod";

// import { prisma } from "@/lib/db";

// Input validation schema

/*const userSchema = z.

    object({
        username: z
            .string()
            .min(2, {
                message: "Your username must be at least 2 characters."
            }),
        email: z
            .string()
            .min(1, "Email is required.")
            .email("Your email must be in a valid format."),
        password: z
            .string()
            .min(1, "Password is required.")
            .min(8, "Password must have 8 characters.")
    })*/

export async function POST(/*req: Request*/) {
    try {

        return NextResponse.json({ message: "Sorry, this API is currently unavailable." }, { status: 503 })

        /*const body = await req.json();
        const { email, username, password } = userSchema.parse(body);

        const EmailExists = await prisma.user.findUnique({
            where: { email: email }
        });

        const UsernameExists = await prisma.user.findUnique({
            where: { username: username }
        });

        if (EmailExists) {
            return NextResponse.json({ user: null, message: "Email is associated with an existing account"}, { status: 409 })
        }

        if (UsernameExists) {
            return NextResponse.json({ user: null, message: "Username is associated with an existing account"}, { status: 409 })
        }

        const hashedPassword = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password_hash: hashedPassword
            }
        });
        // eslint-disable-next-line no-unused-vars
        const { password_hash: newUserPassword, ...rest } = newUser;

        return NextResponse.json({ user: newUser, message: "Account has been created"}, { status: 201 });*/

    } catch(error) {
        legacy_logError(error);
        return NextResponse.json({ message: "Internal Server Error, check your formatting and that all required fields are present."}, { status: 500 });
    }
}
