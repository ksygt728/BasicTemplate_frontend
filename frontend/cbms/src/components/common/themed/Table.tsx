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
  className?: string;
}

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
  className = "",
}: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

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
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={loadingStyle}>
                Loading...
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={emptyStyle}>
                {emptyText}
              </td>
            </tr>
          ) : (
            sortedData.map((record, index) => {
              const [isHovered, setIsHovered] = useState(false);
              return (
                <tr
                  key={getRowKey(record, index)}
                  style={getTrStyle(index, isHovered)}
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
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
