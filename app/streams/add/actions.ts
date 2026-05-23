"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import z from "zod";

const schema = z.object({
  title: z.string(),
});

export async function startStream(_: any, formData: FormData) {
  const data = {
    title: formData.get("title"),
  };
  const results = schema.safeParse(data);
  if (!results.success) {
    const flatten = z.flattenError(results.error);
    return { fieldErrors: flatten.fieldErrors };
  }
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY_STREAM}`,
      },
      body: JSON.stringify({
        meta: {
          name: results.data.title,
        },
        recording: {
          mode: "automatic",
        },
      }),
    }
  );
  const json = await response.json();
  const session = await getSession();
  const stream = await db.liveStream.create({
    data: {
      title: results.data.title,
      stream_id: json.result.uid,
      stream_key: json.result.rtmps.streamKey,
      userId: session.id!,
    },
    select: {
      id: true,
    },
  });
  redirect(`/streams/${stream.id}`);
}

export async function deleteStream(streamId: number) {
  const session = await getSession();
  const stream = await db.liveStream.findUnique({
    where: {
      id: streamId,
    },
    select: {
      stream_id: true,
      userId: true,
    },
  });

  if (!stream) {
    throw new Error("Stream not found");
  }
  if (stream.userId !== session.id) {
    throw new Error("Not authorized");
  }
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs/${stream?.stream_id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY_STREAM}`,
      },
    }
  );

  const json = await response.json();
  console.log(json);
  if (!response.ok) {
    throw new Error("Cloudflare delete failed");
  }

  await db.liveStream.delete({
    where: {
      id: streamId,
    },
  });
  redirect(`/live`);
}
