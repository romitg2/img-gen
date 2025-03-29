import prisma from "@repo/database";
import { NextResponse } from "next/server";

export async function getGeneratedImageForUser(userId: string) {
  try {
    const images = await prisma.generatedImage.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
