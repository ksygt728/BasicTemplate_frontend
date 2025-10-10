"use client";

import React from "react";
import { createPortal } from "react-dom";

interface FilterDropdownProps {
  isOpen: boolean;
  position: { x: number; y: number };
  columnKey: string;
  searchTerm: string;
  selectedFilters: string[];
  availableValues: string[];
  onSearchChange: (searchTerm: string) => void;
  onFilterToggle: (value: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onClose: () => void;
}

export default function FilterDropdown({
  isOpen,
  position,
  columnKey,
  searchTerm,
  selectedFilters,
  availableValues,
  onSearchChange,
  onFilterToggle,
  onSelectAll,
  onClearAll,
  onClose,
}: FilterDropdownProps) {
  if (!isOpen) return null;

  const filteredValues = availableValues.filter((value) =>
    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllSelected =
    selectedFilters.length === filteredValues.length &&
    filteredValues.length > 0;

  return createPortal(
    <div
      className="filter-dropdown filter-menu-content fixed bg-white rounded-md shadow-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      style={{
        width: "256px",
        zIndex: 999999,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="filter-menu-content p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="filter-search-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelectAll();
              }}
              className="text-xs text-green-600 hover:text-green-800 whitespace-nowrap"
            >
              {isAllSelected ? "Unselect All" : "Select All"}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClearAll();
              }}
              className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* 옵션 리스트 */}
        <div className="max-h-48 overflow-y-auto">
          {filteredValues.length === 0 ? (
            <div className="py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              No options found
            </div>
          ) : (
            filteredValues.map((value: any) => (
              <label
                key={value}
                className="filter-checkbox-item flex items-center py-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded px-2"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(value)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onFilterToggle(value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="filter-checkbox rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <span className="text-xs text-gray-700 dark:text-gray-200 truncate">
                  {value}
                </span>
              </label>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
