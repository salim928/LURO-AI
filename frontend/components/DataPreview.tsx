'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface DataPreviewProps {
  data: any[];
  columns: string[];
  maxRows?: number;
}

export default function DataPreview({ data, columns, maxRows = 10 }: DataPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  
  const rowsPerPage = 5;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startRow = currentPage * rowsPerPage;
  const endRow = Math.min(startRow + rowsPerPage, data.length);
  const currentData = data.slice(startRow, endRow);
  
  const visibleColumns = columns.filter(col => !hiddenColumns.has(col));

  const toggleColumn = (column: string) => {
    const newHidden = new Set(hiddenColumns);
    if (newHidden.has(column)) {
      newHidden.delete(column);
    } else {
      newHidden.add(column);
    }
    setHiddenColumns(newHidden);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
        <div className="text-sm text-gray-600">
          Showing {startRow + 1}-{endRow} of {data.length} rows
        </div>
      </div>

      {/* Column Visibility Controls */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Toggle Columns:</p>
        <div className="flex flex-wrap gap-2">
          {columns.map(column => (
            <button
              key={column}
              onClick={() => toggleColumn(column)}
              className={`text-xs px-2 py-1 rounded-full border flex items-center space-x-1 ${
                hiddenColumns.has(column)
                  ? 'bg-gray-100 text-gray-500 border-gray-300'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {hiddenColumns.has(column) ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{column}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns.map(column => (
                <th
                  key={column}
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {visibleColumns.map(column => (
                  <td key={column} className="px-3 py-2 text-sm text-gray-900">
                    {typeof row[column] === 'number' 
                      ? row[column].toLocaleString() 
                      : String(row[column] || '-')
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2 py-1 text-sm rounded ${
                    currentPage === pageNum
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}