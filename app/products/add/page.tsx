"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { uploadProduct } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productClientSchema, ProductType } from "./schema";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productClientSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 올려주세요! 📸");
      return;
    }
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 2) {
      alert("이미지 크기는 2MB를 넘을 수 없어요! 😅");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
  };
  const onValid = async (data: ProductType) => {
    if (!file) {
      alert("사진을 추가해주세요!");
      return;
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price.toString());
    formData.append("description", data.description);
    formData.append("photo", file);
    console.log(formData);
    return uploadProduct(formData);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onValid, (errors) => console.log(errors))}
        className="p-5 flex flex-col gap-5"
      >
        <label
          htmlFor="photo"
          className="border-2 flex flex-col aspect-square items-center justify-center text-neutral-300 border-neutral-300 border-dashed rounded-md cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {errors.photo?.message}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
          accept=".png, .jpg, .jpeg, .gif, .bmp"
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
    </div>
  );
}
