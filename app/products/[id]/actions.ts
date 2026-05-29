"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProduct(productId: number) {
  const session = await getSession();
  const product = await db.product.findUnique({
    where: { id: productId },
    select: {
      userId: true,
    },
  });
  if (product?.userId !== session.id) return;
  await db.product.delete({
    where: {
      id: productId,
    },
  });
  revalidateTag("home-products");
  revalidatePath("/home");
  redirect("/home");
}

export async function createChatRoom(userId: number, productId: number) {
  const session = await getSession();
  if (!session.id) return;
  const productStatus = await db.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      status: true,
    },
  });
  if (!productStatus || productStatus.status !== "FOR_SALE") {
    return;
  }

  if (userId === session.id) return;
  const existingRoom = await db.chatRoom.findFirst({
    where: {
      productId,
      AND: [
        {
          users: {
            some: {
              id: session.id,
            },
          },
        },
        {
          users: {
            some: {
              id: userId,
            },
          },
        },
      ],
    },
    select: { id: true },
  });
  if (existingRoom) {
    return redirect(`/chats/${existingRoom.id}`);
  }
  const room = await db.chatRoom.create({
    data: {
      users: {
        connect: [
          {
            id: userId!,
          },
          { id: session.id },
        ],
      },
      product: {
        connect: {
          id: productId,
        },
      },
    },
    select: {
      id: true,
    },
  });

  redirect(`/chats/${room.id}`);
}
