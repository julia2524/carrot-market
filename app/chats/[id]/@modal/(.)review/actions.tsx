"use server";
import db from "@/lib/db";
import getSession from "@/lib/session";

export async function createReviewScore(
  score: number,
  other: number,
  roomId: string
) {
  const session = await getSession();

  const existingReview = await db.review.findFirst({
    where: {
      reviewerId: session.id,
      reviewedId: other,
      roomId,
    },
  });
  if (existingReview) {
    return existingReview.id;
  }
  const [, review] = await db.$transaction([
    db.user.update({
      where: {
        id: other,
      },
      data: {
        score: { increment: score },
      },
    }),
    db.review.create({
      data: {
        score,
        reviewerId: session.id!,
        reviewedId: other,
        roomId,
      },
    }),
  ]);
  return review.id;
}
