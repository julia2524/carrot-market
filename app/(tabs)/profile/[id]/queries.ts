import db from "@/lib/db";

export default async function getUserInfo(userId: number) {
  // const session = await getSession();
  // const userId = session.id;
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      products: {
        select: {
          id: true,
          title: true,
          price: true,
          photo: true,
          status: true,
        },
      },
      receivedReviews: {
        select: {
          id: true,
          payload: true,
          created_at: true,
          reviewedId: true,
          reviewer: true,
          reviewed: true,
        },
      },
    },
  });
  return user;
}
