"use server";
import bcrypt from "bcrypt";
import { z } from "zod";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";
import { profileClientSchema } from "./schema";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/r2";

export async function editProfile(formData: FormData) {
  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    photo: formData.get("photo"),
  };

  const result = await profileClientSchema.safeParseAsync(data);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return { fieldErrors: flatten.fieldErrors };
  }

  let avatarUrl: string | undefined = undefined;

  if (result.data.photo instanceof File && result.data.photo.size > 0) {
    const photoFile = result.data.photo;
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    const fileName = `avatars/${Date.now()}-${photoFile.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: "carrot-market", // 버킷 이름
        Key: fileName,
        Body: buffer,
        ContentType: photoFile.type,
      })
    );
    avatarUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
  }
  const session = await getSession();
  if (session.id) {
    const existingUser = await db.user.findUnique({
      where: {
        username: result.data.username,
      },
      select: {
        id: true,
      },
    });
    if (existingUser && existingUser.id !== session.id) {
      return {
        fieldErrors: {
          username: ["이미 사용 중인 닉네임입니다."],
        },
      };
    }
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    await db.user.update({
      where: {
        id: session.id,
      },
      data: {
        username: result.data.username,
        password: hashedPassword,
        avatar: avatarUrl ?? undefined,
      },
      select: {
        id: true,
      },
    });
    redirect("/profile");
  }
}
