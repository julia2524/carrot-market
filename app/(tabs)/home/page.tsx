import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/16/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { unstable_cache as nextCache } from "next/cache";

const getCashedProducts = nextCache(getInitialProducts, ["home-products"], {
  revalidate: 60,
});

async function getInitialProducts() {
  const products = await db.product.findMany({
    where: {
      status: "FOR_SALE",
    },
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;
export const metadata = { title: "Home" };

export const revalidate = 60;

export default async function Products() {
  const initialProducts = await getCashedProducts();
  return (
    <div>
      <ProductList initialProducts={initialProducts} />

      <div className="fixed w-full bottom-24 mx-auto max-w-screen-md grid grid-cols-5 px-5 pointer-events-none">
        <div className="col-start-5 flex items-center justify-center">
          <Link
            href="/add"
            className="bg-orange-500 flex items-center justify-center rounded-full size-16 text-white pointer-events-auto"
          >
            <PlusIcon className="size-10" />
          </Link>
        </div>
      </div>
    </div>
  );
}
