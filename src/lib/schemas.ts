import { ReportSubject } from "@prisma/client";
import * as z from "zod";

export const LOGIN_SCHEMA = z.object({
    email: z.string().min(1, "Email is required.").email("Email must be in a valid format."),
    password: z.string().min(1, "Password is required.")
})

export const SIGNUP_SCHEMA = z.
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

export const UPDATE_USERNAME_SCHEMA = z.object({
    userID: z.string(),
    username: z
        .string()
        .min(2, "Your username must be at least 2 characters.")
        .max(25, "Your username must be no longer than 25 characters.")
        .regex(/^[a-zA-Z0-9_-]+$/, "Your username must only contains letters, numbers, underscores and hyphens."),
})

export const DELETE_ACCOUNT_SCHEMA = z.object({
    userID: z.string(),
    username: z.string(),
    confirmUsername: z.string(),
}).refine((data) => data.username === data.confirmUsername, {
    path: ["confirmUsername"],
    message: "Please type your full username correctly."
})

export const UPDATE_DESCRIPTION_SCHEMA = z.object({
    userID: z.string(),
    description: z
        .string()
        .min(10, "Your description must be at least 10 characters.")
        .max(100, "Your description can at most be 100 characters."),
})

// Create

export const CREATE_COMMUNITY_SCHEMA = z.object({
    name: z
        .string()
        .min(2, "All communitys have to be 2 characters or over.")
        .max(20, "All communitys have a maximum of 20 characters.")
        .transform(value => value.replace(/\s+/g, "")),
    short_description: z
        .string()
        .min(5, "Description must be at least 5 characters.")
        .max(500, "Description must be no more than 500 characters."),
    sidebar_description: z
        .string()
        .min(15, "Sidebar description must be at least 15 characters.")
        .max(50000, "Sidebar description must be no more than 50,000 characters.")
        .transform(value => value.replace(/[^a-zA-Z0-9\s\n!@()[\]""£$%^&*_\-+=;:.,/\\{}!\\[]/g, "")),
    image_url: z
        .string(),
    file: z
        .any(),
})


/// NEW SCHEMAS
/// --- ALL SCHEMAS BELOW THIS ARE FROM AFTER REWRITE --- ///

const ReportSubjectType: z.ZodType<ReportSubject> = z.any();

export const REPORT_FORM_SCHEMA = z.object({
    subject: ReportSubjectType,
    subjectID: z.string().min(1),
    reporterID: z.string().min(1).optional(),
    reason: z.string().min(1, "Please select a reason."),
    other_information: z
        .string()
        .min(10, "Information must be at least 10 characters.")
        .max(1000, "Information must not exceed 1000 characters."),
})