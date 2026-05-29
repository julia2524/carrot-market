import { PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import z from "zod";

export const profileClientSchema = z
  .object({
    username: z.string().min(1, "Username is required."),
    password: z.string().regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string(),
    photo: z.instanceof(File).optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirm_password"],
  });
export type ProfileType = z.infer<typeof profileClientSchema>;

export const profileServerSchema = z.object({});
