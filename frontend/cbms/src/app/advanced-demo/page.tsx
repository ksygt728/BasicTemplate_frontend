/**
 * @파일명 : page.tsx
 * @설명 : 고급 테이블 및 검색 폼 데모 페이지
 * @작성일 : 2025.12.07
 */

"use client";

import React, { useState } from "react";
import {
  Button,
  AdvancedTable,
  SearchForm,
  Badge,
} from "@/components/common/themed";
import type {
  AdvancedTableColumn,
  SearchField,
} from "@/components/common/themed";
import { theme } from "@/styles/theme";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

export default function AdvancedDemoPage() {
  const initialData: UserData[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      status: "active",
      createdAt: "2024-02-20",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "User",
      status: "inactive",
      createdAt: "2024-03-10",
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      role: "Manager",
      status: "active",
      createdAt: "2024-01-05",
    },
    {
      id: 5,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
      status: "pending",
      createdAt: "2024-04-01",
    },
    {
      id: 6,
      name: "David Lee",
      email: "david@example.com",
      role: "Manager",
      status: "active",
      createdAt: "2024-03-20",
    },
    {
      id: 7,
      name: "Emma Wilson",
      email: "emma@example.com",
      role: "User",
      status: "active",
      createdAt: "2024-02-15",
    },
    {
      id: 8,
      name: "Frank Miller",
      email: "frank@example.com",
      role: "User",
      status: "inactive",
      createdAt: "2024-01-30",
    },
  ];

  const [tableData, setTableData] = useState<UserData[]>(initialData);
  const [searchResults, setSearchResults] = useState<UserData[]>(initialData);

  const searchFields: SearchField[] = [
    {
      name: "name",
      label: "User Name",
      type: "text",
      placeholder: "Enter name...",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email...",
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "", label: "All" },
        { value: "Admin", label: "Admin" },
        { value: "Manager", label: "Manager" },
        { value: "User", label: "User" },
      ],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending" },
      ],
    },
    {
      name: "createdDate",
      label: "Created Date",
      type: "dateRange",
    },
  ];

  const tableColumns: AdvancedTableColumn<UserData>[] = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
      width: "80px",
      sortable: true,
      editable: false,
    },
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      sortable: true,
      editable: true,
      required: true,
      type: "text",
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      sortable: true,
      editable: true,
      required: true,
      type: "email",
    },
    {
      key: "role",
      title: "Role",
      dataIndex: "role",
      width: "120px",
      align: "center",
      editable: true,
      type: "select",
      options: ["Admin", "Manager", "User"],
      render: (value) => (
        <Badge
          variant={
            value === "Admin"
              ? "error"
              : value === "Manager"
              ? "warning"
              : "neutral"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      width: "120px",
      align: "center",
      editable: true,
      type: "select",
      options: ["active", "inactive", "pending"],
      render: (value) => (
        <Badge
          dot
          variant={
            value === "active"
              ? "success"
              : value === "inactive"
              ? "error"
              : "warning"
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Created At",
      dataIndex: "createdAt",
      width: "140px",
      sortable: true,
      editable: true,
      type: "date",
    },
  ];

  const handleSearch = (searchData: Record<string, any>) => {
    console.log("Search:", searchData);

    let filtered = [...tableData];

    // Name filter
    if (searchData.name) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchData.name.toLowerCase())
      );
    }

    // Email filter
    if (searchData.email) {
      filtered = filtered.filter((item) =>
        item.email.toLowerCase().includes(searchData.email.toLowerCase())
      );
    }

    // Role filter
    if (searchData.role) {
      filtered = filtered.filter((item) => item.role === searchData.role);
    }

    // Status filter
    if (searchData.status) {
      filtered = filtered.filter((item) => item.status === searchData.status);
    }

    // Date range filter
    if (searchData.createdDateStart) {
      filtered = filtered.filter(
        (item) => item.createdAt >= searchData.createdDateStart
      );
    }
    if (searchData.createdDateEnd) {
      filtered = filtered.filter(
        (item) => item.createdAt <= searchData.createdDateEnd
      );
    }

    setSearchResults(filtered);
  };

  const handleResetSearch = () => {
    setSearchResults(tableData);
  };

  const handleAdd = async (record: UserData) => {
    console.log("Add:", record);
    const newId = Math.max(...tableData.map((item) => item.id)) + 1;
    const newRecord = { ...record, id: newId };
    setTableData((prev) => [...prev, newRecord]);
    setSearchResults((prev) => [...prev, newRecord]);
    return newRecord;
  };

  const handleUpdate = async (id: React.Key, record: UserData) => {
    console.log("Update:", id, record);
    setTableData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...record } : item))
    );
    setSearchResults((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...record } : item))
    );
    return record;
  };

  const handleDelete = async (id: React.Key) => {
    console.log("Delete:", id);
    setTableData((prev) => prev.filter((item) => item.id !== id));
    setSearchResults((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBulkDelete = async (ids: React.Key[]) => {
    console.log("Bulk Delete:", ids);
    setTableData((prev) => prev.filter((item) => !ids.includes(item.id)));
    setSearchResults((prev) => prev.filter((item) => !ids.includes(item.id)));
  };

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: theme.colors.background.default,
    color: theme.colors.text.primary,
    padding: theme.spacing.xxl,
    fontFamily: theme.typography.fontFamily,
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "1400px",
    margin: "0 auto",
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: theme.spacing.xl,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "32px",
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "16px",
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: theme.spacing.xxl,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottom: `1px solid ${theme.colors.border.default}`,
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Advanced Table & Search Form Demo</h1>
          <p style={subtitleStyle}>
            고급 테이블: 페이징, 다중 정렬, 필터, 선택, 인라인 편집, CRUD, 엑셀
            내보내기, More Actions
          </p>
          <p style={subtitleStyle}>검색 폼: 다양한 입력 타입, 실시간 필터링</p>
          <div
            style={{
              backgroundColor: theme.colors.background.surface,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.border.default}`,
              marginTop: theme.spacing.md,
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.xs,
              }}
            >
              <strong style={{ color: theme.colors.primary.default }}>
                💡 Tip:
              </strong>
            </p>
            <ul
              style={{
                fontSize: "14px",
                color: theme.colors.text.secondary,
                paddingLeft: theme.spacing.lg,
                lineHeight: theme.typography.lineHeight.relaxed,
              }}
            >
              <li>
                <strong>다중 정렬</strong>: 컬럼 헤더를 순차적으로 클릭하면 정렬
                우선순위가 표시됩니다 (▲1, ▼2 등)
              </li>
              <li>
                <strong>필터</strong>: 컬럼 헤더를 우클릭하면 필터 메뉴가
                나타납니다 (검색 및 체크박스 선택)
              </li>
              <li>
                <strong>More Actions</strong>: 선택 후 More Actions 버튼으로
                Bulk Copy, Bulk Delete, Clear Sorts 실행
              </li>
            </ul>
          </div>
        </div>

        {/* SearchForm Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>SearchForm Component</h2>
          <SearchForm
            fields={searchFields}
            onSearch={handleSearch}
            onReset={handleResetSearch}
            columns={3}
            searchButtonText="Search"
            resetButtonText="Reset"
          />
        </section>

        {/* AdvancedTable Section */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>AdvancedTable Component</h2>
          <AdvancedTable
            columns={tableColumns}
            data={searchResults}
            rowKey="id"
            title="User Management"
            subTitle="Complete CRUD operations with inline editing"
            description={`Total: ${searchResults.length} users`}
            pagination={{
              pageSize: 5,
              pageSizeOptions: [5, 10, 20, 50],
            }}
            selection={{
              type: "checkbox",
              onChange: (selectedRowKeys, selectedRows) => {
                console.log("Selected:", selectedRowKeys, selectedRows);
              },
            }}
            filtering
            editable
            exportable
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            onRowClick={(record) => console.log("Row clicked:", record)}
          />
        </section>

        {/* Documentation */}
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Features</h2>
          <div
            style={{
              backgroundColor: theme.colors.background.surface,
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.border.default}`,
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: theme.typography.weights.semibold,
                marginBottom: theme.spacing.md,
                color: theme.colors.text.primary,
              }}
            >
              AdvancedTable
            </h3>
            <ul
              style={{
                listStyle: "disc",
                paddingLeft: theme.spacing.xl,
                color: theme.colors.text.secondary,
                lineHeight: theme.typography.lineHeight.relaxed,
              }}
            >
              <li>
                ✓ <strong>Pagination</strong>: 페이지 단위 데이터 표시, 페이지
                크기 설정 가능
              </li>
              <li>
                ✓ <strong>Multi-Sort</strong>: 여러 컬럼 순차 클릭으로 다중
                정렬, 정렬 순서 표시 (▲1, ▼2)
              </li>
              <li>
                ✓ <strong>Filtering</strong>: 컬럼 헤더 우클릭으로 필터 메뉴
                (검색, Select All, Clear All)
              </li>
              <li>
                ✓ <strong>More Actions</strong>: Bulk Copy (클립보드), Bulk
                Delete, Clear All Sorts
              </li>
              <li>
                ✓ <strong>Selection</strong>: 체크박스로 단일/다중 선택, 전체
                선택
              </li>
              <li>
                ✓ <strong>Inline Editing</strong>: 행 더블클릭 또는 Edit
                버튼으로 인라인 편집
              </li>
              <li>
                ✓ <strong>CRUD Operations</strong>: Add, Update, Delete 콜백
                지원
              </li>
              <li>
                ✓ <strong>Excel Export</strong>: CSV 형식으로 데이터 내보내기
                (BOM 포함, 한글 지원)
              </li>
              <li>
                ✓ <strong>Field Types</strong>: text, number, date, email,
                select 타입 지원
              </li>
              <li>
                ✓ <strong>Validation</strong>: 필수 필드 표시 및 유효성 검사
              </li>
              <li>
                ✓ <strong>Custom Rendering</strong>: render 함수로 셀
                커스터마이징
              </li>
            </ul>

            <h3
              style={{
                fontSize: "18px",
                fontWeight: theme.typography.weights.semibold,
                marginTop: theme.spacing.lg,
                marginBottom: theme.spacing.md,
                color: theme.colors.text.primary,
              }}
            >
              SearchForm
            </h3>
            <ul
              style={{
                listStyle: "disc",
                paddingLeft: theme.spacing.xl,
                color: theme.colors.text.secondary,
                lineHeight: theme.typography.lineHeight.relaxed,
              }}
            >
              <li>
                ✓ <strong>Field Types</strong>: text, select, date, dateRange,
                number, email
              </li>
              <li>
                ✓ <strong>Layout</strong>: horizontal/vertical 레이아웃, 컬럼 수
                설정
              </li>
              <li>
                ✓ <strong>Validation</strong>: required, disabled 옵션
              </li>
              <li>
                ✓ <strong>Integration</strong>: 테이블과 완벽한 연동, 실시간
                필터링
              </li>
              <li>
                ✓ <strong>Reset</strong>: 검색 조건 초기화
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
