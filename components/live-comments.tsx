"use client";
import { useOptimistic, useState } from "react";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/16/solid";
import { formatToTimeAgo } from "@/lib/utils";
import { useForm } from "react-hook-form";
import Input from "@/components/input";
import { InitialLiveComments } from "@/app/streams/[id]/page";
import { addingLiveComment } from "@/app/streams/[id]/actions";

interface CommentsProps {
  initialComments: InitialLiveComments;
  liveStreamId: number;
  user: {
    username: string;
    avatar: string | null;
  } | null;
}

export type LiveCommentType = {
  comment: string;
};

export default function LiveComments({
  initialComments,
  liveStreamId,
  user,
}: CommentsProps) {
  const [state, reduceFn] = useOptimistic(
    initialComments,
    (previousState, payload) => [payload, ...previousState]
  );
  const { register, handleSubmit, setValue } = useForm<LiveCommentType>();
  const onSubmit = async (data: LiveCommentType) => {
    reduceFn({
      id: Date.now(),
      payload: data.comment,
      created_at: new Date(),
      user: {
        username: user?.username ?? "Undefined",
        avatar: user?.avatar ?? null,
      },
    });
    await addingLiveComment(data, liveStreamId);
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
