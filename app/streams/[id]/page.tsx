import Button from "@/components/button";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";
import { deleteStream } from "../add/actions";
import LiveComments from "@/components/live-comments";
import { Prisma } from "@prisma/client";

async function getStream(id: number) {
  const stream = await db.liveStream.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      stream_key: true,
      stream_id: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return stream;
}
async function getInitialLiveComments(streamId: number) {
  console.log("comments");
  const comments = await db.liveComment.findMany({
    where: {
      liveStreamId: streamId,
    },
    include: { user: true },
    orderBy: { created_at: "desc" },
  });
  console.log(comments);
  return comments;
}
export type InitialLiveComments = Prisma.PromiseReturnType<
  typeof getInitialLiveComments
>;

export default async function StreamDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const stream = await getStream(id);
  if (!stream) {
    return notFound();
  }
  const session = await getSession();
  const deleteStreamWithId = deleteStream.bind(null, id);
  const initialComments = await getInitialLiveComments(id);
  const user = await db.user.findUnique({
    where: {
      id: session.id!,
    },
    select: {
      username: true,
      avatar: true,
    },
  });
  return (
    <div className="p-10">
      <div className="relative aspect-video">
        <iframe
          src={`https://${process.env.CLOUDFLARE_DOMAIN}/82f454e1ce416d7c0459b1c1a522a161/iframe`}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          className="w-full h-full rounded-md"
        ></iframe>
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {stream.user.avatar !== null ? (
            <Image
              src={stream.user.avatar}
              width={40}
              height={40}
              alt={stream.user.username}
              unoptimized
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{stream.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{stream.title}</h1>
      </div>
      {stream.userId === session.id ? (
        <>
          <div className="bg-yellow-200 text-black p-5 rounded-md">
            <div className="flex flex-wrap">
              <span className="font-semibold">WebRTC(WHIP) URL:</span>
              <span>
                https://customer-rp1qj2phs0pv7ezg.cloudflarestream.com/d672623f0028061746903fa96c7675b5k82f454e1ce416d7c0459b1c1a522a161/webRTC/publish
              </span>
            </div>
            {/* <div className="flex flex-wrap">
            <span className="font-semibold">Stream Key:</span>
            <span>{stream.stream_key}</span>
          </div> */}
          </div>
          <form action={deleteStreamWithId} className="mt-2">
            <Button text="Delete streaming" />
          </form>
        </>
      ) : null}

      <div>
        <LiveComments
          initialComments={initialComments}
          liveStreamId={id}
          user={user}
        />
      </div>
    </div>
  );
}
