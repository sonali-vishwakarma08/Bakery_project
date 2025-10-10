import { Calendar } from "lucide-react";

export default function BakeryHeader() {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 w-full">
      {/* Title + Description */}
      <div className="text-center md:text-left px-2 md:px-0">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-pink-600">
          Bakery Dashboard 🍰
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm max-w-[300px] md:max-w-none mx-auto md:mx-0">
          Here’s your bakery’s sales summary for the selected period
        </p>
      </div>

      {/* Filter Button */}
      <button
        className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 sm:gap-2
        bg-white text-pink-600 border border-pink-200
        px-4 sm:px-5 py-2.5 rounded-full
        text-[11px] sm:text-sm font-medium
        shadow-md hover:shadow-lg
        hover:bg-pink-50 transition-all duration-300
        w-full sm:w-auto mx-auto md:mx-0"
      >
        <div className="flex items-center gap-1 sm:gap-2">
          <Calendar
            size={16}
            className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-pink-600"
          />
          <span className="font-medium">Filter Period</span>
        </div>
        <span className="text-gray-500 text-[10px] sm:text-xs">
          1–31 Oct 2025
        </span>
      </button>
    </div>
  );
}
