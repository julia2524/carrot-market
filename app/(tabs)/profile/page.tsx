import getSession from "@/lib/session";
import { redirect } from "next/navigation";

import Link from "next/link";
import { getUser } from "./actions";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";
import Button from "@/components/button";

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div>
      <Link
        href={`/profile/${user.id}`}
        className="flex p-5 items-center rounded-2xl m-5 gap-4 bg-neutral-800"
      >
        <div className="flex items-center gap-3">
          <div className="relative size-14 flex bg-neutral-700 items-center justify-center rounded-full overflow-hidden shrink-0">
            {user.avatar !== null ? (
              <Image
                fill
                src={user.avatar}
                alt={user.username}
                className="object-cover"
                unoptimized
              />
            ) : (
              <UserIcon className="size-10 rounded-md text-neutral-500" />
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <div className="text-white text-xl font-semibold leading-none">
              {user.username}
            </div>
            <div className="rounded-full bg-orange-500/20 px-1.5 py-1 text-xs font-semibold leading-none">
              {user.score}℃
            </div>
          </div>
        </div>
      </Link>
      <form action={logOut} className="p-5">
        <Button text="Log Out" />
      </form>
    </div>
  );
}
