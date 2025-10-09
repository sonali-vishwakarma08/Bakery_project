import { Star, BarChart2 } from "lucide-react";

export default function FavoriteItemCard({ item }) {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition-all duration-200 w-full h-full min-h-[95px] box-border">
      {/* Left Section */}
      <div className="flex items-center gap-2 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 rounded-md object-cover flex-shrink-0"
        />
        <div className="min-w-0">
          <h4 className="font-medium text-gray-800 text-[13px] truncate">
            {item.name}
          </h4>
          <p className="text-gray-500 text-[11px] flex items-center gap-1">
            <BarChart2 size={10} className="text-pink-400 flex-shrink-0" />
            {item.sales.toLocaleString()} Sales
          </p>
          <div className="flex items-center gap-0.5 mt-1 text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={9}
                className={
                  i < Math.floor(item.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
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
        <svg width="30" height="30" viewBox="0 0 36 36">
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
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-pink-500">
          {item.progress}%
        </span>
      </div>
    </div>
  );
}
