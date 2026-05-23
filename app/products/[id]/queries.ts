import db from "@/lib/db";
import getSession from "@/lib/session";

import { unstable_cache as nextCache } from "next/cache";
export async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

export async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}
// const getCachedProduct = nextCache(getProduct, ["product-detail"], {
//   tags: ["product-detail"],
// });
export async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

export async function getCachedProductTitle(id: number) {
  const cachedOperation = nextCache(getProductTitle, [`product-title-${id}`], {
    tags: [`product-title-${id}`],
  });
  return cachedOperation(id);
}
