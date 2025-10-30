/**
 * @파일명 : BasicTableView.tsx
 * @설명 : 기본 테이블 뷰 컴포넌트. 컬럼 정의, 데이터 표시, 정렬, 필터, 페이징, 행 편집/추가/삭제, 엑셀 내보내기 등 다양한 기능을 제공.
 * @작성자 : 김승연
 * @작성일 : 2025.10.17
 * @변경이력 :
 *       2025.10.17 김승연 최초 생성
 *
 * @interface TableColumn
 * @property {string} key - 컬럼의 고유 키
 * @property {string} label - 컬럼 헤더 라벨
 * @property {boolean} sortable - 정렬 가능 여부
 * @property {number} [width] - 컬럼 너비(px)
 * @property {string} [sticky] - sticky 스타일 클래스
 * @property {boolean} [editable] - 편집 가능 여부
 * @property {string} [type] - 데이터 타입(text, number, select 등)
 * @property {boolean} [required] - 필수 입력 여부
 * @property {string} [className] - 추가 CSS 클래스
 * @property {(value: any) => React.ReactNode} [render] - 셀 커스텀 렌더 함수
 * @property {string[]} [options] - select 타입 옵션 목록
 *
 * @interface BasicTableViewProps
 * @property {TableColumn[]} [columns] - 테이블 컬럼 정의 배열
 * @property {any[]} [data] - 테이블 데이터 배열
 * @property {string} [title] - 테이블 제목
 * @property {string} [subTitle] - 테이블 부제목
 * @property {string} [description] - 테이블 설명
 * @property {(row: any) => void} [onRowClick] - 행 클릭 이벤트 핸들러
 * @property {(rowData: any) => void} [onSaveNewRow] - 새 행 저장 이벤트 핸들러
 * @property {(rowData: any) => void} [onUpdateRow] - 기존 행 수정 이벤트 핸들러
 * @property {(rowData: any) => Promise<any>} [onInsert] - 새 행 추가 API 호출 함수
 * @property {(id: string | number, rowData: any) => Promise<any>} [onUpdate] - 기존 행 수정 API 호출 함수
 * @property {(id: string | number) => Promise<any>} [onDelete] - 행 삭제 API 호출 함수
 *
 * @component
 * @param {BasicTableViewProps} props - 테이블 뷰 컴포넌트 props
 * @returns {JSX.Element} 테이블 뷰 UI
 */

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
import { useAlert } from "@/contexts/AlertContext";

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
  required?: boolean; // 필수 입력 여부
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
  onSaveNewRow?: (rowData: any) => void;
  onUpdateRow?: (rowData: any) => void;
  // API 함수들
  onInsert?: (rowData: any) => Promise<any>; // Add Record 버튼 클릭시 호출
  onUpdate?: (id: string | number, rowData: any) => Promise<any>; // Edit 후 Check 버튼 클릭시 호출
  onDelete?: (id: string | number) => Promise<any>; // 휴지통 버튼 후 Check 버튼 클릭시 호출
}

export default function BasicTableView({
  columns: propColumns,
  data: propData,
  title,
  subTitle,
  description,
  onRowClick,
  onSaveNewRow,
  onUpdateRow,
  onInsert,
  onUpdate,
  onDelete,
}: BasicTableViewProps) {
  // Alert 훅
  const { showAlert } = useAlert();

  // Refs for detecting clicks outside
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const moreActionsRef = useRef<HTMLDivElement>(null);

  // State 관리
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRow, setEditingRow] = useState<string | number | null>(null);
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
  const [newRows, setNewRows] = useState<any[]>([]);
  const [deletingRow, setDeletingRow] = useState<string | number | null>(null); // 삭제 중인 행 ID
  const [filterMenuOpen, setFilterMenuOpen] = useState<string | null>(null);
  const [filterMenuPosition, setFilterMenuPosition] = useState({ x: 0, y: 0 });
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
  const [filterSearchTerm, setFilterSearchTerm] = useState<{
    [key: string]: string;
  }>({});

  // Props에서 전달받은 컬럼만 사용 (기본 컬럼 제거)
  const columns = useMemo(() => {
    if (!propColumns) {
      return [];
    }
    return propColumns.map((col) => ({
      key: col.key,
      label: col.label,
      sortable: col.sortable,
      width: `min-w-[${col.width || 120}px]`,
      editable: col.editable || false,
      type: col.type || "text",
      required: col.required || false,
      className: col.className || "text-sm text-gray-900 dark:text-white",
      sticky: col.sticky || "",
      render: col.render,
      options: col.options,
    }));
  }, [propColumns]);

  // 컬럼이 변경될 때마다 columnWidths 초기화
  useEffect(() => {
    const newColumnWidths: { [key: string]: number } = {
      checkbox: 60,
      actions: 80,
    };

    // 각 컬럼에 대해 기본 너비 설정 (props에서 온 컬럼만 처리)
    columns.forEach((column) => {
      newColumnWidths[column.key] = column.width
        ? typeof column.width === "number"
          ? column.width
          : parseInt(column.width.toString().replace(/[^\d]/g, "")) || 120
        : 120;
    });

    setColumnWidths(newColumnWidths);
  }, [columns, propColumns]);

  // 데이터가 변경될 때 새 행 상태 초기화
  useEffect(() => {
    if (newRows.length > 0) {
      setNewRows([]);
      setEditingRow(null);
      setEditData({});
    }
  }, [propData]); // propData가 변경될 때마다 실행

  // More Actions 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMoreActionsOpen &&
        moreActionsRef.current &&
        !moreActionsRef.current.contains(event.target as Node)
      ) {
        setIsMoreActionsOpen(false);
      }
    };

    if (isMoreActionsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isMoreActionsOpen]);

  // 편집 데이터 업데이트 함수
  const updateEditData = (columnKey: string, value: any, item: any) => {
    // 새 행인 경우 newRows 배열만 업데이트 (각 행의 독립적 데이터 관리)
    if (item.isNew) {
      setNewRows((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, [columnKey]: value } : row
        )
      );
    } else {
      // 기존 행인 경우에만 editData 사용
      setEditData((prev: any) => ({ ...prev, [columnKey]: value }));
    }
  };

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
    // 새로운 행인 경우 item의 값을 직접 사용, 기존 행인 경우 editData 사용
    // editData에 해당 키가 있으면 그 값을 사용 (빈 문자열이라도), 없으면 원래 값 사용
    const rawDisplayValue = item.isNew
      ? value
      : column.key in editData
      ? editData[column.key]
      : value;

    // displayValue가 undefined나 null이면 빈 문자열로 변환하여 controlled input 오류 방지
    const displayValue = rawDisplayValue ?? "";

    // 편집 모드일 때 편집 가능 여부 확인 (id 컬럼 제외)
    // 새 행인 경우 모든 컬럼 편집 가능, 기존 행인 경우 editable이 false가 아닌 컬럼만 편집 가능
    if (
      isEditing &&
      column.key !== "id" &&
      (item.isNew || column.editable !== false)
    ) {
      // 필수 필드 스타일링
      const requiredClass = column.required
        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500";

      // 편집 모드
      switch (column.type) {
        case "select":
          return (
            <div className="relative">
              <select
                value={displayValue}
                onChange={(e) =>
                  updateEditData(column.key, e.target.value, item)
                }
                className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 ${requiredClass}`}
              >
                <option value="">
                  {column.required ? "필수 선택" : "선택하세요"}
                </option>
                {column.options?.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {column.required && (
                <span className="absolute -top-2 -right-2 text-red-500 text-xs">
                  *
                </span>
              )}
            </div>
          );
        case "number":
          return (
            <div className="relative">
              <input
                type="number"
                value={displayValue}
                placeholder={column.required ? "필수 입력" : ""}
                onChange={(e) =>
                  updateEditData(column.key, e.target.value, item)
                }
                className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 ${requiredClass}`}
              />
              {column.required && (
                <span className="absolute -top-2 -right-2 text-red-500 text-xs">
                  *
                </span>
              )}
            </div>
          );
        case "date":
          return (
            <div className="relative">
              <input
                type="date"
                value={displayValue}
                onChange={(e) =>
                  updateEditData(column.key, e.target.value, item)
                }
                className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 ${requiredClass}`}
              />
              {column.required && (
                <span className="absolute -top-2 -right-2 text-red-500 text-xs">
                  *
                </span>
              )}
            </div>
          );
        case "email":
          return (
            <div className="relative">
              <input
                type="email"
                value={displayValue}
                placeholder={column.required ? "필수 입력" : ""}
                onChange={(e) =>
                  updateEditData(column.key, e.target.value, item)
                }
                className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 ${requiredClass}`}
              />
              {column.required && (
                <span className="absolute -top-2 -right-2 text-red-500 text-xs">
                  *
                </span>
              )}
            </div>
          );
        default:
          return (
            <div className="relative">
              <input
                type="text"
                value={displayValue}
                placeholder={column.required ? "필수 입력" : ""}
                onChange={(e) =>
                  updateEditData(column.key, e.target.value, item)
                }
                className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 ${requiredClass}`}
              />
              {column.required && (
                <span className="absolute -top-2 -right-2 text-red-500 text-xs">
                  *
                </span>
              )}
            </div>
          );
      }
    } else {
      // 표시 모드
      const displayContent = () => {
        if (column.render) {
          return column.render(value);
        }

        if (column.type === "number" && typeof value === "number") {
          return column.key === "license"
            ? `${value}%`
            : value.toLocaleString();
        }

        return value;
      };

      // editable: false인 컬럼(Primary Key 등)을 편집 모드에서 비활성화 스타일로 표시
      // 단, 새 행인 경우에는 모든 컬럼이 편집 가능하므로 비활성화 스타일 적용 안함
      if (column.editable === false && isEditing && !item.isNew) {
        return (
          <div className="bg-gray-50 px-2 py-1 text-gray-400 cursor-not-allowed border border-gray-200 rounded opacity-60">
            {displayContent()}
          </div>
        );
      }

      return displayContent();
    }
  };

  // Props에서 전달받은 데이터만 사용 (기본 데이터 제거)
  const baseTableData = propData || [];

  // 새 행 추가 기능
  const handleAddRecord = () => {
    const newRow: any = {
      id: `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // 더 고유한 ID 생성
      isNew: true,
    };

    // 각 컬럼에 대해 빈 값으로 초기화
    columns.forEach((column) => {
      if (column.key !== "id") {
        newRow[column.key] = "";
      }
    });

    // 새 행 배열에 추가
    setNewRows((prev) => [...prev, newRow]);

    // 새 행을 편집 모드로 설정 (신규 행은 newRows에서 관리하므로 editData는 빈 객체로)
    setEditingRow(newRow.id);
    setEditData({});
  };

  // Excel 내보내기 기능
  const handleExportExcel = async () => {
    try {
      // CSV 형태로 데이터 변환
      const headers = columns.map((col) => col.label).join(",");
      const csvData = tableData
        .map((row) =>
          columns
            .map((col) => {
              const value = row[col.key] || "";
              // 쉼표가 포함된 값은 따옴표로 감싸기
              return typeof value === "string" && value.includes(",")
                ? `"${value}"`
                : value;
            })
            .join(",")
        )
        .join("\n");

      const csvContent = `${headers}\n${csvData}`;

      // BOM 추가 (한글 깨짐 방지)
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
    } catch (error) {
      await showAlert({
        type: "error",
        title: "Excel 내보내기 오류",
        message: "Excel 내보내기 중 오류가 발생했습니다.",
        data: error,
      });
    }
  };

  // 새 행들이 있을 경우 테이블 데이터에 추가
  const tableData =
    newRows.length > 0 ? [...baseTableData, ...newRows] : baseTableData;

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

  // 필수 값 검증 함수
  const validateRequiredFields = (rowData: any) => {
    const missingFields: string[] = [];

    columns.forEach((column) => {
      if (column.required && column.key !== "id") {
        const value = rowData[column.key];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          missingFields.push(column.label);
        }
      }
    });

    return missingFields;
  };

  // 편집 저장
  const handleSave = async (targetRowId?: string | number) => {
    // 저장할 행 ID 결정 (파라미터로 받거나 현재 편집 중인 행)
    const rowIdToSave = targetRowId || editingRow;

    // 해당 행이 신규 행인지 확인
    const currentRow = newRows.find((row) => row.id === rowIdToSave);

    // 저장할 데이터 결정 - 지정된 행의 데이터만 사용
    let dataToSave: any;
    if (currentRow && currentRow.isNew) {
      // 신규 행: newRows에서 해당 행의 최신 데이터만 사용
      dataToSave = { ...currentRow };
    } else {
      // 기존 행: editData 사용 (현재 편집 중인 행과 저장할 행이 같은 경우만)
      if (rowIdToSave === editingRow) {
        dataToSave = editData;
      } else {
        console.error("기존 행 데이터를 찾을 수 없습니다:", rowIdToSave);
        return;
      }
    }

    // 필수 값 검증
    const missingFields = validateRequiredFields(dataToSave);
    if (missingFields.length > 0) {
      await showAlert({
        type: "warning",
        title: "필수 값 누락",
        message:
          "필수 값이 작성되지 않았습니다.\n누락된 필드: " +
          missingFields.join(", "),
      });
      return;
    }

    try {
      if (currentRow && currentRow.isNew) {
        // 새 행 저장 로직 (INSERT)
        // API 호출
        if (onInsert) {
          const finalRowData = { ...currentRow };
          delete finalRowData.isNew; // isNew 속성 제거
          delete finalRowData.id; // 임시 ID 제거 (서버에서 생성)

          await onInsert(finalRowData);
        }

        // 기존 콜백도 유지
        if (onSaveNewRow) {
          const finalRowData = { ...currentRow };
          delete finalRowData.isNew;
          onSaveNewRow(finalRowData);
        }

        // 저장된 새 행을 배열에서 제거
        setNewRows((prev) => prev.filter((row) => row.id !== rowIdToSave));
      } else {
        // 기존 행 수정 로직 (UPDATE)
        // API 호출
        if (onUpdate && rowIdToSave) {
          await onUpdate(rowIdToSave, editData);
        }

        // 기존 콜백도 유지
        if (onUpdateRow) {
          onUpdateRow(editData);
        }
      }

      // 저장된 행이 현재 편집 중인 행이면 편집 상태 해제
      if (rowIdToSave === editingRow) {
        setEditingRow(null);
        setEditData({});
      }
    } catch (error) {
      await showAlert({
        type: "error",
        title: "저장 오류",
        message: "저장 중 오류가 발생했습니다.",
        data: error,
      });
    }
  };

  // 편집 취소
  const handleCancel = () => {
    const currentRow = newRows.find((row) => row.id === editingRow);

    if (currentRow && currentRow.isNew) {
      // 취소할 새 행을 배열에서 제거
      setNewRows((prev) => prev.filter((row) => row.id !== editingRow));
    }

    setEditingRow(null);
    setEditData({});
    setDeletingRow(null); // 삭제 상태도 초기화
  };

  // 새 행 즉시 삭제 함수 (편집 중이 아닌 행도 삭제 가능)
  const handleDeleteNewRow = (rowId: string | number) => {
    setNewRows((prev) => prev.filter((row) => row.id !== rowId));

    // 삭제된 행이 현재 편집 중인 행이면 편집 상태 초기화
    if (editingRow === rowId) {
      setEditingRow(null);
      setEditData({});
    }

    // 선택된 행이 삭제되는 경우 선택 해제
    setSelectedRows((prev) => prev.filter((id) => id !== rowId));
  };

  // 삭제 시작 (휴지통 버튼 클릭)
  const handleStartDelete = (rowId: string | number) => {
    showAlert({
      message: "삭제하시겠습니까?",
      type: "info",
      title: "삭제 확인",
      showCancel: true,
      onOk: () => {
        handleConfirmDelete(rowId);
      },
    });
  };

  // 삭제 확인 (check 버튼 클릭)
  const handleConfirmDelete = async (rowId: string | number) => {
    try {
      // 새 행인 경우 배열에서만 제거
      const isNewRow = newRows.some((row) => row.id === rowId);

      if (isNewRow) {
        setNewRows((prev) => prev.filter((row) => row.id !== rowId));

        // 편집 중인 행이 삭제되는 경우 편집 상태 초기화
        if (editingRow === rowId) {
          setEditingRow(null);
          setEditData({});
        }

        // 선택된 행이 삭제되는 경우 선택 해제
        setSelectedRows((prev) => prev.filter((id) => id !== rowId));
      } else {
        // 기존 행인 경우 API 호출
        if (onDelete) {
          await onDelete(rowId);
        }
      }

      setDeletingRow(null);
    } catch (error) {
      await showAlert({
        type: "error",
        title: "삭제 오류",
        message: "삭제 중 오류가 발생했습니다.",
        data: error,
      });
    }
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
        subTitle={subTitle}
        description={description}
      />

      {/* 버튼 영역 - Export Excel, More Actions, Add Record */}
      <div className="flex items-center justify-end mb-4 gap-x-3">
        <button
          onClick={handleExportExcel}
          className="flex items-center justify-center px-4 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 cursor-pointer"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export Excel
        </button>

        <div ref={moreActionsRef} className="relative more-actions-dropdown">
          <button
            onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
            className="flex items-center justify-center px-4 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 cursor-pointer"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            More Actions
            <svg
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                isMoreActionsOpen ? "rotate-180" : ""
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

          {/* 드롭다운 메뉴 */}
          {isMoreActionsOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 z-50">
              <div className="py-1">
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                  <svg
                    className="w-4 h-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Bulk Export
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                  <svg
                    className="w-4 h-4 mr-3"
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
                  Bulk Delete
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                  <svg
                    className="w-4 h-4 mr-3"
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
                  Bulk Edit
                </button>
                <div className="border-t border-gray-100 dark:border-gray-600 my-1"></div>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setSortConfig([]);
                    setIsMoreActionsOpen(false);
                  }}
                  disabled={sortConfig.length === 0}
                >
                  <svg
                    className="w-4 h-4 mr-3"
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
                  Clear All Sorts ({sortConfig.length})
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleAddRecord}
          className="flex items-center justify-center px-4 py-2 text-sm text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Record
        </button>
      </div>

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
                  className="sticky left-0 z-30 px-4 py-1 text-left text-xs font-medium text-gray-500 tracking-wider bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
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
                    className={`px-4 py-1 text-left text-xs font-medium text-gray-500 tracking-wider border-r border-gray-200 dark:border-gray-700 relative ${
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
                      <span
                        className={`font-medium flex items-center ${
                          column.editable === false
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {column.label}
                        {column.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
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
                  className="px-4 py-1 text-left text-xs font-medium text-gray-500 tracking-wider relative"
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
                      {renderCell(
                        row,
                        column,
                        editingRow === row.id || row.isNew
                      )}
                    </td>
                  ))}

                  {/* Actions 컬럼 */}
                  <td
                    className="px-4 py-1 whitespace-nowrap text-sm text-gray-500 relative z-10"
                    style={{ width: columnWidths.actions || 80 }}
                  >
                    {editingRow === row.id || row.isNew ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSave(row.id);
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
                            // 새 행인 경우 즉시 삭제, 기존 행인 경우 편집 취소
                            if (row.isNew) {
                              handleDeleteNewRow(row.id);
                            } else {
                              handleCancel();
                            }
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
                    ) : deletingRow === row.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleConfirmDelete(row.id);
                          }}
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                          title="Confirm Delete"
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
                            setDeletingRow(null);
                          }}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Cancel Delete"
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
                            handleStartDelete(row.id);
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
