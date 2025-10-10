import { Star, BarChart2 } from "lucide-react";

export default function BakeryItemCard({ item }) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-200 h-auto sm:h-[100px] gap-3 sm:gap-0">
      {/* Left Side */}
      <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0"
        />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h4 className="font-semibold text-gray-800 text-sm truncate sm:w-[120px]">
            {item.name}
          </h4>
          <p className="text-gray-500 text-xs flex items-center justify-center sm:justify-start gap-1">
            <BarChart2 size={12} className="text-pink-500" />
            {item.sales.toLocaleString()} Sales
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                className={
                  i < Math.floor(item.rating)
                    ? "text-yellow-500"
                    : "text-gray-400"
                }
              />
            ))}
            <span className="text-gray-400 text-[10px] ml-1">
              ({item.rating})
            </span>
          </div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="relative flex-shrink-0">
        <svg
          className="mx-auto sm:mx-0 w-10 h-10 sm:w-12 sm:h-12 md:w-[45px] md:h-[45px]"
          viewBox="0 0 36 36"
        >
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
            fill="none"
            stroke="#F472B6"
            strokeWidth="3"
            strokeDasharray={`${item.progress}, 100`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] sm:text-[12px] font-semibold text-pink-500">
          {item.progress}%
        </span>
      </div>
    </div>
  );
}
