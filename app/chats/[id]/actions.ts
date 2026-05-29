"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getSession();
  await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
    },
    select: { id: true },
  });
}

export async function updateProductStatus(
  prodcutId: number,
  status: string,
  chatRoomId: string
) {
  const session = await getSession();

  const product = await db.product.findUnique({
    where: {
      id: prodcutId,
    },
    select: {
      userId: true,
    },
  });
  if (!product) return;
  if (session.id !== product.userId) return;
  await db.product.update({
    where: {
      id: prodcutId,
    },
    data: {
      status,
    },
  });

  if (status === "SOLD") {
    await db.message.create({
      data: {
        payload: "거래 잘 하셨나요? 거래한 이웃에게 따뜻한 마음을 전해보세요!",
        chatRoomId,
        userId: session.id,
        isSystem: true,
      },
    });
  }
  revalidatePath("/");
}

export async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: { id: true, username: true },
      },
      product: {
        select: {
          id: true,
          photo: true,
          title: true,
          price: true,
          status: true,
          userId: true,
        },
      },
    },
  });
  // console.log(room);
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    if (!canSee) {
      return null;
    }
  }
  return room;
}

export async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id!,
    },
    select: {
      username: true,
      avatar: true,
    },
  });
  return user;
}
