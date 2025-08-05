import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import { legacy_logError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const FORM_DATA = await req.formData();

    const FILE = FORM_DATA.get("file") as File;
    if (!(FILE instanceof Blob)) return NextResponse.json({ error: "Invalid file upload." }, { status: 400 });

    const ARRAY_BUFFER = await FILE.arrayBuffer();
    const BUFFER = new Uint8Array(ARRAY_BUFFER);

    await fs.writeFile(`./public/images/uploaded/${FILE.name}`, BUFFER);

    revalidatePath("/");

    return NextResponse.json({ url: `/images/uploaded/${FILE.name}` }, { status: 200 });
  } catch (error) {
    legacy_logError(error);
    return NextResponse.json({ error: "Image failed to upload." }, { status: 500 });
  }
}