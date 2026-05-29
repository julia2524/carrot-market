import { notFound } from "next/navigation";
import { getUser } from "../../actions";
import EditProfileForm from "@/components/edit-profile";

export default async function Edit({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const user = await getUser();
  if (!user) {
    return notFound();
  }

  return (
    <div className="flex flex-col py-8 px-6">
      <div className="flex flex-col *:font-medium gap-2">
        <h1 className="text-2xl text-center">프로필 수정 </h1>
        <EditProfileForm username={user.username} photo={user.avatar} />
      </div>
    </div>
  );
}
