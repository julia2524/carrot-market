import Link from "next/link";
import "@/lib/db";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-4 *:font-medium">
        <span className="text-9xl">🥕</span>
        <h1 className="text-2xl">당신 근처의 당근</h1>
        <div className="flex flex-col items-center font-light">
          <h2>동네라서 가능한 모든 것</h2>
          <h2>지금 내 동네를 선택하고 시작해보세요!</h2>
        </div>
      </div>
      <div className="flex flex-col items-center gap-5 w-full">
        <Link href="/create-account" className="orange-btn">
          시작하기
        </Link>
        <div className="flex gap-1 *:text-sm">
          <span className="text-gray-500">이미 계정이 있나요?</span>
          <Link href="/login" className="hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
