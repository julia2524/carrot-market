"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import z from "zod";

const schema = z.object({
  title: z.string(),
  description: z.string(),
});
export async function postForm(_: unknown, formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
  };
  const results = schema.safeParse(data);
  if (!results.success) {
    const flatten = z.flattenError(results.error);
    return { fieldErrors: flatten.fieldErrors };
  }
  const session = await getSession();
  const post = await db.post.create({
    data: {
      title: results.data.title,
      description: results.data.description,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
  redirect(`/posts/${post.id}`);
}
