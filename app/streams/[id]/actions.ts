"use server";

import { LiveCommentType } from "@/components/live-comments";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function addingLiveComment(
  comment: LiveCommentType,
  liveStreamId: number
) {
  const session = await getSession();
  if (session.id) {
    await db.liveComment.create({
      data: {
        payload: comment.comment,
        user: {
          connect: {
            id: session.id,
          },
        },
        liveStrem: {
          connect: {
            id: liveStreamId,
          },
        },
      },
      select: { id: true },
    });
    revalidatePath(`/posts/${liveStreamId}`);
  }
}
