export default function Home() {
  return (
    <main className="bg-gray-100 h-screen flex items-center justify-center p-5 dark:bg-gray-900">
      <div className="bg-white w-full max-w-screen-sm p-5 shadow-lg rounded-2xl dark:bg-gray-800">
        <div className=" flex justify-between">
          <div className="flex flex-col">
            <span className="text-gray-600 font-bold text-lg leading-tight dark:text-gray-300">
              In transit
            </span>
            <span className="text-4xl font-extrabold dark:text-white">
              Coolblue
            </span>
          </div>
          <div className="size-16 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-extrabold text-center leading-none">
              cool blue
            </span>
          </div>
        </div>
        <div className="my-3 flex items-center gap-2">
          <span className="bg-green-400 text-white uppercase px-5 py-2 rounded-3xl font-black text-lg hover:bg-green-500 transition">
            TODAY
          </span>
          <span className="font-bold text-2xl dark:text-gray-100">
            9:30-10:30
          </span>
        </div>
        <div className="relative">
          <div className="bg-gray-200 w-full h-3 rounded-full absolute dark:bg-gray-700" />
          <div className="bg-green-400 w-2/3 h-3 rounded-full absolute" />
        </div>
        <div className="flex justify-between mt-7 text-gray-500 font-semibold text-lg dark:text-gray-300">
          <span>Expected</span>
          <span>Sorting center</span>
          <span>In transit</span>
          <span className="text-gray-300 dark:text-gray-500">Delivered</span>
        </div>
      </div>
    </main>
  );
}
