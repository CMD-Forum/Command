"use server";

import { db } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import { log } from "@/lib/utils";
import { ReportReason } from "@prisma/client";
import { getTranslations } from 'next-intl/server';

import { REPORT_FORM_SCHEMA } from "@/lib/schemas";

export type ReportActionError = 
    | "Generic"
    | "SubmitFailed"
    | "TimedOut"
    | "DatabaseError"

export const report = actionClient
.metadata({ actionName: "report" })
.schema(REPORT_FORM_SCHEMA)
.action(async ({ parsedInput: { subject, subjectID, reporterID, reason, other_information } }) => {

    const t = await getTranslations("ServerActions.Post.Report");

    try {
        await db.report.create({
            data: {
                userId: reporterID,
                postId: subjectID,
                reason: reason.toUpperCase() as ReportReason,
                subjectType: subject,
                information: other_information
            }
        })

        return { success: t("Success") };
    } catch (error) {
        log({ message: error, type: "error", scope: "Server Action" });
        return { error: t("GenericError") };
    }

});