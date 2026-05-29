"use client";
import { updateProductStatus } from "@/app/chats/[id]/actions";
import { statusLabel } from "@/lib/constants";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductStatusProps {
  productPhoto: string;
  productId: number;
  productTitle: string;
  productStatus: string;
  productPrice: number;
  productOwner: boolean;
  chatRoomId: string;
}

export function ProductStatus({
  productPhoto,
  productId,
  productTitle,
  productStatus,
  productPrice,
  productOwner,
  chatRoomId,
}: ProductStatusProps) {
  const [status, setStatus] = useState(productStatus);
  const router = useRouter();
  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    await updateProductStatus(productId, newStatus, chatRoomId);

    if (newStatus === "SOLD") {
      router.refresh();
      router.push(`/chats/${chatRoomId}/review`);
    }
  };
  return (
    <div className="p-5 fixed top-0 bg-neutral-900 w-full max-w-screen-sm h-28 z-50">
      <div className="flex justify-between items-center">
        <Link href={`/products/${productId}`} className="flex gap-5 ">
          <div className="relative size-16 rounded-md overflow-hidden">
            <Image
              fill
              src={productPhoto}
              alt={productTitle}
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col gap-1 text-white">
            <div className="flex flex-row gap-3">
              <span className="">{productTitle}</span>
            </div>
            <span className="font-bold text-lg">
              {formatToWon(productPrice)}원
            </span>
          </div>
        </Link>

        <select
          disabled={!productOwner}
          value={status}
          onChange={onChange}
          style={{ WebkitAppearance: "none" }}
          className="bg-neutral-800 rounded-md font-bold p-2 border-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-white appearance-none"
        >
          <option value="FOR_SALE">판매중</option>
          <option value="RESERVED">예약중</option>
          <option value="SOLD">거래완료</option>
          {/* {statusLabel[productStatus as keyof typeof statusLabel]} */}
        </select>
      </div>
    </div>
  );
}
