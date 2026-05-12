"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import SocailLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function Login() {
  const [state, dispatch] = useFormState(login, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="email"
          placeholder="Email"
          type="email"
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
        />
        <Button text="Login" />
      </form>
      <SocailLogin />
    </div>
  );
}
