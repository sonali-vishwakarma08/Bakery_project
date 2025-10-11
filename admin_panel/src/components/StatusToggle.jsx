export default function StatusToggle({ status, onToggle, disabled = false }) {
  const isActive = status === "active";

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`
        px-3 py-1 rounded-full text-xs font-medium
        transition-all duration-200 ease-in-out
        ${isActive 
          ? "bg-green-100 text-green-700 hover:bg-green-200" 
          : "bg-red-100 text-red-700 hover:bg-red-200"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      {isActive ? "Active" : "Inactive"}
    </button>
  );
}
