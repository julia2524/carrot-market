"use server";

import { CommentType } from "@/components/comments";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath, revalidateTag } from "next/cache";

export async function likePost(postId: number) {
  await new Promise((r) => setTimeout(r, 5000));
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}-${session.id}`);
  } catch (e) {
    console.error(e);
  }
}
export async function dislikePost(postId: number) {
  await new Promise((r) => setTimeout(r, 5000));
  const session = await getSession();
  try {
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}-${session.id}`);
    revalidatePath("/life");
  } catch (e) {
    console.error(e);
  }
}

export async function addingComment(comment: CommentType, postId: number) {
  const session = await getSession();
  if (session.id) {
    await db.postComment.create({
      data: {
        payload: comment.comment,
        user: {
          connect: {
            id: session.id,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
      select: { id: true },
    });
    revalidateTag(`post-comments-${postId}`);
    revalidatePath("/life");
  }
}
