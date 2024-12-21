import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getSheetPreview } from "@/lib/utils/excel";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const sheets = JSON.parse(formData.get("sheets") as string) as string[];

    if (!file || !sheets.length) {
      return NextResponse.json(
        { message: "Invalid request" },
        { status: 400 }
      );
    }

    // Save file metadata
    const savedFile = await prisma.file.create({
      data: {
        filename: file.name,
        path: `uploads/${file.name}`, // In a real app, save to cloud storage
      },
    });

    // Process and save sheet data
    for (const sheetName of sheets) {
      const { headers, preview } = await getSheetPreview(file, sheetName);
      
      await prisma.sheet.create({
        data: {
          name: sheetName,
          fileId: savedFile.id,
          data: {
            headers,
            preview,
          },
        },
      });
    }

    return NextResponse.json(
      { 
        message: "File uploaded successfully",
        fileId: savedFile.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { message: "Failed to upload file" },
      { status: 500 }
    );
  }
}