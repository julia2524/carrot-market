import { getProduct } from "@/app/products/[id]/queries";
import ExButton from "@/components/ex-button";
import { ProductStatus } from "@/components/product-status";
import {
  HeartIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getRoom } from "../../actions";
import getSession from "@/lib/session";
import ReviewButton from "@/components/review-button";

export default async function Modal({ params }: { params: { id: string } }) {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }
  const session = await getSession();
  const me = room.users.find((user) => user.id === session.id);
  const other = room.users.find((user) => user.id !== session.id);
  if (!me) {
    return;
  }
  if (!other) {
    return;
  }

  return (
    <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm left-0 top-0">
      <ExButton />
      <div className="max-w-screen-sm h-1/2 flex  justify-center w-full">
        <div className="aspect-square bg-neutral-800 text-neutral-200 rounded-md flex">
          <div className="pt-10 p-5 flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <div>
                <h1 className="text-2xl font-semibold">{me.username}님,</h1>
                <h1 className="text-2xl font-semibold">
                  {other.username}님과 거래가 어떠셨나요?
                </h1>
              </div>
              <h3 className="font-thin mt-3">
                거래 선호도는 나만 볼 수 있어요.
              </h3>
            </div>
            <ReviewButton roomId={room.id} other={other.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
