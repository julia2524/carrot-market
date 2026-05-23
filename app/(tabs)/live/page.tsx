import StreamList from "@/components/stream-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

async function getInitialStream() {
  console.log("stream-list!!!!");
  const streams = await db.liveStream.findMany({
    select: {
      title: true,
      created_at: true,
      id: true,
      stream_id: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return streams;
}

export type InitialStream = Prisma.PromiseReturnType<typeof getInitialStream>;

export default async function Live() {
  const initialStream = await getInitialStream();
  return (
    <div>
      <StreamList initialStream={initialStream} />
      <div className="fixed w-full bottom-24 mx-auto max-w-screen-md grid grid-cols-5 px-5">
        <div className="col-start-5 flex items-center justify-center">
          <Link
            href="/streams/add"
            className="bg-orange-500 flex items-center justify-center rounded-full size-16 text-white"
          >
            <PlusIcon className="size-10" />
          </Link>
        </div>
      </div>
    </div>
  );
}
