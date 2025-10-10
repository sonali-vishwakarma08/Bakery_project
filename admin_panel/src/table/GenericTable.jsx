import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function GenericTable({
  columns = [],
  data = [],
  title = "Table",
  onRowClick,
  actions,
  page = 1,
  pageSize,
  total,
  onPageChange,
  showActions = true, // 👈 toggle if you want action column or not
  onView,
  onEdit,
  onDelete,
}) {
  const totalPages = total && pageSize ? Math.ceil(total / pageSize) : 1;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-pink-50 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-3 sm:px-4 py-3 border-b border-gray-200"
                >
                  {col.header}
                </th>
              ))}

              {/* Optional Action Header */}
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
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-3 sm:px-4 py-3 border-b border-gray-100 text-gray-700"
                    >
                      {col.render
                        ? col.render(row[col.accessor], row)
                        : row[col.accessor]}
                    </td>
                  ))}

                  {/* Action buttons */}
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
                  colSpan={
                    showActions ? columns.length + 1 : columns.length
                  }
                  className="text-center py-6 text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
