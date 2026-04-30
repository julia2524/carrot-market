export default function Home() {
  return (
    <main className="bg-gray-100 h-screen flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-screen-sm p-5 shadow-lg rounded-2xl flex flex-col gap-3 ">
        {["Jane Cooler", "Leslie Alexander", "Eleanor Pena", "Nicolas"].map(
          (person, index) => (
            <div
              key={index}
              className="flex justify-between items-center group"
            >
              <div className="flex gap-3 items-center">
                <div className="size-7 bg-red-200 rounded-full" />
                <span className="group-hover:text-red-900">{person}</span>
                <div className="size-5 bg-red-500 rounded-full flex items-center justify-center relative">
                  <span className="text-white text-xs font-bold text-center z-10">
                    {index}
                  </span>
                  <div className="size-5 bg-red-500 rounded-full absolute animate-ping" />
                </div>
              </div>
              <div className="size-7 bg-gray-100 rounded-full flex items-center justify-center">
                <span className=" text-xs text-slate-900 text-center">❯</span>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}
