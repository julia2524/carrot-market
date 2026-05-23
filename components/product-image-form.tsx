import { PhotoIcon } from "@heroicons/react/16/solid";

interface ProductImageFormProps {
  preview: string;
  setPreview: (url: string) => void;
  setFile: (file: File | null) => void;
}
export default function ProductImageForm({
  preview,
  setPreview,
  setFile,
}: ProductImageFormProps) {
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
    <label
      htmlFor="photo"
      className="border-2 flex flex-col aspect-square items-center justify-center text-neutral-300 border-neutral-300 border-dashed rounded-md cursor-pointer bg-center bg-cover"
      style={{ backgroundImage: `url(${preview})` }}
    >
      {preview === "" ? (
        <>
          <PhotoIcon className="w-20" />
          <div className="text-neutral-400 text-sm">사진을 추가해주세요.</div>
        </>
      ) : null}
      <input
        onChange={onImageChange}
        type="file"
        id="photo"
        name="photo"
        className="hidden"
        accept=".png, .jpg, .jpeg, .gif, .bmp"
      />
    </label>
  );
}
