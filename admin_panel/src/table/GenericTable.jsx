import React from "react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

export default function GenericTable({
  title = "Table",
  columns = [],
  data = [],
  onRowClick,
  onAdd, // 👈 new prop
  onView,
  onEdit,
  onDelete,
  showActions = true,
  page = 1,
  pageSize,
  total,
  onPageChange,
}) {
  const totalPages = total && pageSize ? Math.ceil(total / pageSize) : 1;

  return (
    <div className="w-full">
      {/* ===== Header (Title + Add Button) ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white rounded-md text-sm shadow transition-all"
          >
            <Plus size={16} /> Add {title.slice(0, -1)}
          </button>
        )}
      </div>

      {/* ===== Table ===== */}
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-pink-50 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-3 sm:px-4 py-3 border-b border-gray-200">
                  {col.header}
                </th>
              ))}
              {showActions && (
                <th className="px-3 sm:px-4 py-3 border-b border-gray-200 text-center">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-pink-50 transition cursor-pointer"
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col, j) => (
                    <td
                      key={j}
                      className="px-3 sm:px-4 py-3 border-b border-gray-100 text-gray-700"
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-3 sm:px-4 py-3 border-b border-gray-100 text-center">
                      <div className="flex justify-center gap-3 text-gray-600">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView && onView(row);
                          }}
                          className="hover:text-blue-500"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit && onEdit(row);
                          }}
                          className="hover:text-green-500"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete && onDelete(row);
                          }}
                          className="hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={showActions ? columns.length + 1 : columns.length}
                  className="text-center py-6 text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-pink-50"
            >
              Prev
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-pink-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
