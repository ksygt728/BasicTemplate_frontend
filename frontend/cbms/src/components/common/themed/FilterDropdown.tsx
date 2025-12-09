/**
 * @파일명 : FilterDropdown.tsx
 * @설명 : 테이블 컬럼 필터링을 위한 드롭다운 컴포넌트 (테마 적용)
 * @작성일 : 2025.12.07
 * @기능 : 우클릭 필터 메뉴, 검색, Select All/Clear All, Portal
 */

"use client";

import React from "react";
import { createPortal } from "react-dom";
import { theme } from "@/styles/theme";

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

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
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
}) => {
  // BasicTableView와 동일한 방식 - 훅 없이 early return
  if (!isOpen) return null;

  const filteredValues = availableValues.filter((value) =>
    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllSelected =
    selectedFilters.length === filteredValues.length &&
    filteredValues.length > 0;

  return createPortal(
    <div
      className="filter-dropdown filter-menu-content"
      style={{
        position: "fixed",
        width: "280px",
        zIndex: 999999,
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: theme.colors.background.surface,
        border: `1px solid ${theme.colors.border.default}`,
        borderRadius: "8px",
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="filter-menu-content" style={{ padding: "16px" }}>
        {/* 검색창과 버튼 영역 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          {/* 검색 입력창 */}
          <div style={{ position: "relative", flex: 1 }}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "12px",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg
                style={{ width: "16px", height: "16px" }}
                fill="none"
                stroke={theme.colors.text.tertiary}
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
              className="filter-search-input"
              style={{
                display: "block",
                width: "100%",
                paddingLeft: "40px",
                paddingRight: "12px",
                paddingTop: "8px",
                paddingBottom: "8px",
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: "6px",
                fontSize: "13px",
                backgroundColor: theme.colors.background.default,
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily,
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  theme.colors.primary.default;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border.default;
              }}
            />
          </div>

          {/* 버튼 그룹 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              flexShrink: 0,
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelectAll();
              }}
              style={{
                fontSize: "12px",
                whiteSpace: "nowrap",
                color: theme.colors.status.success,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                transition: "opacity 0.2s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {isAllSelected ? "Unselect All" : "Select All"}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClearAll();
              }}
              style={{
                fontSize: "12px",
                whiteSpace: "nowrap",
                color: theme.colors.primary.default,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                transition: "opacity 0.2s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* 옵션 리스트 */}
        <div className="max-h-48 overflow-y-auto">
          {filteredValues.length === 0 ? (
            <div
              className="py-2 text-xs text-center"
              style={{ color: theme.colors.text.tertiary }}
            >
              No options found
            </div>
          ) : (
            filteredValues.map((value: any) => (
              <label
                key={value}
                className="filter-checkbox-item flex items-center py-1 hover:bg-opacity-50 rounded px-2 cursor-pointer"
                style={{
                  color: theme.colors.text.primary,
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    theme.colors.background.overlay;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(value)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onFilterToggle(value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="filter-checkbox rounded mr-2"
                  style={{
                    accentColor: theme.colors.primary.default,
                    cursor: "pointer",
                  }}
                />
                <span
                  className="text-xs truncate"
                  style={{ color: theme.colors.text.primary }}
                >
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
};
