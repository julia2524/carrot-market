import Room from "@/components/room";
import { getChatRooms } from "./actions";

export default async function Chat() {
  const chatRooms = await getChatRooms();
  console.dir(chatRooms, { depth: null });
  return (
    <div>
      {chatRooms?.map((room) => (
        <Room key={room.id} {...room} />
      ))}
    </div>
  );
}
