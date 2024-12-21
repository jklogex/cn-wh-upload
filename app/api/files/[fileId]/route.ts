import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(params.fileId) },
      include: {
        sheets: true,
      },
    });

    if (!file) {
      return NextResponse.json(
        { message: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(file);
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { message: "Failed to fetch file" },
      { status: 500 }
    );
  }
}