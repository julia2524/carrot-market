import { getProduct } from "@/app/products/[id]/queries";
import ExButton from "@/components/ex-button";
import {
  HeartIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Modal({ params }: { params: { id: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }

  return (
    <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm left-0 top-0">
      <ExButton />
      <div className="max-w-screen-sm h-1/2 flex  justify-center w-full">
        <div className="aspect-square bg-neutral-700 text-neutral-200 rounded-md flex">
          <div className="relative aspect-square w-full">
            <Image fill src={product.photo} alt={product.title} unoptimized />
            <div className="absolute w-full h-32 bottom-0 z-51 bg-black/80 text-white p-3 flex flex-col gap-2">
              <h1 className="text-white text-xl font-bold">{product.title}</h1>
              <span className="text-white text-lg font-extrabold">
                {product.price.toLocaleString()}원
              </span>
              <div className="flex gap-3 items-center">
                <HeartIcon className="size-7" />
                <OutlineChatIcon className="size-7" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
