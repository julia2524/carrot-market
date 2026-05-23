import { notFound } from "next/navigation";
import { getProduct } from "../queries";
import ProductForm from "@/components/product-form";

export default async function Edit({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  console.log(product);

  return (
    <ProductForm
      title={product.title}
      description={product.description}
      price={product.price}
      photo={product.photo}
    />
  );
}
