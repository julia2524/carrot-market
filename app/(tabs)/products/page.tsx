import ListProduct from "@/components/list-product";
import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/16/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;
export default async function Products() {
  const initialProducts = await getInitialProducts();

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <div className="fixed w-full bottom-24 mx-auto max-w-screen-md grid grid-cols-5 px-5">
        <div className="col-start-5 flex items-center justify-center">
          <Link
            href="/products/add"
            className="bg-orange-500 flex items-center justify-center rounded-full size-16 text-white"
          >
            <PlusIcon className="size-10" />
          </Link>
        </div>
      </div>
    </div>
  );
}
