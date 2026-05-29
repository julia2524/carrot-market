import { CameraIcon, UserIcon } from "@heroicons/react/24/solid";

interface ProductImageFormProps {
  preview: string;
  setPreview: (url: string) => void;
  setFile: (file: File | null) => void;
}
export default function EditAvatarForm({
  preview,
  setPreview,
  setFile,
}: ProductImageFormProps) {
  console.log(preview);
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const uploadFile = files[0];
    if (!uploadFile.type.startsWith("image/")) {
      alert("이미지 파일만 올려주세요! 📸");
      return;
    }
    const sizeInMB = uploadFile.size / (1024 * 1024);
    if (sizeInMB > 2) {
      alert("이미지 크기는 2MB를 넘을 수 없어요! 😅");
      return;
    }
    const url = URL.createObjectURL(uploadFile);
    setPreview(url);
    setFile(uploadFile);
  };

  return (
    <div className="size-28 flex flex-col itmes-center justify-center mx-auto relative">
      <label
        htmlFor="photo"
        className="border-2 flex flex-col aspect-square items-center justify-center text-neutral-300 bg-neutral-700 border-none rounded-full cursor-pointer bg-center bg-cover"
        style={{ backgroundImage: `url(${preview})` }}
      >
        {preview === "" ? (
          <>
            <UserIcon className="w-20" />
          </>
        ) : null}
        <div className="absolute bottom-0 -right-3 p-1.5 bg-neutral-400 rounded-full">
          <CameraIcon className="w-8  text-neutral-600 " />
        </div>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
          accept=".png, .jpg, .jpeg, .gif, .bmp"
        />
      </label>
    </div>
  );
}
