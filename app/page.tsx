export default function Home() {
  return (
    <main className="bg-gray-100 h-screen flex items-center justify-center p-5">
      <div className="bg-white w-full max-w-screen-sm p-5 shadow-lg rounded-2xl flex flex-col gap-2 md:flex-row md:items-start">
        <div className="flex flex-col w-full ">
          <input
            className="w-full rounded-full h-10 outline-none bg-gray-200 pl-5 ring ring-transparent focus:ring-green-500 focus:ring-offset-2 transition-shadow invalid:focus:ring-red-500 peer"
            type="email"
            required
            placeholder="Email address here..."
          />
          <span className="text-red-500 font-medium hidden peer-invalid:block mt-1">
            Email is required.
          </span>
        </div>
        <button className="bg-black text-white py-2 outline-none rounded-full active:scale-90 transition-transform font-medium  md:px-8 ">
          Search
        </button>
      </div>
    </main>
  );
}
