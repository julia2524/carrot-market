"use client";

import { useFormState } from "react-dom";
import { postForm } from "./actions";
import Input from "@/components/input";
import Button from "@/components/button";

export default function AddPosts() {
  const [state, action] = useFormState(postForm, null);
  return (
    <form className="p-5 flex flex-col gap-3" action={action}>
      <Input
        name="title"
        required
        placeholder="Title"
        errors={state?.fieldErrors?.title}
      />
      <Input
        name="description"
        required
        placeholder="Description"
        errors={state?.fieldErrors?.title}
      />
      <Button text="Create post" />
    </form>
  );
}
