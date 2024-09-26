import React from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => {
            currentPage !== i ? onPageChange(i) : null;
          }}
          className={`rounded-md px-3 py-1 ${
            currentPage === i
              ? "cursor-default bg-primary text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>,
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
      <div className="text-sm">
        Showing{" "}
        <strong>
          {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
        </strong>{" "}
        to <strong>{Math.min(currentPage * itemsPerPage, totalItems)}</strong>{" "}
        of <strong>{totalItems}</strong> result(s)
      </div>

      {/* Wrap this part in a responsive div */}
      <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="rounded-md bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Pagination controls go here */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-md bg-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>

          <div className="flex space-x-1">{renderPageNumbers()}</div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-md bg-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
