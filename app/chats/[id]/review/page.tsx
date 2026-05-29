import Button from "@/components/button";
import { createReviewPayload } from "./actions";

export default function Review({
  searchParams,
}: {
  searchParams: { reviewId: string };
}) {
  const reviewId = searchParams.reviewId;
  const createReviewPayloadWithId = createReviewPayload.bind(null, reviewId);
  return (
    <div className="p-8 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">
          따뜻한 거래 경험을 알려주세요!
        </h1>
        <h3 className=" text-neutral-500">
          남겨주신 거래 후기는 상대방의 프로필에 공개돼요.
        </h3>
      </div>
      <form action={createReviewPayloadWithId} className="flex flex-col gap-4">
        <textarea
          name="review"
          className="w-full h-48 border rounded-lg bg-transparent outline-none focus:outline-none ring-1 focus:ring-2 ring-neutral-200 border-none focus:ring-neutral-300 "
          placeholder="거래 중 기억에 남았던 따뜻한 순간이나 고마웠던 마음을 짧게 남겨보세요. (선택)"
        />
        <Button text="후기 보내기" />
      </form>
      {/* <button
        onClick={onClick}
        className="bg-orange-500 text-white py-2 rounded-lg font-bold outline-none focus:outline-none"
      >
        후기 보내기
      </button> */}
    </div>
  );
}
