"use client";

import { InitialStream } from "@/app/(tabs)/live/page";
import { useState } from "react";
import LiveStream from "./live-stream";

interface StreamListProps {
  initialStream: InitialStream;
}

export default function StreamList({ initialStream }: StreamListProps) {
  const [streams, setStreams] = useState(initialStream);
  return (
    <div className="p-5 flex flex-col gap-5">
      {streams.map((stream) => (
        <LiveStream key={stream.id} {...stream} />
      ))}
    </div>
  );
}
