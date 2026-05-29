"use server";

import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function createReviewPayload(
  reviewId: string,
  formData: FormData
) {
  const data = {
    review: formData.get("review"),
  };
  const existingReview = await db.review.findUnique({
    where: {
      id: Number(reviewId),
    },
    select: {
      payload: true,
    },
  });
  if (existingReview?.payload) {
    redirect("/");
  }
  await db.review.update({
    where: {
      id: Number(reviewId),
    },
    data: {
      payload: data.review as string,
    },
  });
  redirect("/");
}
