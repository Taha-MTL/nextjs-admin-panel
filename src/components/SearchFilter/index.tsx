import React from 'react';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filter: string) => void;
  onSortChange: (sort: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onFilter, onSortChange }) => {
  return (
    <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="relative">
        <input
          type="text"
          placeholder="Search receipts..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-md border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-dark-3 dark:bg-gray-dark"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-body dark:text-bodydark" />
      </div>
      <div className="flex space-x-4">
        <select
          onChange={(e) => onFilter(e.target.value)}
          className="rounded-md border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-dark-3 dark:bg-gray-dark"
        >
          <option value="">All</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <select
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-md border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-dark-3 dark:bg-gray-dark"
        >
          <option value="date_desc">Date (Newest)</option>
          <option value="date_asc">Date (Oldest)</option>
          <option value="amount_desc">Amount (High to Low)</option>
          <option value="amount_asc">Amount (Low to High)</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;