export default function Pagination() {
  return (
    <div className="flex justify-center mt-6 gap-2 text-sm">
      {[1, 2, 3, 4].map((n) => (
        <button
          key={n}
          className={`w-8 h-8 rounded-full ${
            n === 1
              ? "bg-pink-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
