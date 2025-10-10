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
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 "
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
            className={`w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl  overflow-hidden`}
          >
            {/* Header — only show if title is provided */}
            {title && (
              <div className="flex justify-between items-center px-4 py-6  bg-white">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-700 text-2xl leading-none transition-all"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Content */}
            <div className="p-5">{children}</div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
