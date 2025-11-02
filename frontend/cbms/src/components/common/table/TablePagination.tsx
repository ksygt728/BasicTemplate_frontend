"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export default function TablePagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onItemsPerPageChange,
}: TablePaginationProps) {
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPageSizeOpen &&
        pageSizeRef.current &&
        !pageSizeRef.current.contains(event.target as Node)
      ) {
        setIsPageSizeOpen(false);
      }
    };

    if (isPageSizeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isPageSizeOpen]);

  // 페이지 번호 생성 (10개씩 표시)
  const generatePageNumbers = () => {
    const pages = [];
    const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
    const endPageCalc = Math.min(startPage + 9, totalPages);

    for (let i = startPage; i <= endPageCalc; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="mt-6 sm:flex sm:items-center sm:justify-between">
      <div className="flex items-center gap-x-4">
        <div ref={pageSizeRef} className="relative">
          <button
            onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
            className="flex items-center justify-center px-4 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 cursor-pointer"
          >
            {itemsPerPage} page size
            <svg
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                isPageSizeOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isPageSizeOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 z-50">
              <div className="py-1">
                {[10, 50, 100, 300, 500, 1000].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      onItemsPerPageChange(size);
                      setIsPageSizeOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {size} page size
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Page{" "}
          <span className="font-medium text-gray-700 dark:text-gray-100">
            {currentPage} of {totalPages}
          </span>{" "}
          (Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
          {totalItems} records)
        </div>
      </div>

      <div className="flex items-center mt-4 gap-x-2 sm:mt-0">
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) onPageChange(currentPage - 1);
          }}
          className={`flex items-center justify-center px-3 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>
          <span>Previous</span>
        </Link>

        {/* 페이지 번호들 */}
        <div className="flex items-center gap-x-1">
          {generatePageNumbers().map((pageNum) => (
            <Link
              key={pageNum}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(pageNum);
              }}
              className={`flex items-center justify-center w-8 h-8 text-sm transition-colors duration-200 border rounded ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
              }`}
            >
              {pageNum}
            </Link>
          ))}
        </div>

        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < totalPages) onPageChange(currentPage + 1);
          }}
          className={`flex items-center justify-center px-3 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
