"use client";

import { InitialProducts } from "@/app/(tabs)/home/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/home/actions";

interface ProductListProps {
  initialProducts: InitialProducts;
}
export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(products.length);
          if (newProducts.length !== 0) {
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
          console.log(newProducts);
        }
      },
      {
        threshold: 0.1,
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [isLoading, products.length]);
  return (
    <div className="p-5 flex flex-col gap-5 pb-40">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {!isLastPage ? (
        <span
          ref={trigger}
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "Loading..." : "Load more"}
        </span>
      ) : null}
    </div>
  );
}
