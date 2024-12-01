/**
 * This file is commented out as it isn't used. Server actions are very buggy.
 */

/*"use server";

import { createComment } from "../../data";
import { logError } from "../../utils";

export async function createCommentAction(state: any, formData: FormData, postID: string, userID: string, content: string) {

    console.log("postID:" + postID, "userID:" + userID, "content:", content)
    
    if (formData === undefined) {
        return { error: "Comment failed to submit." }
    }

    if (typeof postID !== "string") {
		return {
            // Obviously we don't want the user to see an error that they probably wouldn't understand, so in production a vague message is given.
			error: process.env.NODE_ENV === "development" ? "postID must be a string." : "Try refreshing the page and logging in again."
		};
	}

    if (typeof userID !== "string") {
		return {
            // Obviously we don't want the user to see an error that they probably wouldn't understand, so in production a vague message is given.
			error: process.env.NODE_ENV === "development" ? "userID must be a string." : "Try refreshing the page and logging in again."
		};
	}

    // const content = formData.get("content") as string; // For some reason it complains that 'get' is not a function, so this is not used.
    if (typeof content !== "string") {
		return {
            // Obviously we don't want the user to see an error that they probably wouldn't understand, so in production a vague message is given.
			error: process.env.NODE_ENV === "development" ? "content must be a string." : "Try refreshing the page and logging in again."
		};
	}

    if (content && postID && userID) {
        try {
            await createComment({ postID: postID, userID: userID, content: content });
            return { success: "Comment successfully submitted." }
        } catch ( error ) {
            logError(error);
            return { error: error }
        }
    } else {
        return { error: "Comment cannot be blank." }
    }

}*/