"use client";

import React, { useState } from "react";

/**
 * @파일명 : SearchForm.tsx
 * @설명 : 공통 검색 폼 컴포넌트
 * @작성자 : 김승연
 * @작성일 : 2025.10.30
 */

// 검색 조건 옵션 타입
export interface SearchOption {
  label: string;
  value: string;
  type: "text" | "select" | "date" | "dateRange";
  options?: { label: string; value: string }[]; // select 타입일 때 사용
  placeholder?: string;
  required?: boolean;
}

// 검색 폼 props 타입
export interface SearchFormProps {
  searchOptions: SearchOption[];
  onSearch: (searchData: Record<string, any>) => void;
  loading?: boolean;
  className?: string;
  searchData?: Record<string, any>; // 외부에서 상태 제어 가능하도록 추가
  onSearchDataChange?: (searchData: Record<string, any>) => void; // 상태 변경 콜백 추가
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchOptions,
  onSearch,
  loading = false,
  className = "",
  searchData: externalSearchData,
  onSearchDataChange,
}) => {
  const [internalSearchData, setInternalSearchData] = useState<
    Record<string, any>
  >({});

  // 외부에서 상태를 제어하는 경우 외부 상태 사용, 아니면 내부 상태 사용
  const searchData =
    externalSearchData !== undefined ? externalSearchData : internalSearchData;
  const setSearchData = onSearchDataChange
    ? onSearchDataChange
    : setInternalSearchData;

  // 입력값 변경 핸들러
  const handleInputChange = (key: string, value: any) => {
    console.log("Input 변경:", key, value);
    const newData = {
      ...searchData,
      [key]: value,
    };
    setSearchData(newData);
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    onSearch(searchData);
  };

  // 초기화 버튼 클릭 핸들러
  const handleReset = () => {
    setSearchData({});
  };

  // 입력 필드 렌더링
  const renderField = (option: SearchOption) => {
    const { label, value, type, options, placeholder, required } = option;

    switch (type) {
      case "text":
        return (
          <input
            type="text"
            id={value}
            placeholder={placeholder || `${label}을(를) 입력하세요`}
            value={searchData[value] || ""}
            onChange={(e) => handleInputChange(value, e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            required={required}
          />
        );

      case "select":
        return (
          <select
            id={value}
            value={searchData[value] || ""}
            onChange={(e) => handleInputChange(value, e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required={required}
          >
            <option value="">
              {placeholder || `${label}을(를) 선택하세요`}
            </option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "date":
        return (
          <input
            type="date"
            id={value}
            value={searchData[value] || ""}
            onChange={(e) => handleInputChange(value, e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required={required}
          />
        );

      case "dateRange":
        return (
          <div className="flex space-x-2">
            <input
              type="date"
              id={`${value}_start`}
              value={searchData[`${value}_start`] || ""}
              onChange={(e) =>
                handleInputChange(`${value}_start`, e.target.value)
              }
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="시작일"
            />
            <span className="flex items-center text-gray-500 dark:text-gray-400">
              ~
            </span>
            <input
              type="date"
              id={`${value}_end`}
              value={searchData[`${value}_end`] || ""}
              onChange={(e) =>
                handleInputChange(`${value}_end`, e.target.value)
              }
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="종료일"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-gray-300 dark:border-gray-600 p-6 ${className}`}
    >
      <form id="search-form" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {searchOptions.map((option) => (
            <div key={option.value} className="space-y-2">
              <label
                htmlFor={option.value}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {option.label}
                {option.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              {renderField(option)}
            </div>
          ))}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-center space-x-3">
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                검색 중...
              </>
            ) : (
              <>
                <svg
                  className="mr-2 h-4 w-4"
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
                조회
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="inline-flex items-center px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            초기화
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
