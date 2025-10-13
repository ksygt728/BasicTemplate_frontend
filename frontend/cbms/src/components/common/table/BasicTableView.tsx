"use client";

import Link from "next/link";
import Image from "next/image";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import FilterDropdown from "./FilterDropdown";
import TablePagination from "./TablePagination";
import TableToolbar from "./TableToolbar";

// Props 인터페이스 정의
interface TableColumn {
  key: string;
  label: string;
  sortable: boolean;
  width?: number;
  sticky?: string;
  editable?: boolean;
  type?: string;
  className?: string;
  render?: (value: any) => React.ReactNode;
  options?: string[];
}

interface BasicTableViewProps {
  columns?: TableColumn[];
  data?: any[];
  title?: string;
  subTitle?: string;
  description?: string;
  onRowClick?: (row: any) => void;
}

export default function BasicTableView({
  columns: propColumns,
  data: propData,
  title,
  subTitle,
  description,
  onRowClick,
}: BasicTableViewProps) {
  // Refs for detecting clicks outside
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // State 관리
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({
    checkbox: 60,
    id: 120,
    company: 150,
    domain: 180,
    status: 100,
    category: 120,
    users: 80,
    license: 80,
    revenue: 100,
    lastUpdate: 120,
    contact: 180,
    actions: 80,
  });
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [preventSort, setPreventSort] = useState(false); // 정렬 방지 플래그
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<
    Array<{
      key: string;
      direction: "asc" | "desc";
    }>
  >([]);
  const [filterMenuOpen, setFilterMenuOpen] = useState<string | null>(null);
  const [filterMenuPosition, setFilterMenuPosition] = useState({ x: 0, y: 0 });
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
  const [filterSearchTerm, setFilterSearchTerm] = useState<{
    [key: string]: string;
  }>({});

  // 기본 컬럼 정의 (props로 컬럼이 없을 때 사용)
  const defaultColumns = [
    {
      key: "id",
      label: "ID",
      width: "min-w-[120px]",
      sticky: "sticky left-14 z-10",
      editable: false,
      type: "text",
      className: "text-sm font-medium text-gray-900 dark:text-white",
      sortable: true,
    },
    {
      key: "company",
      label: "Company",
      width: "min-w-[150px]",
      editable: true,
      type: "text",
      className: "text-sm text-gray-900 dark:text-white",
      sortable: true,
    },
    {
      key: "domain",
      label: "Domain",
      width: "min-w-[180px]",
      editable: true,
      type: "text",
      className: "text-sm text-blue-600 hover:text-blue-800",
      sortable: true,
      render: (value: string) => (
        <a href={`https://${value}`} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "min-w-[100px]",
      editable: true,
      type: "select",
      options: ["Active", "Inactive", "Pending"],
      className: "",
      sortable: true,
      render: (value: string) => (
        <span
          className={`inline-flex items-center px-1.5 py-0.3 text-xs font-medium rounded border ${getStatusColor(
            value
          )}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "category",
      label: "Category",
      width: "min-w-[120px]",
      editable: true,
      type: "text",
      className: "text-sm text-gray-900 dark:text-white",
    },
    {
      key: "users",
      label: "Users",
      width: "min-w-[80px]",
      editable: true,
      type: "number",
      className: "text-sm text-gray-900 dark:text-white text-right",
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: "license",
      label: "License %",
      width: "min-w-[80px]",
      editable: true,
      type: "number",
      className: "text-sm text-gray-900 dark:text-white text-right",
      render: (value: number) => `${value}%`,
    },
    {
      key: "revenue",
      label: "Revenue",
      width: "min-w-[100px]",
      editable: true,
      type: "text",
      className:
        "text-sm font-medium text-green-600 dark:text-green-400 text-right",
    },
    {
      key: "lastUpdate",
      label: "Last Update",
      width: "min-w-[120px]",
      editable: true,
      type: "date",
      className: "text-sm text-gray-900 dark:text-white",
    },
    {
      key: "contact",
      label: "Contact",
      width: "min-w-[180px]",
      editable: true,
      type: "email",
      className: "text-sm text-blue-600 hover:text-blue-800",
      render: (value: string) => <a href={`mailto:${value}`}>{value}</a>,
    },
  ];

  // Props에서 전달받은 컬럼을 기본 컬럼과 통합하거나 기본 컬럼 사용
  const columns = useMemo(() => {
    return propColumns
      ? propColumns.map((col) => ({
          key: col.key,
          label: col.label,
          sortable: col.sortable,
          width: `min-w-[${col.width || 120}px]`,
          editable: col.editable || false,
          type: col.type || "text",
          className: col.className || "text-sm text-gray-900 dark:text-white",
          sticky: col.sticky || "",
          render: col.render,
          options: col.options,
        }))
      : defaultColumns;
  }, [propColumns]);

  // 컬럼이 변경될 때마다 columnWidths 초기화
  useEffect(() => {
    const newColumnWidths: { [key: string]: number } = {
      checkbox: 60,
      actions: 80,
    };

    // 각 컬럼에 대해 기본 너비 설정
    columns.forEach((column) => {
      if (propColumns) {
        // props에서 온 컬럼의 경우 width 속성 사용
        newColumnWidths[column.key] = column.width
          ? typeof column.width === "number"
            ? column.width
            : parseInt(column.width.toString().replace(/[^\d]/g, "")) || 120
          : 120;
      } else {
        // 기본 컬럼의 경우 미리 정의된 너비 사용
        const defaultWidths: { [key: string]: number } = {
          id: 120,
          company: 150,
          domain: 180,
          status: 100,
          category: 120,
          users: 80,
          license: 80,
          revenue: 100,
          lastUpdate: 120,
          contact: 180,
        };
        newColumnWidths[column.key] = defaultWidths[column.key] || 120;
      }
    });

    setColumnWidths(newColumnWidths);
  }, [propColumns]); // columns 대신 propColumns만 의존성으로 사용

  // 유틸리티 함수들
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // 셀 렌더링 함수
  const renderCell = (item: any, column: any, isEditing: boolean) => {
    const value = item[column.key];

    if (isEditing && column.editable) {
      // 편집 모드
      switch (column.type) {
        case "select":
          return (
            <select
              value={editData[column.key] || value}
              onChange={(e) =>
                setEditData({ ...editData, [column.key]: e.target.value })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {column.options?.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        case "number":
          return (
            <input
              type="number"
              value={editData[column.key] || value}
              onChange={(e) =>
                setEditData({ ...editData, [column.key]: e.target.value })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          );
        case "date":
          return (
            <input
              type="date"
              value={editData[column.key] || value}
              onChange={(e) =>
                setEditData({ ...editData, [column.key]: e.target.value })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          );
        case "email":
          return (
            <input
              type="email"
              value={editData[column.key] || value}
              onChange={(e) =>
                setEditData({ ...editData, [column.key]: e.target.value })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          );
        default:
          return (
            <input
              type="text"
              value={editData[column.key] || value}
              onChange={(e) =>
                setEditData({ ...editData, [column.key]: e.target.value })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          );
      }
    } else {
      // 표시 모드
      if (column.render) {
        return column.render(value);
      }

      if (column.type === "number" && typeof value === "number") {
        return column.key === "license" ? `${value}%` : value.toLocaleString();
      }

      return value;
    }
  };

  // 기존 헬퍼 함수들
  const defaultTableData = [
    {
      id: 1,
      company: "Catalog",
      domain: "catalogapp.io",
      status: "Active",
      category: "Content",
      users: 245,
      license: 67,
      revenue: "$45,200",
      lastUpdate: "2024-10-01",
      contact: "john@catalog.io",
    },
    {
      id: 2,
      company: "Circooles",
      domain: "getcirooles.com",
      status: "Inactive",
      category: "Design",
      users: 156,
      license: 40,
      revenue: "$23,100",
      lastUpdate: "2024-09-28",
      contact: "sarah@circooles.com",
    },
    {
      id: 3,
      company: "Sisyphus",
      domain: "sisyphus.com",
      status: "Active",
      category: "Automation",
      users: 389,
      license: 92,
      revenue: "$78,500",
      lastUpdate: "2024-10-05",
      contact: "mike@sisyphus.com",
    },
    {
      id: 4,
      company: "Hourglass",
      domain: "hourglass.app",
      status: "Pending",
      category: "Productivity",
      users: 124,
      license: 33,
      revenue: "$12,800",
      lastUpdate: "2024-09-30",
      contact: "alice@hourglass.app",
    },
    {
      id: 5,
      company: "Quotient",
      domain: "quotient.co",
      status: "Active",
      category: "Sales",
      users: 67,
      license: 17,
      revenue: "$8,400",
      lastUpdate: "2024-10-03",
      contact: "bob@quotient.co",
    },
    {
      id: 6,
      company: "DataFlow",
      domain: "dataflow.io",
      status: "Active",
      category: "Analytics",
      users: 512,
      license: 95,
      revenue: "$125,600",
      lastUpdate: "2024-10-07",
      contact: "emma@dataflow.io",
    },
    {
      id: 7,
      company: "CloudSync",
      domain: "cloudsync.net",
      status: "Inactive",
      category: "Storage",
      users: 89,
      license: 22,
      revenue: "$15,300",
      lastUpdate: "2024-09-25",
      contact: "david@cloudsync.net",
    },
    {
      id: 8,
      company: "TeamHub",
      domain: "teamhub.com",
      status: "Active",
      category: "Collaboration",
      users: 334,
      license: 78,
      revenue: "$56,700",
      lastUpdate: "2024-10-06",
      contact: "lisa@teamhub.com",
    },
    {
      id: 9,
      company: "TeamHub",
      domain: "teamhub.com",
      status: "Active",
      category: "Collaboration",
      users: 334,
      license: 78,
      revenue: "$56,700",
      lastUpdate: "2024-10-06",
      contact: "lisa@teamhub.com",
    },
    {
      id: 10,
      company: "TeamHub",
      domain: "teamhub.com",
      status: "Active",
      category: "Collaboration",
      users: 334,
      license: 78,
      revenue: "$56,700",
      lastUpdate: "2024-10-06",
      contact: "lisa@teamhub.com",
    },
    {
      id: 10,
      company: "TeamHub",
      domain: "teamhub.com",
      status: "Active",
      category: "Collaboration",
      users: 334,
      license: 78,
      revenue: "$56,700",
      lastUpdate: "2024-10-06",
      contact: "lisa@teamhub.com",
    },
    {
      id: 11,
      company: "TeamHub",
      domain: "teamhub.com",
      status: "Active",
      category: "Collaboration",
      users: 334,
      license: 78,
      revenue: "$56,700",
      lastUpdate: "2024-10-06",
      contact: "lisa@teamhub.com",
    },
  ];

  // Props에서 전달받은 데이터를 사용하거나 기본 데이터 사용
  const tableData = propData || defaultTableData;

  // 페이지네이션 계산
  const filteredData = tableData.filter((row) => {
    return Object.entries(filters).every(([key, filterValues]) => {
      if (!filterValues || filterValues.length === 0) return true;
      return filterValues.includes((row as any)[key]);
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    // 다중 정렬: sortConfig 배열을 순차적으로 적용
    for (let i = 0; i < sortConfig.length; i++) {
      const sort = sortConfig[i];
      let aValue = (a as any)[sort.key];
      let bValue = (b as any)[sort.key];

      // 데이터 타입별 변환
      if (sort.key === "id" || sort.key === "users") {
        // ID와 Users는 숫자로 변환
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else if (sort.key === "revenue") {
        // Revenue 컬럼의 경우 숫자로 변환
        aValue = parseFloat(aValue.toString().replace(/[,$]/g, "")) || 0;
        bValue = parseFloat(bValue.toString().replace(/[,$]/g, "")) || 0;
      } else if (sort.key === "license") {
        // License 퍼센티지의 경우 숫자로 변환
        aValue = parseFloat(aValue.toString().replace("%", "")) || 0;
        bValue = parseFloat(bValue.toString().replace("%", "")) || 0;
      } else {
        // 문자열 컬럼의 경우 대소문자 구분 없이 비교
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
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

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  // selectAll 상태 자동 업데이트
  useEffect(() => {
    if (currentData.length === 0) {
      setSelectAll(false);
    } else {
      const currentPageIds = currentData.map((row) => row.id);
      const selectedCurrentPageIds = selectedRows.filter((id) =>
        currentPageIds.includes(id)
      );

      if (selectedCurrentPageIds.length === currentData.length) {
        setSelectAll(true);
      } else {
        setSelectAll(false);
      }
    }
  }, [selectedRows, currentData]);

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentData.map((row) => row.id));
    }
    setSelectAll(!selectAll);
  };

  // 개별 행 선택/해제
  const handleRowSelect = (id: number) => {
    let newSelectedRows: number[];

    if (selectedRows.includes(id)) {
      newSelectedRows = selectedRows.filter((rowId) => rowId !== id);
    } else {
      newSelectedRows = [...selectedRows, id];
    }

    setSelectedRows(newSelectedRows);
  };

  // 편집 시작
  const handleEdit = (row: any) => {
    setEditingRow(row.id);
    setEditData({ ...row });
  };

  // 편집 저장
  const handleSave = () => {
    // 실제로는 여기서 API 호출을 통해 데이터를 저장
    setEditingRow(null);
    setEditData({});
  };

  // 편집 취소
  const handleCancel = () => {
    setEditingRow(null);
    setEditData({});
  };

  // 정렬 함수 (다중 정렬 지원)
  const handleSort = (columnKey: string) => {
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

  // 필터 메뉴 토글
  const handleFilterMenu = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (filterMenuOpen === columnKey) {
      setFilterMenuOpen(null);
    } else {
      // 클릭한 요소의 위치 계산 (뷰포트 기준)
      const rect = e.currentTarget.getBoundingClientRect();

      // 뷰포트 기준 좌표를 그대로 사용 (window.scrollY 제거)
      setFilterMenuPosition({
        x: rect.left,
        y: rect.bottom,
      });

      setFilterMenuOpen(columnKey);
      // 필터 메뉴를 열 때 검색어 초기화
      setFilterSearchTerm((prev) => ({
        ...prev,
        [columnKey]: "",
      }));
    }
  };

  // 필터 토글
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

  // 필터 클리어
  const clearFilters = (columnKey: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnKey]: [],
    }));
  };

  // 전체 선택/해제
  const selectAllFilters = (columnKey: string) => {
    const allValues = getFilteredUniqueValues(columnKey);
    const currentFilters = filters[columnKey] || [];

    // 현재 모든 값이 선택되어 있으면 해제, 아니면 전체 선택
    if (currentFilters.length === allValues.length) {
      // 전체 해제
      setFilters((prev) => ({
        ...prev,
        [columnKey]: [],
      }));
    } else {
      // 전체 선택
      setFilters((prev) => ({
        ...prev,
        [columnKey]: allValues,
      }));
    }
  };

  // 유니크 값 가져오기 (필터 옵션용)
  const getUniqueValues = (columnKey: string) => {
    return [
      ...new Set(
        tableData.map((row) => {
          const value = (row as any)[columnKey];
          // null, undefined, 빈 문자열 제외
          return value !== null && value !== undefined && value !== ""
            ? value
            : null;
        })
      ),
    ].filter((value) => value !== null);
  };

  // 검색어로 필터링된 유니크 값 가져오기
  const getFilteredUniqueValues = (columnKey: string) => {
    const allValues = getUniqueValues(columnKey);
    const searchTerm = filterSearchTerm[columnKey]?.toLowerCase() || "";

    if (!searchTerm) return allValues;

    return allValues.filter((value) =>
      value.toString().toLowerCase().includes(searchTerm)
    );
  };

  // 필터 검색어 업데이트
  const updateFilterSearchTerm = (columnKey: string, searchTerm: string) => {
    setFilterSearchTerm((prev) => ({
      ...prev,
      [columnKey]: searchTerm,
    }));
  };

  // 정렬 아이콘 렌더링 (다중 정렬 지원)
  const renderSortIcon = (columnKey: string) => {
    const sortItem = sortConfig.find((sort) => sort.key === columnKey);

    if (!sortItem) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
          />
        </svg>
      );
    }

    const sortIndex =
      sortConfig.findIndex((sort) => sort.key === columnKey) + 1;

    if (sortItem.direction === "asc") {
      return (
        <div className="flex items-center">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
          {sortConfig.length > 1 && (
            <span className="text-xs text-blue-600 font-bold ml-1">
              {sortIndex}
            </span>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-center">
        <svg
          className="w-4 h-4 text-blue-600"
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
        {sortConfig.length > 1 && (
          <span className="text-xs text-blue-600 font-bold ml-1">
            {sortIndex}
          </span>
        )}
      </div>
    );
  };

  // 컬럼 리사이즈 함수들
  const handleMouseDown = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    setIsResizing(columnKey);
    setPreventSort(true);
    setStartX(e.clientX);
    setStartWidth(columnWidths[columnKey] || 120); // 기본값 제공
  };

  // 마우스 move/up 이벤트 핸들러들을 useCallback으로 최적화
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const diff = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff); // 최소 너비 50px

      setColumnWidths((prev) => ({
        ...prev,
        [isResizing]: newWidth,
      }));
    },
    [isResizing, startX, startWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(null);
    // 리사이즈 완료 후 약간의 지연을 두고 정렬 방지 플래그 해제 (클릭 이벤트보다 늦게)
    setTimeout(() => {
      setPreventSort(false);
    }, 100);
  }, []);

  // 마우스 이벤트 리스너 추가/제거 (메모이제이션 개선)
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

  // React스러운 방식으로 외부 클릭 감지
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      // Filter 메뉴 외부 클릭 감지
      if (filterMenuOpen) {
        const target = event.target as Element;

        // FilterDropdown이 Portal로 렌더링되므로, 클릭된 요소가 필터 메뉴 관련 요소인지 확인
        const isFilterMenuClick =
          target.closest(".filter-dropdown") ||
          target.closest("[data-filter-trigger]") ||
          target.getAttribute("data-filter-trigger") !== null ||
          target.closest(".filter-menu-content") ||
          target.closest(".filter-search-input") ||
          target.closest(".filter-checkbox-item");

        if (!isFilterMenuClick) {
          setFilterMenuOpen(null);
        }
      }
    },
    [filterMenuOpen]
  );

  // 드롭다운 외부 클릭 시 닫기 (React 방식) - click 이벤트도 추가
  useEffect(() => {
    if (filterMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [filterMenuOpen, handleClickOutside]);

  return (
    <section className="container px-4 mx-auto">
      {title && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
      )}

      <TableToolbar
        recordCount={sortedData.length}
        sortConfig={sortConfig}
        isMoreActionsOpen={isMoreActionsOpen}
        onMoreActionsToggle={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
        onClearAllSorts={() => setSortConfig([])}
        subTitle={subTitle}
        description={description}
      />

      {/* 엑셀 스타일 테이블 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm relative">
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          <table
            className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${
              isResizing ? "select-none" : ""
            }`}
          >
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-20">
              <tr>
                {/* 체크박스 컬럼 */}
                <th
                  className="sticky left-0 z-30 px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
                  style={{ width: columnWidths.checkbox || 60 }}
                >
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {/* 리사이즈 핸들 */}
                  <div
                    className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-300 active:bg-blue-400 z-50"
                    style={{
                      pointerEvents: "auto",
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setPreventSort(true);
                      handleMouseDown(e, "checkbox");
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setPreventSort(true);
                    }}
                    onMouseUp={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setTimeout(() => {
                        setPreventSort(false);
                      }, 150);
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                    }}
                  />
                </th>

                {/* 데이터 컬럼들 */}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 dark:border-gray-700 relative ${
                      // 리사이즈 중일 때만 hover 효과 제거, 평상시에는 정상 동작
                      isResizing
                        ? "cursor-default"
                        : "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    } ${column.sticky ? column.sticky + " z-30" : "z-20"}`}
                    style={{
                      width: columnWidths[column.key] || 120,
                      // pointerEvents 제거 - 정상적인 클릭 허용
                    }}
                    onClick={(e) => {
                      // 현재 리사이즈 중이거나 preventSort 플래그가 설정된 경우 정렬 방지
                      if (isResizing || preventSort) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                      }

                      // 리사이즈 핸들을 직접 클릭한 경우 정렬 방지
                      const target = e.target as HTMLElement;
                      const targetClassName = target.className;
                      if (
                        typeof targetClassName === "string" &&
                        targetClassName.includes("cursor-col-resize")
                      ) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                      }
                      // classList 사용 방법도 추가 (더 안전)
                      if (
                        target.classList &&
                        target.classList.contains("cursor-col-resize")
                      ) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                      }

                      handleSort(column.key);
                    }}
                    onContextMenu={(e) => handleFilterMenu(e, column.key)}
                    data-filter-trigger="true"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {column.label}
                      </span>
                      <div className="flex items-center space-x-1">
                        {renderSortIcon(column.key)}
                        {filters[column.key] &&
                          filters[column.key].length > 0 && (
                            <svg
                              className="w-3 h-3 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                      </div>
                    </div>

                    {/* 리사이즈 핸들 */}
                    <div
                      className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-300 active:bg-blue-400 z-50"
                      style={{
                        pointerEvents: "auto",
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        setPreventSort(true); // 즉시 정렬 방지 설정
                        handleMouseDown(e, column.key);
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        setPreventSort(true); // 클릭 시에도 정렬 방지
                      }}
                      onMouseUp={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        // 마우스업 시에도 잠시 정렬 방지 유지
                        setTimeout(() => {
                          setPreventSort(false);
                        }, 150);
                      }}
                      onDoubleClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                      }}
                    />

                    {/* 필터 메뉴 */}
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
                  </th>
                ))}

                {/* Actions 컬럼 */}
                <th
                  className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative"
                  style={{ width: columnWidths.actions || 80 }}
                >
                  Actions
                  {/* 리사이즈 핸들 */}
                  <div
                    className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-300 active:bg-blue-400 z-50"
                    style={{
                      pointerEvents: "auto",
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setPreventSort(true);
                      handleMouseDown(e, "actions");
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setPreventSort(true);
                    }}
                    onMouseUp={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      setTimeout(() => {
                        setPreventSort(false);
                      }, 150);
                    }}
                    onDoubleClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                    }}
                  />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {currentData.map((row, index) => (
                <tr
                  key={`${row.id}-${index}`}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800/50"
                  } ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {/* 체크박스 컬럼 */}
                  <td
                    className="sticky left-0 z-10 px-4 py-1 whitespace-nowrap bg-inherit border-r border-gray-200 dark:border-gray-700"
                    style={{ width: columnWidths.checkbox || 60 }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>

                  {/* 데이터 컬럼들 */}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-1 whitespace-nowrap border-r border-gray-200 dark:border-gray-700 ${
                        column.className
                      } ${
                        column.sticky ? column.sticky + " z-10" : ""
                      } bg-inherit`}
                      style={{ width: columnWidths[column.key] || 120 }}
                    >
                      {renderCell(row, column, editingRow === row.id)}
                    </td>
                  ))}

                  {/* Actions 컬럼 */}
                  <td
                    className="px-4 py-1 whitespace-nowrap text-sm text-gray-500 relative z-10"
                    style={{ width: columnWidths.actions || 80 }}
                  >
                    {editingRow === row.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSave();
                          }}
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                          title="Save"
                          type="button"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCancel();
                          }}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Cancel"
                          type="button"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit(row);
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="Edit"
                          type="button"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // 삭제 로직 추가 필요
                            console.log("Delete clicked for row:", row.id);
                          }}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Delete"
                          type="button"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={sortedData.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(newItemsPerPage) => {
          setItemsPerPage(newItemsPerPage);
          setCurrentPage(1);
        }}
      />
    </section>
  );
}
