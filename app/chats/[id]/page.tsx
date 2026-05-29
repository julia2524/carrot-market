import ChatMessagesList from "@/components/chat-messages-list";
import { ProductStatus } from "@/components/product-status";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { getRoom, getUserProfile } from "./actions";

async function getMessages(chatRoomId: string) {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      isSystem: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return messages;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }
  const initialMessages = await getMessages(params.id);
  const session = await getSession();
  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }
  const owner = Boolean(session.id === room.product.userId);
  // console.log(owner);
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <ProductStatus
        productPhoto={room.product.photo}
        productId={room.product.id}
        productTitle={room.product.title}
        productStatus={room.product.status}
        productPrice={room.product.price}
        productOwner={owner}
        chatRoomId={params.id}
      />

      <div className="flex-1 relative">
        <ChatMessagesList
          productId={room.product.id}
          productPhoto={room.product.photo}
          chatRoomId={params.id}
          userId={session.id!}
          username={user.username}
          avatar={user.avatar!}
          initialMessages={initialMessages}
        />
      </div>
    </div>
  );
}
