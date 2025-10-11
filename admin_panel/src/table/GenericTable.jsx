import React, { useState, useMemo } from "react";
import { Eye, Pencil, Trash2, Plus, Search } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const totalPages = total && pageSize ? Math.ceil(total / pageSize) : 1;

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((row) => {
      return columns.some((col) => {
        // Get the value from the row
        let value;
        if (col.accessor.includes('.')) {
          // Handle nested properties like "category.name"
          const keys = col.accessor.split('.');
          value = keys.reduce((obj, key) => obj?.[key], row);
        } else {
          value = row[col.accessor];
        }
        
        // Convert value to string and check if it includes the search query
        return value?.toString().toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, columns]);

  return (
    <div className="w-full">
      {/* ===== Header (Title + Search + Add Button) ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex items-center gap-3 flex-1">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
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
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
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
