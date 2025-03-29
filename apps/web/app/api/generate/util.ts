import prisma from "@repo/database";
import { GeneratedImageType } from "@repo/types/schema";


export async function storeGeneratedImage({
  userId,
  url,
  model,
  lora,
}: GeneratedImageType) {
  try {
    const generatedImage = await prisma.generatedImage.create({
      data: {
        url,
        user: {
          connect: {
            id: userId,
          },
        },
        model,
        lora,
      },
    });
    return generatedImage;
  } catch (error) {
    console.log(error);
  }
}
