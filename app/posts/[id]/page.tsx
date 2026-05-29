import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import LikeButton from "@/components/like-button";
import Comments from "@/components/comments";
import { Prisma } from "@prisma/client";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch {
    return null;
  }
}

async function getCachedPost(postId: number) {
  const cachedOperation = nextCache(getPost, [`post-detail-${postId}`], {
    tags: [`post-detail-${postId}`],
    revalidate: 5,
  });
  return cachedOperation(postId);
}

async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return { likeCount, isLiked: Boolean(isLiked) };
}
async function getCachedLikeStatus(postId: number, userId: number) {
  const cachedOperation = nextCache(
    getLikeStatus,
    [`product-like-status-${postId}-${userId}`],
    {
      tags: [`like-status-${postId}-${userId}`],
    }
  );
  return cachedOperation(postId, userId);
}

async function getCashedComments(postId: number) {
  const cachedOperation = nextCache(
    getInitialComments,
    [`post-comments-${postId}`],
    {
      tags: [`post-comments-${postId}`],
      revalidate: 10,
    }
  );
  return cachedOperation(postId);
}

async function getInitialComments(postId: number) {
  const comments = await db.postComment.findMany({
    where: {
      postId,
    },
    include: {
      user: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  // console.log(comments);
  return comments;
}

export type InitialComments = Prisma.PromiseReturnType<
  typeof getInitialComments
>;

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getCachedPost(id);
  if (!post) {
    return notFound();
  }
  // console.log(post);

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
  const { likeCount, isLiked } = await getCachedLikeStatus(id, session.id!);
  const initialComments = await getCashedComments(id);
  return (
    <>
      <div className="p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          {post.user.avatar !== null ? (
            <Image
              width={28}
              height={28}
              alt={post.user.username}
              src={post.user.avatar}
              className="size-7 rounded-full"
              unoptimized
            />
          ) : (
            <UserIcon className="size-7 rounded-full" />
          )}
          <div>
            <span className="text-sm font-semibold">{post.user.username}</span>
            <div className="text-xs">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="mb-5">{post.description}</p>
        <div className="flex flex-col gap-5 items-start">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <EyeIcon className="size-5" />
            <span>조회 {post.views}</span>
          </div>
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        </div>
      </div>
      <div>
        <Comments initialComments={initialComments} postId={id} user={user} />
      </div>
    </>
  );
}
