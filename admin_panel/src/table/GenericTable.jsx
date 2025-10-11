import React, { useState, useMemo } from "react";
import { Eye, Pencil, Trash2, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function GenericTable({
  title = "Table",
  columns = [],
  data = [],
  onRowClick,
  onAdd,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when search query or items per page changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

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
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
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
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3 text-sm text-gray-600">
          {/* Left side - Items per page selector */}
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          {/* Center - Page info */}
          <div className="text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
          </div>

          {/* Right side - Page navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 transition"
              title="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            
            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md border transition ${
                      currentPage === pageNum
                        ? "bg-pink-500 text-white border-pink-500"
                        : "border-gray-300 hover:bg-pink-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 transition"
              title="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
