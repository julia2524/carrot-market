import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

interface LiveStreamProps {
  title: string;
  created_at: Date;
  id: number;
  stream_id: string;
  user: {
    id: number;
    username: string;
    avatar: string;
  };
}

export default function LiveStream({
  title,
  created_at,
  id,
  user,
  stream_id,
}: LiveStreamProps) {
  return (
    <Link href={`streams/${id}`} className="flex gap-5">
      <div className="relative size-28 bg-neutral-800 flex items-center justify-center rounded-md overflow-hidden">
        {user.avatar !== null ? (
          <Image
            fill
            src={user.avatar}
            alt={title}
            className="object-cover"
            unoptimized
          />
        ) : (
          <UserIcon className="size-10 rounded-md text-neutral-500" />
        )}
        <div className="absolute top-1 left-1 py-0.5 px-1.5 rounded bg-red-600 text-white font-bold animate-pulse">
          LIVE
        </div>
      </div>
      <div className="flex flex-col gap-1 text-white justify-center">
        <span className="text-xl">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
      </div>
    </Link>
  );
}
