"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";
import { LoginSession } from "../github/complete/route";
const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone format",
  );

// async function tokenExists(token: number) {
//   const exists = await db.sMSToken.findUnique({
//     where: {
//       token: token.toString(),
//     },
//     select: {
//       id: true,
//     },
//   });
//   return Boolean(exists);
// }
const tokenSchema = z.coerce.number().min(100000).max(999999);
const formSchema = z
  .object({
    phone: phoneSchema,
    token: tokenSchema,
  })
  .superRefine(async ({ phone, token }, ctx) => {
    const exist = await db.sMSToken.findFirst({
      where: {
        token: token.toString(),
        user: {
          phone,
        },
      },
    });
    if (!exist) {
      ctx.addIssue({
        code: "custom",
        message: "This token and this phone number do not exist.",
        path: ["token"],
      });
    }
  });

interface ActionState {
  token: boolean;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  const data = {
    phone,
    token,
  };
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: z.flattenError(result.error),
      };
    } else {
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      return {
        token: true,
      };
    }
  } else {
    const result = await formSchema.safeParseAsync(data);
    // const result = await tokenSchema.safeParseAsync(token);
    if (!result.success) {
      return {
        token: true,
        error: z.flattenError(result.error),
      };
    } else {
      const token = await db.sMSToken.findFirst({
        where: {
          token: result.data.token.toString(),
          user: {
            phone: result.data.phone,
          },
        },
        select: {
          id: true,
          userId: true,
        },
      });

      await LoginSession(token!.userId);
      await db.sMSToken.delete({
        where: {
          id: token!.id,
        },
      });

      redirect("/profile");
    }
  }
}
