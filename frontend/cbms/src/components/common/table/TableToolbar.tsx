"use client";

import React from "react";

interface TableToolbarProps {
  recordCount: number;
  subTitle?: string;
  description?: string;
}

export default function TableToolbar({
  recordCount,
  subTitle,
  description,
}: TableToolbarProps) {
  return (
    <>
      <div className="sm:flex sm:items-center sm:justify-between mb-6 mt-5">
        <div>
          <div className="flex items-center gap-x-3">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              {subTitle}
            </h2>
            <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
              {recordCount} rows
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </>
  );
}
