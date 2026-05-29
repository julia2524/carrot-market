"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ProductImageForm from "./product-image-form";
import { uploadProduct } from "@/app/add/actions";
import { productClientSchema, ProductType } from "@/app/add/schema";

interface ProductFormProps {
  title: string;
  description: string;
  price: number;
  photo?: string;
}
export default function ProductForm({
  title,
  description,
  price,
  photo,
}: ProductFormProps) {
  const [preview, setPreview] = useState(photo ?? "");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productClientSchema) as Resolver<ProductType>,
    defaultValues: {
      title,
      description,
      price,
    },
  });

  // const onValid = async (data: ProductType) => {
  //   if (!file) {
  //     alert("사진을 추가해주세요!");
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("title", data.title);
  //   formData.append("price", data.price.toString());
  //   formData.append("description", data.description);
  //   formData.append("photo", file);

  //   return uploadProduct(formData);
  // };
  const action = async (formData: FormData) => {
    const file = formData.get("photo");
    if (!file || (file as File).size === 0) {
      alert("사진을 추가해주세요!");
      return;
    }
    console.log(formData.get("title"));
    await uploadProduct(formData);
  };
  return (
    // <form
    //   onSubmit={handleSubmit(onValid, (errors) => console.log(errors))}
    //   className="p-5 flex flex-col gap-5"
    // >
    <form action={action} className="p-5 flex flex-col gap-5">
      <ProductImageForm
        preview={preview}
        setPreview={setPreview}
        setFile={setFile}
      />

      <Input
        {...register("title")}
        required
        placeholder="제목"
        type="text"
        errors={[errors.title?.message ?? ""]}
      />
      <Input
        {...register("price")}
        required
        type="number"
        placeholder="가격"
        errors={[errors.price?.message ?? ""]}
      />
      <Input
        {...register("description")}
        required
        type="text"
        placeholder="자세한 설명"
        errors={[errors.description?.message ?? ""]}
      />
      <Button text="작성 완료" />
    </form>
  );
}
