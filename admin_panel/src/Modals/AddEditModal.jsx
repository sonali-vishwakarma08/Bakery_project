import { useEffect, useState } from "react";
import CommonModal from "./CommonModal";

export default function AddEditModal({
  isOpen,
  onClose,
  onSave,
  title,
  fields = [],
  data = {},
}) {
  const [preview, setPreview] = useState(null); // ✅ for image preview

  useEffect(() => {
    // show existing image if editing
    if (data?.image) {
      // Check if it's already a full URL or just a path
      const imageUrl = data.image.startsWith('http') 
        ? data.image 
        : `http://localhost:5000${data.image}`;
      setPreview(imageUrl);
    } else {
      setPreview(null);
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Convert form entries to object (except file)
    const dataObj = {};
    formData.forEach((value, key) => {
      dataObj[key] = value;
    });

    // ✅ Pass both file + text data
    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0]) {
      dataObj[fileInput.name] = fileInput.files[0];
    }

    onSave(dataObj);
  };

  // ✅ Handle file input preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  // ✅ Reset preview on close
  const handleClose = () => {
    setPreview(null);
    onClose();
  };

  return (
    <CommonModal isOpen={isOpen} onClose={handleClose} title={title} size="md">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3"
        encType="multipart/form-data"
      >
        {fields.map((field, index) => (
          <div key={index} className="col-span-1">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {/* ✅ Handle textarea */}
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                defaultValue={data?.[field.name] || ""}
                rows="2"
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:ring-1 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all"
              />
            ) : field.type === "select" ? (
              <div className="relative">
                <select
                  name={field.name}
                  defaultValue={data?.[field.name] || ""}
                  required={field.required}
                  className="w-full appearance-none border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm text-gray-700 bg-white hover:border-pink-400 focus:ring-1 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled className="text-gray-400">
                    Select {field.label}
                  </option>
                  {field.options?.map((opt, i) => (
                    <option key={i} value={opt.value} className="text-gray-700">
                      {opt.label}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ) : field.type === "file" ? (
              <>
                <input
                  type="file"
                  name={field.name}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:ring-1 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all"
                />
                {/* ✅ Image Preview */}
                {preview && (
                  <div className="mt-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-md border border-gray-200"
                    />
                  </div>
                )}
              </>
            ) : (
              <input
                name={field.name}
                defaultValue={data?.[field.name] || ""}
                type={field.type || "text"}
                required={field.required}
                placeholder={field.placeholder || ""}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:ring-1 focus:ring-pink-400 focus:border-pink-400 outline-none transition-all"
              />
            )}
          </div>
        ))}

        {/* ✅ Buttons */}
        <div className="col-span-1 flex justify-end gap-2 pt-3 border-t mt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 bg-pink-500 text-white text-sm rounded-md shadow hover:bg-pink-600 transition-all"
          >
            Save
          </button>
        </div>
      </form>
    </CommonModal>
  );
}
