import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";

export async function getChatRooms() {
  const session = await getSession();
  if (!session.id) return;
  const chatRooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: session.id,
        },
      },
    },
    select: {
      id: true,
      users: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      product: {
        select: {
          id: true,
          photo: true,
        },
      },
      messages: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return chatRooms;
}

export type ChatRooms = Prisma.PromiseReturnType<typeof getChatRooms> | null;
