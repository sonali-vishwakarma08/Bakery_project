import CommonModal from "./CommonModal";

export default function ViewModal({ isOpen, onClose, title, data = {} }) {
  return (
    <CommonModal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-5">
        {Object.keys(data).length === 0 ? (
          <p className="text-gray-500 text-center">No details available.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {Object.entries(data).map(([key, value], index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3"
              >
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {key.replace(/_/g, " ")}
                </span>
                <span className="text-sm text-gray-800 font-semibold">
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </CommonModal>
  );
}
