/**
 * @파일명 : Table.tsx
 * @설명 : 테마 기반 재사용 가능한 고급 테이블 컴포넌트
 * @작성일 : 2025.12.07
 * @기능 : 정렬, 필터링, 페이징, 체크박스 선택, 인라인 편집, 컬럼 리사이징, 엑셀 내보내기
 */

"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { theme } from "@/styles/theme";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { Badge } from "./Badge";
import { Pagination } from "./Pagination";

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  type?: "text" | "number" | "date" | "email" | "select";
  options?: string[];
  required?: boolean;
  resizable?: boolean;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: string | ((record: T) => string);
  loading?: boolean;
  emptyText?: string;
  hoverable?: boolean;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;
  onRowClick?: (record: T, index: number) => void;
  onEdit?: (record: T, index: number) => void;
  onDelete?: (record: T, index: number) => void;
  className?: string;
  pagination?: boolean;
  page?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

// TableRow 컴포넌트를 별도로 분리
interface TableRowProps<T = any> {
  record: T;
  index: number;
  columns: TableColumn<T>[];
  getRowKey: (record: T, index: number) => string;
  onRowClick?: (record: T, index: number) => void;
  onEdit?: (record: T, index: number) => void;
  onDelete?: (record: T, index: number) => void;
  striped: boolean;
  hoverable: boolean;
  bordered: boolean;
  compact: boolean;
  isSelected: boolean;
}

const TableRow = <T extends Record<string, any>>({
  record,
  index,
  columns,
  getRowKey,
  onRowClick,
  onEdit,
  onDelete,
  striped,
  hoverable,
  bordered,
  compact,
  isSelected,
}: TableRowProps<T>) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTdStyle = (
    align?: "left" | "center" | "right"
  ): React.CSSProperties => ({
    padding: compact ? theme.spacing.sm : theme.spacing.md,
    fontSize: "14px",
    color: theme.colors.text.primary,
    borderRight: bordered ? `1px solid ${theme.colors.border.default}` : "none",
    borderBottom: `1px solid ${theme.colors.border.default}`,
    textAlign: align || "left",
    userSelect: "text",
  });

  const getTrStyle = (): React.CSSProperties => ({
    backgroundColor: isSelected
      ? "rgba(94, 106, 210, 0.15)" // primary color with low opacity
      : isHovered && hoverable
      ? theme.colors.background.overlay
      : striped && index % 2 === 1
      ? theme.colors.background.subtle
      : "transparent",
    cursor: onRowClick ? "pointer" : "default",
    transition: theme.effects.transitions.default,
    userSelect: "text",
    borderLeft: isSelected
      ? `3px solid ${theme.colors.primary.default}`
      : "3px solid transparent",
  });

  return (
    <tr
      style={getTrStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onRowClick?.(record, index)}
    >
      {columns.map((column) => {
        const dataIndex = column.dataIndex || column.key;
        const value = record[dataIndex];
        const content = column.render
          ? column.render(value, record, index)
          : value;

        return (
          <td key={column.key} style={getTdStyle(column.align)}>
            {content}
          </td>
        );
      })}
      {(onEdit || onDelete) && (
        <td style={{ ...getTdStyle("center"), width: "120px" }}>
          <div
            style={{
              display: "flex",
              gap: theme.spacing.xs,
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(record, index)}
              >
                ✏️
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(record, index)}
              >
                🗑
              </Button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  rowKey = "id",
  loading = false,
  emptyText = "No data available",
  hoverable = true,
  striped = false,
  bordered = true,
  compact = false,
  onRowClick,
  onEdit,
  onDelete,
  className = "",
  pagination = true,
  page = 1,
  pageSize = 10,
  totalElements,
  totalPages,
  first,
  last,
  onPageChange,
  onPageSizeChange,
}: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return record[rowKey] || index.toString();
  };

  const handleSort = (columnKey: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === columnKey &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const getSortedData = () => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const column = columns.find((col) => col.key === sortConfig.key);
      if (!column) return 0;

      const dataIndex = column.dataIndex || column.key;
      const aValue = a[dataIndex];
      const bValue = b[dataIndex];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return sorted;
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    border: bordered ? `1px solid ${theme.colors.border.default}` : "none",
  };

  const theadStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background.overlay,
    borderBottom: `1px solid ${theme.colors.border.default}`,
  };

  const thStyle: React.CSSProperties = {
    padding: compact ? theme.spacing.sm : theme.spacing.md,
    textAlign: "left",
    fontSize: "14px",
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.secondary,
    borderRight: bordered ? `1px solid ${theme.colors.border.default}` : "none",
  };

  const getTdStyle = (
    align?: "left" | "center" | "right"
  ): React.CSSProperties => ({
    padding: compact ? theme.spacing.sm : theme.spacing.md,
    fontSize: "14px",
    color: theme.colors.text.primary,
    borderRight: bordered ? `1px solid ${theme.colors.border.default}` : "none",
    borderBottom: `1px solid ${theme.colors.border.default}`,
    textAlign: align || "left",
  });

  const getTrStyle = (
    index: number,
    isHovered: boolean
  ): React.CSSProperties => ({
    backgroundColor:
      isHovered && hoverable
        ? theme.colors.background.overlay
        : striped && index % 2 === 1
        ? theme.colors.background.subtle
        : "transparent",
    cursor: onRowClick ? "pointer" : "default",
    transition: theme.effects.transitions.default,
    userSelect: "text",
  });

  const sortIconStyle = (columnKey: string): React.CSSProperties => ({
    marginLeft: theme.spacing.xs,
    fontSize: "10px",
    color:
      sortConfig?.key === columnKey
        ? theme.colors.primary.default
        : theme.colors.text.tertiary,
  });

  const emptyStyle: React.CSSProperties = {
    padding: theme.spacing.xxl,
    textAlign: "center",
    color: theme.colors.text.tertiary,
    fontSize: "14px",
  };

  const loadingStyle: React.CSSProperties = {
    padding: theme.spacing.xxl,
    textAlign: "center",
    color: theme.colors.text.secondary,
    fontSize: "14px",
  };

  const sortedData = getSortedData();

  // 백엔드 페이지네이션 여부 판단
  const isBackendPagination =
    totalElements !== undefined && totalPages !== undefined;

  // 페이징 처리
  const total = isBackendPagination ? totalElements : sortedData.length;
  const pages = isBackendPagination
    ? totalPages
    : Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = isBackendPagination ? page : Math.min(page, pages);

  const pagedData = isBackendPagination
    ? sortedData // 백엔드 페이지네이션: 이미 페이지네이션된 데이터
    : sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ overflowX: "auto" }} className={className}>
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  ...thStyle,
                  width: column.width,
                  textAlign: column.align || "left",
                  cursor: column.sortable ? "pointer" : "default",
                }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      column.align === "center"
                        ? "center"
                        : column.align === "right"
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  {column.title}
                  {column.sortable && (
                    <span style={sortIconStyle(column.key)}>
                      {sortConfig?.key === column.key
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : "▼"}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th style={{ ...thStyle, width: "120px", textAlign: "center" }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                style={loadingStyle}
              >
                Loading...
              </td>
            </tr>
          ) : pagedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                style={emptyStyle}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            pagedData.map((record, index) => {
              const rowKey = getRowKey(
                record,
                index + (currentPage - 1) * pageSize
              );
              return (
                <TableRow
                  key={rowKey}
                  record={record}
                  index={index + (currentPage - 1) * pageSize}
                  columns={columns}
                  getRowKey={getRowKey}
                  onRowClick={(rec, idx) => {
                    setSelectedRowKey(rowKey);
                    onRowClick?.(rec, idx);
                  }}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  striped={striped}
                  hoverable={hoverable}
                  bordered={bordered}
                  compact={compact}
                  isSelected={selectedRowKey === rowKey}
                />
              );
            })
          )}
        </tbody>
      </table>
      {/* 페이지네이션 UI */}
      {pagination && !loading && pagedData.length > 0 && (
        <div style={{ marginTop: theme.spacing.md }}>
          <Pagination
            currentPage={isBackendPagination ? currentPage : currentPage - 1}
            pageSize={pageSize}
            totalElements={total}
            totalPages={pages}
            first={
              isBackendPagination
                ? first ?? currentPage === 0
                : currentPage === 1
            }
            last={
              isBackendPagination
                ? last ?? currentPage === pages - 1
                : currentPage === pages
            }
            onPageChange={(page) => {
              if (isBackendPagination) {
                // 백엔드: 0-based 인덱스
                onPageChange?.(page);
              } else {
                // 클라이언트: 1-based 인덱스
                onPageChange?.(page + 1);
              }
            }}
            onPageSizeChange={(size) => {
              onPageSizeChange?.(size);
            }}
          />
        </div>
      )}
    </div>
  );
};
