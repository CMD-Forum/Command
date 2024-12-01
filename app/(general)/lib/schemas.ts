import * as z from "zod";

export const LoginSchema = z.object({

    email: z.string().min(1, "Email is required.").email("Email must be in a valid format."),
    password: z.string().min(1, "Password is required.")

})

export const SignupSchema = z.
    object({
        username: z
            .string()
            .min(2, {
                message: "Your username must be at least 2 characters."
            })
            .max(25, {
                message: "Your username must be no longer than 25 characters."
            })
            .regex(/^[a-z0-9_-]+$/, "Your username must only contains letters, numbers, underscores, hyphens and be lowercase."),
        email: z      
            .string()
            .min(1, "Email is required.")
            .email("Your email must be in a valid format."),
        password: z
            .string()
            .min(1, "Password is required.")
            .min(8, "Password must have 8 characters"),
    })

export const UpdateUsernameSchema = z.object({

    userID: z.string(),
    username: z
        .string()
        .min(2, "Your username must be at least 2 characters.")
        .max(25, "Your username must be no longer than 25 characters.")
        .regex(/^[a-zA-Z0-9_-]+$/, "Your username must only contains letters, numbers, underscores and hyphens."),

})

export const DeleteAccountSchema = z.object({

    userID: z.string(),
    username: z.string(),
    confirmUsername: z.string(),

}).refine((data) => data.username === data.confirmUsername, {

    path: ['confirmUsername'],
    message: "Please type your full username correctly."

})

export const UpdateDescriptionSchema = z.object({

    userID: z.string(),
    description: z
        .string()
        .min(10, "Your description must be at least 10 characters.")
        .max(100, "Your description can at most be 100 characters."),

})

// Create

export const CreateCommunitySchema = z.object({
    
    name: z
        .string()
        .min(2, "All communitys have to be 2 characters or over.")
        .max(20, "All communitys have a maximum of 20 characters.")
        .transform(value => value.replace(/\s+/g, '')),
    short_description: z
        .string()
        .min(5, "Description must be at least 5 characters.")
        .max(500, "Description must be no more than 500 characters."),
    sidebar_description: z
        .string()
        .min(15, "Sidebar description must be at least 15 characters.")
        .max(50000, "Sidebar description must be no more than 50,000 characters.")
        .transform(value => value.replace(/[^a-zA-Z0-9\s\n!@()[\]"'£$%^&*_\-+=;:.,/\\{}!\\[]/g, '')),
    image_url: z
        .string()
        .url( { message: "Image must be a URL and start with `https://`" } )
        .min(1, "Your URL must not be empty.")
})