export default function Loading() {
  return (
    <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm left-0 top-0">
      <div className="max-w-screen-sm h-1/2 flex  justify-center w-full">
        <div className="aspect-square bg-neutral-700 text-neutral-200 rounded-md flex animate-pulse"></div>
      </div>
    </div>
  );
}
