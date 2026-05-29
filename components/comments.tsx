"use client";
import { useOptimistic } from "react";

import { InitialComments } from "@/app/posts/[id]/page";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/16/solid";
import { formatToTimeAgo } from "@/lib/utils";
import { useForm } from "react-hook-form";
import Input from "@/components/input";
import { addingComment } from "@/app/posts/[id]/actions";

interface CommentsProps {
  initialComments: InitialComments;
  postId: number;
  user: {
    username: string;
    avatar: string | null;
  } | null;
}

export type CommentType = {
  comment: string;
};
type CommentUser = {
  username: string;
  avatar: string | null;
};

type OptimisticCommentType = {
  id: number;
  payload: string;
  created_at: Date;
  user: CommentUser;
};

export default function Comments({
  initialComments,
  postId,
  user,
}: CommentsProps) {
  const [state, reduceFn] = useOptimistic<
    OptimisticCommentType[],
    OptimisticCommentType
  >(initialComments, (previousState, payload) => [payload, ...previousState]);
  const { register, handleSubmit, setValue } = useForm<CommentType>();
  const onSubmit = async (data: CommentType) => {
    reduceFn({
      id: Date.now(),
      payload: data.comment,
      created_at: new Date(),
      user: {
        username: user?.username ?? "Undefined",
        avatar: user?.avatar ?? null,
      },
    });
    await addingComment(data, postId);
    setValue("comment", "");
  };
  return (
    <>
      <div className="flex flex-col gap-3 p-5">
        <div>댓글 {state.length}</div>
        <div className="flex flex-col">
          {state.map((comment) => (
            <div key={comment.id} className="flex flex-col mb-2">
              <div className="flex items-start gap-3 mb-2">
                {comment.user.avatar !== null ? (
                  <Image
                    width={28}
                    height={28}
                    alt={comment.user.username}
                    src={comment.user.avatar}
                    className="size-7 rounded-full mt-2"
                    unoptimized
                  />
                ) : (
                  <UserIcon className="size-7 rounded-full mt-2" />
                )}
                <div>
                  <span className="text-sm font-semibold">
                    {comment.user.username}
                  </span>
                  <div className="text-xs">
                    <span>
                      {formatToTimeAgo(comment.created_at.toString())}
                    </span>
                  </div>
                  <div>
                    <span>{comment.payload}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 p-5"
      >
        <Input
          {...register("comment")}
          placeholder="Write your comment..."
          type="text"
          minLength={1}
        />
      </form>
    </>
  );
}
