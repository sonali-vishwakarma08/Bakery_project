/* eslint-disable no-unused-vars */
import { motion as m, AnimatePresence } from "framer-motion";

export default function CommonModal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <m.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.35 }}
            className={`w-full ${sizes[size]} bg-white rounded-lg shadow-2xl my-auto max-h-[85vh] flex flex-col`}
          >
            {/* Header — only show if title is provided */}
            {title && (
              <div className="flex justify-between items-center px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white flex-shrink-0">
                <h2 className="text-base font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 text-2xl leading-none transition-all"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Content - Scrollable */}
            <div className="p-4 overflow-y-auto flex-1">{children}</div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
