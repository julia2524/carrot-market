import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCachedProductTitle, getIsOwner, getProduct } from "./queries";
import { createChatRoom, deleteProduct } from "./actions";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);
  const deleteProductWithId = deleteProduct.bind(null, product.id);
  const createChatRoomWithId = createChatRoom.bind(
    null,
    product.userId,
    product.id
  );

  return (
    <div>
      <div className="relative aspect-square">
        <Image fill src={product.photo} alt={product.title} unoptimized />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full relative">
          {product.user.avatar !== null ? (
            <Image
              alt={product.title}
              src={product.user.avatar}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full left-0 right-0 bottom-0 mx-auto max-w-screen-sm p-5 pb-10 bg-neutral-800 flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <>
            <form action={deleteProductWithId}>
              <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                Delete product
              </button>
            </form>
            <Link
              href={`/products/${product.id}/edit`}
              className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold"
            >
              Edit product
            </Link>
          </>
        ) : null}

        <form action={isOwner ? "/chat" : createChatRoomWithId}>
          <button className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
            {isOwner ? `대화중인 채팅` : "채팅하기"}
          </button>
        </form>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: { id: true },
  });
  return products.map((product) => ({ id: String(product.id) }));
}
