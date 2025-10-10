import CommonModal from "./CommonModal";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) {
  return (
    <CommonModal isOpen={isOpen} onClose={onClose} title="Delete Confirmation" size="sm">
      <div className="text-center space-y-1">
        <p className="text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">{itemName}</span>?
        </p>

        <div className="flex justify-center gap-3 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 shadow transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </CommonModal>
  );
}
