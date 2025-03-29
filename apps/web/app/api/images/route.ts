import { NextRequest } from "next/server";
import { getGeneratedImageForUser } from "./util";
import { NextResponse } from "next/server";

export type GeneratedImage = {
  url: string;
};

export async function GET(request: NextRequest) {
  const userId = "romitgabani1@gmail.com";
  try {
    const images = await getGeneratedImageForUser(userId) as GeneratedImage[];
    const imageUrls = images?.map((image: GeneratedImage) => image.url);
    return NextResponse.json(imageUrls);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}
