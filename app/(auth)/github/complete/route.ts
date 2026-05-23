import db from "@/lib/db";
import { getAccessToken, getGithubEmail, getGithubProfile } from "@/lib/github";
import { LoginSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

interface IGithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  const { error, access_token } = await getAccessToken(code);
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  const userEmailsJson = await getGithubEmail(access_token);
  const primaryEmail = userEmailsJson.find(
    (email: IGithubEmail) => email.primary && email.verified,
  );
  console.log(primaryEmail?.email);

  const { login, id, avatar_url } = await getGithubProfile(access_token);
  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });
  if (user) {
    await LoginSession(user.id);
    return redirect("/profile");
  }
  const existingUserByUsername = await db.user.findUnique({
    where: {
      username: login,
    },
    select: {
      id: true,
    },
  });
  const finalUsername = existingUserByUsername
    ? `${login}-gh-${id.toString().slice(0, 3)}`
    : login;

  const newUser = await db.user.create({
    data: {
      username: finalUsername,
      github_id: id + "",
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });
  await LoginSession(newUser.id);
  return redirect("/profile");
}
