"use server";

import getSession from "@/lib/session";
import db from "@/lib/db";
import { redirect } from "next/navigation";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { productServerSchema } from "./schema";
import z from "zod";
import { revalidatePath } from "next/cache";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadProduct(formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  const result = productServerSchema.safeParse(data);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return { fieldErrors: flatten.fieldErrors };
  } else {
    const photoFile = result.data.photo as File;
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    const fileName = `products/${Date.now()}-${photoFile.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: "carrot-market", // 버킷 이름
        Key: fileName,
        Body: buffer,
        ContentType: photoFile.type,
      }),
    );
    const photoUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

    console.log("✅ R2 업로드 성공! URL:", photoUrl);
    console.log("📦 DB에 저장될 최종 데이터:", {
      title: result.data.title,
      price: result.data.price, // Zod가 숫자로 바꾼 값
      description: result.data.description,
      photo: photoUrl, // 파일이 아니라 주소!
    });

    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: photoUrl,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: { id: true },
      });

      revalidatePath("/home");
      redirect(`/products/${product.id}`);
    }
  }
}
