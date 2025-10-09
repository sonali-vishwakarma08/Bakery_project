import { Calendar } from "lucide-react";

export default function BakeryHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-semibold text-pink-600">
          Bakery Dashboard 🍰
        </h2>
        <p className="text-gray-500 text-sm">
          Here’s your bakery’s sales summary for the selected period
        </p>
      </div>

      <button className="flex items-center gap-2 bg-white text-pink-600 border border-pink-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-50">
        <Calendar size={16} />
        Filter Period
        <span className="text-gray-500 text-xs">1–31 Oct 2025</span>
      </button>
    </div>
  );
}
