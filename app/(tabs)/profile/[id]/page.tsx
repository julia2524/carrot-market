import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import getUserInfo from "./queries";
import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import { statusStyles } from "@/lib/constants";

export default async function UserProfile() {
  const user = await getUserInfo();
  if (!user) return;
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(user.created_at);
  const reviewWithPayload = user.receivedReviews.filter(
    (review) => review.payload !== null
  );

  return (
    <>
      <div className="flex flex-col p-5 rounded-2xl m-5 gap-4 bg-neutral-800">
        <div className="flex items-center gap-3">
          <div className="relative size-14 flex bg-neutral-700 items-center justify-center rounded-full overflow-hidden shrink-0">
            {user.avatar !== null ? (
              <Image
                fill
                src={user.avatar}
                alt={user.username}
                className="object-cover"
                unoptimized
              />
            ) : (
              <UserIcon className="size-10 rounded-md text-neutral-500" />
            )}
          </div>

          <div className="text-white text-xl font-semibold leading-none">
            {user.username}
          </div>
        </div>
        <div>
          <span className="text-sm text-neutral-300">{formattedDate} 가입</span>
        </div>
        <Link
          href={`/profile/${user.id}/edit`}
          className="bg-neutral-700 text-center py-2 text-sm text-white rounded-md"
        >
          프로필 수정
        </Link>
      </div>
      <div className="flex flex-col p-5 rounded-2xl m-5 gap-4 bg-neutral-800">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold flex flex-row gap-2">
            <span>판매 물품</span>
            <span>{user.products ? user.products.length : ""}</span>
          </h1>
        </div>
        <div className="flex flex-row gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {user.products
            ? user.products.map((product) => (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="w-28 shrink-0 flex flex-col gap-3"
                >
                  <div className="relative aspect-square overflow-hidden ">
                    <Image
                      fill
                      src={product.photo}
                      alt={product.title}
                      unoptimized
                      className="rounded-md object-cover "
                    />
                    <div
                      className={`absolute top-1 left-1 py-0.5 px-1.5 rounded text-white font-bold text-sm ${
                        statusStyles[
                          product.status as keyof typeof statusStyles
                        ].bgColor
                      }`}
                    >
                      {
                        statusStyles[
                          product.status as keyof typeof statusStyles
                        ].label
                      }
                    </div>
                  </div>
                  <div className="text-white">
                    <h3 className="text-sm truncate">{product.title}</h3>
                    <h5 className="font-semibold">
                      {formatToWon(product.price)}원
                    </h5>
                  </div>
                </Link>
              ))
            : ""}
        </div>
      </div>

      <div className="flex flex-col p-5 rounded-2xl m-5 gap-4 bg-neutral-800">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold flex flex-row gap-2">
            <span>받은 후기</span>
            <span>{reviewWithPayload ? reviewWithPayload.length : ""}</span>
          </h1>
        </div>
        <div>
          <div className="flex flex-col">
            {reviewWithPayload.map((review) => (
              <div key={review.id} className="flex flex-col mb-2">
                <div className="flex items-start gap-3 mb-2">
                  {review.reviewer.avatar !== null ? (
                    <Image
                      width={30}
                      height={30}
                      alt={review.reviewer.username}
                      src={review.reviewer.avatar}
                      className="size-7 rounded-full mt-2"
                      unoptimized
                    />
                  ) : (
                    <UserIcon className="size-7 rounded-full mt-2" />
                  )}
                  <div>
                    <span className="text-sm font-semibold">
                      {review.reviewer.username}
                    </span>
                    <div className="text-xs text-neutral-400">
                      <span>
                        {formatToTimeAgo(review.created_at.toString())}
                      </span>
                    </div>
                    <div>
                      <span className="">{review.payload}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
