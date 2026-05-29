import { ChatRooms } from "@/app/(tabs)/chat/actions";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

type RoomType = NonNullable<ChatRooms>[number];
export default async function Room({ id, users, messages, product }: RoomType) {
  const session = await getSession();
  const me = users.find((user) => user.id === session.id);
  const other = users.find((user) => user.id !== session.id);
  return (
    <Link href={`/chats/${id}`} className="flex gap-5 p-5 ">
      <div className="relative size-16 rounded-md overflow-hidden">
        <Image
          fill
          src={product.photo}
          alt={String(product.id)}
          className="object-cover"
          unoptimized
        />
        {other?.avatar ? (
          <Image
            className="absolute rounded-full size-7 bottom-0 right-0"
            src={other?.avatar}
            alt={other?.username}
            width={20} // 추가!
            height={20}
            unoptimized
          />
        ) : (
          <UserIcon className="size-7 rounded-full absolute bottom-0 right-0 bg-neutral-400 text-white" />
        )}
      </div>
      <div className="flex flex-col gap-1 text-white ">
        <div className="flex flex-row gap-2 items-baseline">
          <span className="text-lg">{other?.username}</span>
          <span className="text-sm text-neutral-500">
            {messages[0]
              ? formatToTimeAgo(messages[0].created_at.toString())
              : "아직 대화가 없어요"}
          </span>
        </div>
        <div>
          <span className="text-lg text-neutral-500">
            {messages[0]?.payload ?? "채팅을 시작해보세요!"}
          </span>
          <div></div>
        </div>
      </div>
    </Link>
  );
}
