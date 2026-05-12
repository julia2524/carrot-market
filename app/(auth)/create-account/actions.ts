"use server";
import bcrypt from "bcrypt";
import { PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import { z } from "zod";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { LoginSession } from "../github/complete/route";

const checkUsername = (username: string) => !username.includes("potato");

const formSchema = z
  .object({
    username: z
      .string({
        error: (issue) => {
          if (issue.input === undefined) return "Where is my username???";
          return "Username must be a string!";
        },
      })
      .trim()
      .toLowerCase()
      .refine(checkUsername, "No potatos allowed!"),
    email: z.email().toLowerCase(),
    password: z.string().regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string(),
  })
  .superRefine(async ({ username, email, password, confirm_password }, ctx) => {
    const existingUser = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (existingUser) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken.",
        path: ["username"],
        fatal: true,
      });
      return;
    }
    const existingEmail = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (existingEmail) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken.",
        path: ["email"],
        fatal: true,
      });
      return;
    }
    if (password !== confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "Both password should be the same!",
        path: ["confirm_password"],
      });
    }
  });
export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    const flatten = z.flattenError(result.error);
    return { fieldErrors: flatten.fieldErrors };
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    await LoginSession(user.id);
    redirect("/profile");
  }
}
