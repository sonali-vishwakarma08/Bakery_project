import CommonModal from "./CommonModal";

export default function AddEditModal({
  isOpen,
  onClose,
  onSave,
  title,
  fields = [],
  data = {},
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    onSave(formData);
  };

  return (
    <CommonModal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              name={field.name}
              defaultValue={data?.[field.name] || ""}
              type={field.type || "text"}
              required={field.required}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all"
            />
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition-all"
          >
            Save
          </button>
        </div>
      </form>
    </CommonModal>
  );
}
