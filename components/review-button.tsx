"use client";

import { createReviewScore } from "@/app/chats/[id]/@modal/(.)review/actions";

export default function ReviewButton({
  roomId,
  other,
}: {
  roomId: string;
  other: number;
}) {
  const onReview = async (score: number) => {
    const reviewId = await createReviewScore(score, other, roomId);
    window.location.href = `/chats/${roomId}/review?reviewId=${reviewId}`;
  };
  return (
    <div className="flex flex-row gap-4 *:border-2 *:p-5 *:rounded-3xl g ">
      <button onClick={() => onReview(-1)}>별로에요</button>
      <button onClick={() => onReview(1)}>좋아요!</button>
      <button onClick={() => onReview(3)}>최고에요!</button>
    </div>
  );
}
