"use client";

import { InitialStream } from "@/app/(tabs)/live/page";
import LiveStream from "./live-stream";

interface StreamListProps {
  initialStream: InitialStream;
}

export default function StreamList({ initialStream }: StreamListProps) {
  return (
    <div className="p-5 flex flex-col gap-5">
      {initialStream.map((stream) => (
        <LiveStream key={stream.id} {...stream} />
      ))}
    </div>
  );
}
