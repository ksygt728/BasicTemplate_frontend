/**
 * @파일명 : AdvancedTable.tsx
 * @설명 : 고급 기능을 포함한 테마 기반 테이블 컴포넌트
 * @작성일 : 2025.12.07
 * @기능 : 페이징, 체크박스 선택, 필터링, 인라인 편집, 엑셀 내보내기, CRUD 작업
 */

"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { theme } from "@/styles/theme";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { Badge } from "./Badge";
import { FilterDropdown } from "./FilterDropdown";
import { useAlert } from "@/contexts/AlertContext";

// 중첩된 객체 경로를 안전하게 접근하는 헬퍼 함수
const getNestedValue = (obj: any, path: string): any => {
  if (!path || !obj) return obj;

  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result == null) return undefined;
    result = result[key];
  }

  return result;
};

export interface AdvancedTableColumn<T = any> {
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
}

export interface AdvancedTableProps<T = any> {
  columns: AdvancedTableColumn<T>[];
  data: T[];
  rowKey?: string | ((record: T) => string);

  // 스타일 옵션
  loading?: boolean;
  emptyText?: string;
  hoverable?: boolean;
  striped?: boolean;
  bordered?: boolean;
  compact?: boolean;

  // 기능 옵션
  pagination?:
    | boolean
    | {
        pageSize?: number;
        pageSizeOptions?: number[];
      };
  selection?:
    | boolean
    | {
        type?: "checkbox" | "radio";
        selectedRowKeys?: React.Key[];
        onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
      };
  filtering?: boolean;
  editable?: boolean;
  exportable?: boolean;

  // CRUD 콜백
  onRowClick?: (record: T, index: number) => void;
  onAdd?: (record: T) => Promise<any>;
  onUpdate?: (id: React.Key, record: T) => Promise<any>;
  onDelete?: (id: React.Key) => Promise<any>;
  onBulkDelete?: (ids: React.Key[]) => Promise<any>;

  // 헤더
  title?: string;
  subTitle?: string;
  description?: string;

  className?: string;
}

export const AdvancedTable = <T extends Record<string, any>>({
  columns,
  data,
  rowKey = "id",
  loading = false,
  emptyText = "No data available",
  hoverable = true,
  striped = false,
  bordered = true,
  compact = false,
  pagination = false,
  selection = false,
  filtering = false,
  editable = false,
  exportable = false,
  onRowClick,
  onAdd,
  onUpdate,
  onDelete,
  onBulkDelete,
  title,
  subTitle,
  description,
  className = "",
}: AdvancedTableProps<T>) => {
  const { showAlert } = useAlert();

  // Pagination state
  const paginationConfig = typeof pagination === "object" ? pagination : {};
  const pageSize = paginationConfig.pageSize || 10;
  const pageSizeOptions = paginationConfig.pageSizeOptions || [10, 20, 50, 100];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // Selection state
  const selectionConfig = typeof selection === "object" ? selection : {};
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(
    selectionConfig.selectedRowKeys || []
  );
  const [selectAll, setSelectAll] = useState(false);

  // Sorting state (다중 정렬 지원)
  const [sortConfig, setSortConfig] = useState<
    Array<{
      key: string;
      direction: "asc" | "desc";
    }>
  >([]);

  // Filtering state
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
  const [filterMenuOpen, setFilterMenuOpen] = useState<string | null>(null);
  const [filterMenuPosition, setFilterMenuPosition] = useState({ x: 0, y: 0 });
  const [filterSearchTerm, setFilterSearchTerm] = useState<{
    [key: string]: string;
  }>({});

  // More Actions state
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const moreActionsRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Column resize state
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    {}
  );
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [preventSort, setPreventSort] = useState(false);

  // Editing state
  const [editingRow, setEditingRow] = useState<React.Key[]>([]);
  const [editData, setEditData] = useState<{ [key: string]: any }>({});
  const [newRows, setNewRows] = useState<T[]>([]);
  const [deletingRow, setDeletingRow] = useState<React.Key | null>(null);

  const getRowKey = (record: T, index: number): React.Key => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return record[rowKey] || index;
  };

  // 필수 값 검증 함수
  const validateRequiredFields = (rowData: any): string[] => {
    const missingFields: string[] = [];

    columns.forEach((column) => {
      if (column.required && column.key !== rowKey) {
        const dataIndex = column.dataIndex || column.key;
        const value = rowData[dataIndex];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          missingFields.push(column.title);
        }
      }
    });

    return missingFields;
  };

  // Initialize column widths
  useEffect(() => {
    const newColumnWidths: { [key: string]: number } = {
      checkbox: 50,
      actions: 120,
    };

    columns.forEach((column) => {
      const width = column.width;
      if (typeof width === "number") {
        newColumnWidths[column.key] = width;
      } else if (typeof width === "string") {
        const parsed = parseInt(width.replace(/[^\d]/g, ""));
        newColumnWidths[column.key] = isNaN(parsed) ? 150 : parsed;
      } else {
        newColumnWidths[column.key] = 150;
      }
    });

    setColumnWidths(newColumnWidths);
  }, [columns]);

  // Column resize handlers
  const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(columnKey);
    setPreventSort(true);
    setStartX(e.clientX);
    setStartWidth(columnWidths[columnKey] || 150);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const diff = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff);

      setColumnWidths((prev) => ({
        ...prev,
        [isResizing]: newWidth,
      }));
    },
    [isResizing, startX, startWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(null);
    setTimeout(() => {
      setPreventSort(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Sorting logic (다중 정렬 지원)
  const handleSort = (columnKey: string) => {
    if (preventSort) return;

    const existingSort = sortConfig.find((sort) => sort.key === columnKey);

    if (existingSort) {
      if (existingSort.direction === "asc") {
        // asc -> desc
        const newSortConfig = sortConfig.map((sort) =>
          sort.key === columnKey
            ? { ...sort, direction: "desc" as "desc" }
            : sort
        );
        setSortConfig(newSortConfig);
      } else {
        // desc -> 제거 (none)
        const newSortConfig = sortConfig.filter(
          (sort) => sort.key !== columnKey
        );
        setSortConfig(newSortConfig);
      }
    } else {
      // 새로운 정렬 추가 (asc)
      const newSortConfig = [
        ...sortConfig,
        { key: columnKey, direction: "asc" as "asc" },
      ];
      setSortConfig(newSortConfig);
    }
  };

  // Sorted data를 useMemo로 메모이제이션
  const sortedData = useMemo(() => {
    if (sortConfig.length === 0) return [...data, ...newRows];

    const sorted = [...data, ...newRows].sort((a, b) => {
      // 다중 정렬: sortConfig 배열을 순차적으로 적용
      for (let i = 0; i < sortConfig.length; i++) {
        const sort = sortConfig[i];
        const column = columns.find((col) => col.key === sort.key);
        if (!column) continue;

        const dataIndex = column.dataIndex || column.key;
        let aValue = a[dataIndex];
        let bValue = b[dataIndex];

        // null/undefined 처리
        if (aValue === null || aValue === undefined) aValue = "";
        if (bValue === null || bValue === undefined) bValue = "";

        // 타입별 비교
        if (column.type === "number") {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        } else {
          aValue = String(aValue).toLowerCase();
          bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) {
          return sort.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sort.direction === "asc" ? 1 : -1;
        }
        // 같으면 다음 정렬 조건을 확인
      }
      return 0;
    });

    return sorted;
  }, [data, newRows, sortConfig, columns]);

  // Filtering logic - useMemo로 메모이제이션하여 불필요한 재계산 방지
  const filteredData = useMemo(() => {
    let filtered = sortedData;

    Object.keys(filters).forEach((key) => {
      if (filters[key].length > 0) {
        filtered = filtered.filter((record) => {
          const column = columns.find((col) => col.key === key);
          const dataIndex = column?.dataIndex || key;
          const value = getNestedValue(record, dataIndex);
          return filters[key].includes(String(value ?? ""));
        });
      }
    });

    return filtered;
  }, [data, newRows, sortConfig, filters, columns]);

  // Pagination logic - useMemo로 메모이제이션
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, pagination, currentPage, itemsPerPage]);

  const totalPages = pagination
    ? Math.ceil(filteredData.length / itemsPerPage)
    : 1;

  // Selection logic
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRowKeys([]);
    } else {
      setSelectedRowKeys(
        paginatedData.map((record, index) => getRowKey(record, index))
      );
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (key: React.Key) => {
    const newSelectedKeys = selectedRowKeys.includes(key)
      ? selectedRowKeys.filter((k) => k !== key)
      : [...selectedRowKeys, key];

    setSelectedRowKeys(newSelectedKeys);

    if (selectionConfig.onChange) {
      const selectedRecords = paginatedData.filter((record, index) =>
        newSelectedKeys.includes(getRowKey(record, index))
      );
      selectionConfig.onChange(newSelectedKeys, selectedRecords);
    }
  };

  // Editing logic
  const handleEdit = (record: T, index: number) => {
    const key = getRowKey(record, index);
    setEditingRow((prev) => [...prev, key]);
    setEditData((prev) => ({ ...prev, [String(key)]: { ...record } }));
  };

  const handleSave = async (record: T, index: number) => {
    const key = getRowKey(record, index);
    const keyStr = String(key);
    const dataToSave = {
      ...record,
      ...(editData[keyStr] || {}),
    };

    // 필수 필드 검증
    const missingFields = validateRequiredFields(dataToSave);
    if (missingFields.length > 0) {
      await showAlert({
        type: "warning",
        title: "필수 값 누락",
        message: `필수 값이 누락되었습니다.\n누락된 필드: ${missingFields.join(
          ", "
        )}`,
      });
      return;
    }

    try {
      if ((record as any).isNew) {
        if (onAdd) {
          await onAdd(dataToSave as T);
        }
        setNewRows((prev) => prev.filter((r) => getRowKey(r as T, 0) !== key));
      } else {
        if (onUpdate) {
          await onUpdate(key, dataToSave as T);
        }
      }
      setEditingRow((prev) => prev.filter((k) => k !== key));
      setEditData((prev) => {
        const newData = { ...prev };
        delete newData[keyStr];
        return newData;
      });
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleCancel = (key: React.Key) => {
    if (String(key).startsWith("new_") || String(key).startsWith("copy_")) {
      setNewRows((prev) => prev.filter((r) => getRowKey(r as T, 0) !== key));
    }
    setEditingRow((prev) => prev.filter((k) => k !== key));
    setEditData((prev) => {
      const newData = { ...prev };
      delete newData[String(key)];
      return newData;
    });
  };

  const handleDelete = async (record: T, index: number) => {
    const key = getRowKey(record, index);
    setDeletingRow(key);
  };

  const confirmDelete = async (record: T, index: number) => {
    const key = getRowKey(record, index);

    try {
      if (onDelete) {
        await onDelete(key);
      }
      setDeletingRow(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleAddRecord = () => {
    const newRow: any = {
      id: `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isNew: true,
    };

    columns.forEach((column) => {
      if (column.key !== "id") {
        newRow[column.key] = "";
      }
    });

    setNewRows((prev) => [...prev, newRow]);
    setEditingRow((prev) => [...prev, newRow.id]);
    setEditData((prev) => ({ ...prev, [newRow.id]: {} }));

    // 새 행을 선택에서 제외
    if (selectedRowKeys.includes(newRow.id)) {
      setSelectedRowKeys((prev) => prev.filter((id) => id !== newRow.id));
    }
  };

  // Export to Excel (CSV)
  const handleExportExcel = () => {
    const headers = columns.map((col) => col.title).join(",");
    const csvData = filteredData
      .map((row) =>
        columns
          .map((col) => {
            const dataIndex = col.dataIndex || col.key;
            const value = row[dataIndex] || "";
            return typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value;
          })
          .join(",")
      )
      .join("\n");

    const csvContent = `${headers}\n${csvData}`;
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${title || "table_data"}_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (onBulkDelete && selectedRowKeys.length > 0) {
      try {
        await onBulkDelete(selectedRowKeys);
        setSelectedRowKeys([]);
        setSelectAll(false);
        setIsMoreActionsOpen(false);
      } catch (error) {
        console.error("Bulk delete failed:", error);
      }
    }
  };

  // Bulk copy
  const handleBulkCopy = () => {
    if (selectedRowKeys.length === 0) return;

    // 선택된 행들의 데이터 가져오기 (편집 중인 행 제외)
    const selectedData = filteredData.filter((record, index) => {
      const key = getRowKey(record, index);
      return selectedRowKeys.includes(key) && !editingRow.includes(key);
    });

    if (selectedData.length === 0) {
      console.warn(
        "복사 가능한 행이 없습니다. (편집 중인 행은 복사할 수 없습니다)"
      );
      return;
    }

    // 선택된 행들을 복사하여 새로운 행으로 추가
    const copiedRows = selectedData.map((row: any) => {
      const copiedRow = { ...row };
      // ID를 새로 생성하여 중복 방지 - BasicTableView와 동일한 방식
      const dataIndex = rowKey as string;
      copiedRow[dataIndex] = `copy_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      copiedRow.isNew = true;
      return copiedRow;
    });

    setNewRows((prev) => [...prev, ...copiedRows]);

    // 모든 복사된 행을 편집 모드로 설정
    if (copiedRows.length > 0) {
      const copiedRowKeys = copiedRows.map((row) => row[rowKey as string]);
      setEditingRow((prev) => [...prev, ...copiedRowKeys]);
      const newEditData: { [key: string]: any } = {};
      copiedRows.forEach((row) => {
        newEditData[row[rowKey as string]] = {};
      });
      setEditData((prev) => ({ ...prev, ...newEditData }));
    }

    setIsMoreActionsOpen(false);
    console.log(`${copiedRows.length}개의 행이 복사되었습니다.`);
  };

  // Save All - 모든 편집 중인 행 일괄 저장
  const handleSaveAll = async () => {
    if (editingRow.length === 0) {
      await showAlert({
        type: "warning",
        title: "저장할 항목 없음",
        message: "저장할 편집 중인 행이 없습니다.",
      });
      return;
    }

    try {
      const allData = [...data, ...newRows];
      const validationErrors: string[] = [];

      // 1단계: 모든 행에 대해 필수 값 검증
      for (const key of editingRow) {
        const keyStr = String(key);
        const record = allData.find(
          (r) => String(getRowKey(r as T, 0)) === keyStr
        );

        if (!record) continue;

        const dataToSave = {
          ...record,
          ...(editData[keyStr] || {}),
        };

        const missingFields = validateRequiredFields(dataToSave);
        if (missingFields.length > 0) {
          validationErrors.push(`${keyStr}: ${missingFields.join(", ")}`);
        }
      }

      // 검증 실패가 하나라도 있으면 전체 저장 중단
      if (validationErrors.length > 0) {
        await showAlert({
          type: "warning",
          title: "필수 값 누락",
          message:
            "필수 값이 누락된 행이 있습니다:\n\n" + validationErrors.join("\n"),
        });
        return;
      }

      // 2단계: 모든 검증이 통과했을 때만 실제 저장 진행
      for (const key of editingRow) {
        const keyStr = String(key);
        const record = allData.find(
          (r) => String(getRowKey(r as T, 0)) === keyStr
        );

        if (!record) continue;

        const dataToSave = {
          ...record,
          ...(editData[keyStr] || {}),
        };

        if ((record as any).isNew) {
          if (onAdd) {
            await onAdd(dataToSave as T);
          }
          setNewRows((prev) =>
            prev.filter((r) => getRowKey(r as T, 0) !== key)
          );
        } else {
          if (onUpdate) {
            await onUpdate(key, dataToSave as T);
          }
        }
      }

      // 모든 저장 성공 후 상태 초기화
      setEditingRow([]);
      setEditData({});

      await showAlert({
        type: "success",
        title: "저장 성공",
        message: `${editingRow.length}개의 행이 저장되었습니다.`,
      });
    } catch (error) {
      console.error("Save all failed:", error);
      await showAlert({
        type: "error",
        title: "저장 실패",
        message: "저장 중 오류가 발생했습니다.",
      });
    }
  };

  // Filter menu functions
  const handleFilterMenu = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (filterMenuOpen === columnKey) {
      setFilterMenuOpen(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setFilterMenuPosition({
        x: rect.left,
        y: rect.bottom,
      });
      setFilterMenuOpen(columnKey);
      setFilterSearchTerm((prev) => ({
        ...prev,
        [columnKey]: "",
      }));
    }
  };

  const toggleFilter = (columnKey: string, value: string) => {
    setFilters((prev) => {
      const currentFilters = prev[columnKey] || [];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter((f) => f !== value)
        : [...currentFilters, value];

      return {
        ...prev,
        [columnKey]: newFilters,
      };
    });
  };

  const clearFilters = (columnKey: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnKey]: [],
    }));
  };

  const selectAllFilters = (columnKey: string) => {
    const availableValues = getFilteredUniqueValues(columnKey);
    setFilters((prev) => ({
      ...prev,
      [columnKey]: availableValues,
    }));
  };

  const getFilteredUniqueValues = (columnKey: string): string[] => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column) return [];

    const dataIndex = column.dataIndex || column.key;
    const allValues = [...data, ...newRows].map((record) => {
      const value = getNestedValue(record, dataIndex);
      return String(value ?? "");
    });
    const uniqueValues = Array.from(new Set(allValues)).sort();

    const searchTerm = filterSearchTerm[columnKey] || "";
    if (searchTerm) {
      return uniqueValues.filter((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return uniqueValues;
  };

  const updateFilterSearchTerm = (columnKey: string, searchTerm: string) => {
    setFilterSearchTerm((prev) => ({
      ...prev,
      [columnKey]: searchTerm,
    }));
  };

  // More Actions 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreActionsRef.current &&
        !moreActionsRef.current.contains(event.target as Node)
      ) {
        setIsMoreActionsOpen(false);
      }

      // 필터 메뉴 외부 클릭
      const target = event.target as HTMLElement;
      const isFilterDropdown = target.closest(".filter-dropdown");
      const isFilterTrigger = target.closest('[data-filter-trigger="true"]');

      if (!isFilterDropdown && !isFilterTrigger && filterMenuOpen) {
        setFilterMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterMenuOpen]);

  // Cell rendering
  const renderEditableCell = (
    record: T,
    column: AdvancedTableColumn<T>,
    isEditing: boolean,
    recordKey: React.Key
  ) => {
    const dataIndex = column.dataIndex || column.key;
    const recordValue = getNestedValue(record, dataIndex);
    const keyStr = String(recordKey);
    const rawValue = isEditing
      ? editData[keyStr]?.[dataIndex] ?? recordValue
      : recordValue;

    // value를 문자열로 변환 (객체/배열일 경우 처리)
    const value =
      rawValue == null
        ? ""
        : typeof rawValue === "object"
        ? ""
        : String(rawValue);

    if (!isEditing || !column.editable) {
      if (column.render) {
        return column.render(rawValue, record, 0);
      }
      return rawValue;
    }

    const handleChange = (newValue: any) => {
      setEditData((prev) => ({
        ...prev,
        [keyStr]: {
          ...(prev[keyStr] || {}),
          [dataIndex]: newValue,
        },
      }));
    };

    const inputStyle: React.CSSProperties = {
      width: "100%",
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      border: `1px solid ${
        column.required && !value
          ? theme.colors.status.error
          : theme.colors.border.default
      }`,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.background.surface,
      color: theme.colors.text.primary,
      fontSize: "14px",
    };

    switch (column.type) {
      case "select":
        return (
          <Select
            value={value || undefined}
            onChange={handleChange}
            options={(column.options || []).map((opt) => ({
              value: opt,
              label: opt,
            }))}
            error={column.required && !value ? "Required" : undefined}
            fullWidth
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            style={inputStyle}
            placeholder={column.required ? "Required" : ""}
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            style={inputStyle}
          />
        );
      case "email":
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            style={inputStyle}
            placeholder={column.required ? "Required" : ""}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            style={inputStyle}
            placeholder={column.required ? "Required" : ""}
          />
        );
    }
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background.default,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: theme.spacing.md,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  };

  const subTitleStyle: React.CSSProperties = {
    fontSize: "14px",
    color: theme.colors.text.secondary,
  };

  const toolbarStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    flexWrap: "wrap",
    gap: theme.spacing.sm,
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
    isHovered: boolean,
    isSelected: boolean
  ): React.CSSProperties => ({
    backgroundColor: isSelected
      ? theme.colors.primary.hover
      : isHovered && hoverable
      ? theme.colors.background.overlay
      : striped && index % 2 === 1
      ? theme.colors.background.subtle
      : "transparent",
    cursor: onRowClick ? "pointer" : "default",
    transition: theme.effects.transitions.default,
  });

  const paginationStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderTop: `1px solid ${theme.colors.border.default}`,
  };

  return (
    <div style={containerStyle} className={className}>
      {(title || subTitle || description) && (
        <div style={headerStyle}>
          {title && <h2 style={titleStyle}>{title}</h2>}
          {subTitle && <p style={subTitleStyle}>{subTitle}</p>}
          {description && (
            <p style={{ ...subTitleStyle, marginTop: theme.spacing.xs }}>
              {description}
            </p>
          )}
        </div>
      )}

      <div style={toolbarStyle}>
        <div
          style={{ display: "flex", gap: theme.spacing.sm, flexWrap: "wrap" }}
        >
          {editable && onAdd && (
            <Button size="sm" leftIcon="+" onClick={handleAddRecord}>
              Add Record
            </Button>
          )}
          {selection && selectedRowKeys.length > 0 && onBulkDelete && (
            <Button
              size="sm"
              variant="error"
              leftIcon="🗑"
              onClick={handleBulkDelete}
            >
              Delete ({selectedRowKeys.length})
            </Button>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: theme.spacing.sm,
            alignItems: "center",
          }}
        >
          {exportable && (
            <Button
              size="sm"
              variant="secondary"
              leftIcon="📥"
              onClick={handleExportExcel}
            >
              Export
            </Button>
          )}

          {/* More Actions 드롭다운 */}
          {selection && (
            <div ref={moreActionsRef} style={{ position: "relative" }}>
              <Button
                size="sm"
                variant="secondary"
                leftIcon="⚙"
                onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              >
                More Actions
              </Button>

              {isMoreActionsOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "100%",
                    marginTop: theme.spacing.xs,
                    width: "200px",
                    backgroundColor: theme.colors.background.surface,
                    borderRadius: theme.borderRadius.md,
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
                    border: `1px solid ${theme.colors.border.default}`,
                    zIndex: 50,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ padding: theme.spacing.xs }}>
                    <button
                      onClick={handleSaveAll}
                      disabled={editingRow.length === 0}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        fontSize: "14px",
                        color:
                          editingRow.length === 0
                            ? theme.colors.text.disabled
                            : theme.colors.text.primary,
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: theme.borderRadius.sm,
                        cursor:
                          editingRow.length === 0 ? "not-allowed" : "pointer",
                        textAlign: "left",
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (editingRow.length > 0) {
                          e.currentTarget.style.backgroundColor =
                            theme.colors.background.overlay;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span style={{ marginRight: theme.spacing.sm }}>✔️</span>
                      Save All ({editingRow.length})
                    </button>

                    <button
                      onClick={handleBulkCopy}
                      disabled={selectedRowKeys.length === 0}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        fontSize: "14px",
                        color:
                          selectedRowKeys.length === 0
                            ? theme.colors.text.disabled
                            : theme.colors.text.primary,
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: theme.borderRadius.sm,
                        cursor:
                          selectedRowKeys.length === 0
                            ? "not-allowed"
                            : "pointer",
                        textAlign: "left",
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedRowKeys.length > 0) {
                          e.currentTarget.style.backgroundColor =
                            theme.colors.background.overlay;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span style={{ marginRight: theme.spacing.sm }}>📋</span>
                      Bulk Copy ({selectedRowKeys.length})
                    </button>

                    <button
                      onClick={handleBulkDelete}
                      disabled={selectedRowKeys.length === 0 || !onBulkDelete}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        fontSize: "14px",
                        color:
                          selectedRowKeys.length === 0 || !onBulkDelete
                            ? theme.colors.text.disabled
                            : theme.colors.text.primary,
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: theme.borderRadius.sm,
                        cursor:
                          selectedRowKeys.length === 0 || !onBulkDelete
                            ? "not-allowed"
                            : "pointer",
                        textAlign: "left",
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedRowKeys.length > 0 && onBulkDelete) {
                          e.currentTarget.style.backgroundColor =
                            theme.colors.background.overlay;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span style={{ marginRight: theme.spacing.sm }}>🗑</span>
                      Bulk Delete ({selectedRowKeys.length})
                    </button>

                    <div
                      style={{
                        height: "1px",
                        backgroundColor: theme.colors.border.default,
                        margin: `${theme.spacing.xs} 0`,
                      }}
                    />

                    <button
                      onClick={() => {
                        setSortConfig([]);
                        setIsMoreActionsOpen(false);
                      }}
                      disabled={sortConfig.length === 0}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        fontSize: "14px",
                        color:
                          sortConfig.length === 0
                            ? theme.colors.text.disabled
                            : theme.colors.text.primary,
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: theme.borderRadius.sm,
                        cursor:
                          sortConfig.length === 0 ? "not-allowed" : "pointer",
                        textAlign: "left",
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (sortConfig.length > 0) {
                          e.currentTarget.style.backgroundColor =
                            theme.colors.background.overlay;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span style={{ marginRight: theme.spacing.sm }}>↺</span>
                      Clear All Sorts ({sortConfig.length})
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              {selection && (
                <th style={{ ...thStyle, width: "50px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    style={{ cursor: "pointer" }}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    ...thStyle,
                    width: `${columnWidths[column.key] || 150}px`,
                    minWidth: "50px",
                    textAlign: column.align || "left",
                    cursor:
                      column.sortable && !preventSort ? "pointer" : "default",
                    position: "relative",
                    userSelect: isResizing ? "none" : "auto",
                  }}
                  onClick={() =>
                    column.sortable && !preventSort && handleSort(column.key)
                  }
                  onContextMenu={(e) =>
                    filtering &&
                    column.filterable !== false &&
                    handleFilterMenu(e, column.key)
                  }
                  data-filter-trigger="true"
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
                      gap: theme.spacing.xs,
                    }}
                  >
                    {column.title}
                    {column.required && (
                      <span
                        style={{
                          color: theme.colors.status.error,
                          marginLeft: theme.spacing.xs,
                        }}
                      >
                        *
                      </span>
                    )}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      {column.sortable &&
                        (() => {
                          const currentSort = sortConfig.find(
                            (s) => s.key === column.key
                          );
                          const sortIndex = sortConfig.findIndex(
                            (s) => s.key === column.key
                          );
                          return (
                            <span
                              style={{
                                fontSize: "10px",
                                color: currentSort
                                  ? theme.colors.primary.default
                                  : theme.colors.text.tertiary,
                              }}
                            >
                              {currentSort
                                ? (currentSort.direction === "asc"
                                    ? "▲"
                                    : "▼") +
                                  (sortConfig.length > 1
                                    ? `${sortIndex + 1}`
                                    : "")
                                : "▼"}
                            </span>
                          );
                        })()}

                      {filtering &&
                        column.filterable !== false &&
                        filters[column.key] &&
                        filters[column.key].length > 0 && (
                          <span
                            style={{
                              fontSize: "10px",
                              color: theme.colors.primary.default,
                            }}
                            title="Filtered"
                          >
                            🔍
                          </span>
                        )}
                    </div>
                  </div>

                  {/* FilterDropdown */}
                  {filtering && column.filterable !== false && (
                    <FilterDropdown
                      isOpen={filterMenuOpen === column.key}
                      position={filterMenuPosition}
                      columnKey={column.key}
                      searchTerm={filterSearchTerm[column.key] || ""}
                      selectedFilters={filters[column.key] || []}
                      availableValues={getFilteredUniqueValues(column.key)}
                      onSearchChange={(searchTerm) =>
                        updateFilterSearchTerm(column.key, searchTerm)
                      }
                      onFilterToggle={(value) =>
                        toggleFilter(column.key, value)
                      }
                      onSelectAll={() => selectAllFilters(column.key)}
                      onClearAll={() => clearFilters(column.key)}
                      onClose={() => setFilterMenuOpen(null)}
                    />
                  )}

                  {/* Resize Handle */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "4px",
                      height: "100%",
                      cursor: "col-resize",
                      backgroundColor: "transparent",
                      zIndex: 10,
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPreventSort(true);
                      handleMouseDown(e, column.key);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  />
                </th>
              ))}
              {editable && (
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
                  colSpan={
                    columns.length + (selection ? 1 : 0) + (editable ? 1 : 0)
                  }
                  style={{
                    padding: theme.spacing.xxl,
                    textAlign: "center",
                    color: theme.colors.text.secondary,
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (selection ? 1 : 0) + (editable ? 1 : 0)
                  }
                  style={{
                    padding: theme.spacing.xxl,
                    textAlign: "center",
                    color: theme.colors.text.tertiary,
                  }}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((record, index) => {
                const key = getRowKey(record, index);
                const isEditing = editingRow.includes(key);
                const isDeleting = deletingRow === key;
                const isSelected = selectedRowKeys.includes(key);

                return (
                  <tr
                    key={key}
                    style={getTrStyle(index, false, isSelected)}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget;
                      target.style.backgroundColor = hoverable
                        ? theme.colors.background.overlay
                        : target.style.backgroundColor;
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget;
                      target.style.backgroundColor =
                        getTrStyle(index, false, isSelected).backgroundColor ||
                        "";
                    }}
                    onClick={() => !isEditing && onRowClick?.(record, index)}
                  >
                    {selection && (
                      <td
                        style={{
                          ...getTdStyle("center"),
                          width: "50px",
                          cursor: isEditing ? "not-allowed" : "pointer",
                          opacity: isEditing ? 0.5 : 1,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isEditing) {
                            handleSelectRow(key);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isEditing}
                          onChange={() => !isEditing && handleSelectRow(key)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            cursor: isEditing ? "not-allowed" : "pointer",
                            pointerEvents: "none",
                          }}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td key={column.key} style={getTdStyle(column.align)}>
                        {renderEditableCell(record, column, isEditing, key)}
                      </td>
                    ))}
                    {editable && (
                      <td style={{ ...getTdStyle("center"), width: "120px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: theme.spacing.xs,
                            justifyContent: "center",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isDeleting ? (
                            <>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => confirmDelete(record, index)}
                              >
                                ✓
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeletingRow(null)}
                              >
                                ✕
                              </Button>
                            </>
                          ) : isEditing ? (
                            <>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleSave(record, index)}
                              >
                                ✓
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCancel(key)}
                              >
                                ✕
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(record, index)}
                              >
                                ✏️
                              </Button>
                              {onDelete && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(record, index)}
                                >
                                  🗑
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && !loading && paginatedData.length > 0 && (
        <div style={paginationStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.sm,
            }}
          >
            <span
              style={{ fontSize: "14px", color: theme.colors.text.secondary }}
            >
              Rows per page:
            </span>
            <Select
              value={String(itemsPerPage)}
              onChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
              options={pageSizeOptions.map((size) => ({
                value: String(size),
                label: String(size),
              }))}
            />
          </div>
          <div style={{ fontSize: "14px", color: theme.colors.text.secondary }}>
            {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length}
          </div>
          <div style={{ display: "flex", gap: theme.spacing.xs }}>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              «
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ‹
            </Button>
            <span
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                fontSize: "14px",
                color: theme.colors.text.primary,
              }}
            >
              {currentPage} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              ›
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              »
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
