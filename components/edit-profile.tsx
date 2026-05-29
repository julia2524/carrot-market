"use client";
import Input from "@/components/input";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfile } from "@/app/(tabs)/profile/[id]/edit/actions";
import Button from "./button";
import {
  profileClientSchema,
  ProfileType,
} from "@/app/(tabs)/profile/[id]/edit/schema";
import EditAvatarForm from "./edit-avatar-form";

interface EditProfileProps {
  username: string;
  photo?: string | null;
}

export default function EditProfileForm({ username, photo }: EditProfileProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ProfileType>({
    resolver: zodResolver(profileClientSchema) as Resolver<ProfileType>,
    defaultValues: {
      username,
    },
  });

  const [preview, setPreview] = useState(photo ?? "");
  const [file, setFile] = useState<File | null>(null);

  const onValid = async (data: ProfileType) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("confirm_password", data.confirm_password);
    if (file) {
      formData.append("photo", file);
    }
    const result = await editProfile(formData);
    if (result && "fieldErrors" in result) {
      if (result.fieldErrors.username) {
        setError("username", { message: result.fieldErrors.username[0] });
      }
      if (result.fieldErrors.password) {
        setError("password", { message: result.fieldErrors.password[0] });
      }
      if (result.fieldErrors.confirm_password) {
        setError("confirm_password", {
          message: result.fieldErrors.confirm_password[0],
        });
      }
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onValid, (errors) => console.log(errors))}
      className="p-5 flex flex-col gap-12"
    >
      <EditAvatarForm
        preview={preview}
        setPreview={setPreview}
        setFile={setFile}
      />
      <div className="flex flex-col gap-3">
        <Input
          {...register("username")}
          required
          placeholder="닉네임"
          type="text"
          errors={[errors.username?.message ?? ""]}
        />
        <Input
          {...register("password")}
          required
          type="password"
          placeholder="비밀번호"
          errors={[errors.password?.message ?? ""]}
        />
        <Input
          {...register("confirm_password")}
          required
          type="password"
          placeholder="비밀번호 확인"
          errors={[errors.confirm_password?.message ?? ""]}
        />
        <Button text="변경 완료" />
      </div>
    </form>
  );
}
