"use client";

import { useEffect, useRef, useState } from "react";
import SplitFrame from "@/components/layout/frame/SplitFrame";
import { SearchForm } from "@/components/common/themed/SearchForm";
import { Table } from "@/components/common/themed/Table";
import { Button } from "@/components/common/themed/Button";
import { Input } from "@/components/common/themed/Input";
import { Select } from "@/components/common/themed/Select";
import { Card } from "@/components/common/themed/Card";
import { searchFields, userTableColumns, detailFormFields } from "./info";
import { useUserService } from "@/service/UserService";
import { useAlert } from "@/contexts/AlertContext";

/**
 * @파일명 : page.tsx
 * @설명 : 사용자 관리 페이지 - 렌더링만 담당
 * @작성자 : 김승연
 * @작성일 : 2025.12.10
 * @변경이력 :
 *       2025.12.10 김승연 최초 생성
 */
export default function UserManagementPage() {
  const {
    // 상태
    loading,
    error,
    selectedUserId,
    searchFormData,

    // 원본 데이터
    userData,
    selectedUserData,

    // 테이블 데이터
    userListData,
    userDetailData,

    // 상태 변경
    setSearchFormData,
    setSelectedUserId,

    // 비즈니스 로직
    handleSearch,
    handleTableRowClick,
    refetch,

    // 사용자 CRUD
    handleInsertUser,
    handleUpdateUser,
    handleDeleteUser,
  } = useUserService();

  const { showAlert } = useAlert();

  // 중복 호출 방지 플래그
  const isFetched = useRef(false);

  // 상세정보 폼 데이터 상태
  const [formData, setFormData] = useState<Record<string, any>>({});
  // 원본 데이터 백업 (취소 시 복원용)
  const originalFormData = useRef<Record<string, any>>({});
  // 수정모드 상태
  const [isEditing, setIsEditing] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 테이블 row 클릭 시 상세정보 즉시 표시 (API 호출 없이 row 데이터 사용)
  const handleTableRowClickInstant = (row: any) => {
    // API 호출 없이 selectedUserId만 직접 설정 (버튼 표시를 위해)
    setSelectedUserId(row.userId);
    setFormData(row); // 상세정보 즉시 세팅
    originalFormData.current = { ...row }; // 원본 데이터 백업
    setIsEditing(false);
  };

  // ============================================================================
  // 폼 데이터 변경 핸들러
  // ============================================================================

  const handleFormChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================================================================
  // CRUD 핸들러
  // ============================================================================

  /**
   * @function handleSave
   * @description 사용자 정보 저장 (수정)
   */
  const handleSave = async () => {
    try {
      // 필수 필드 검증
      if (!formData.userId || !formData.name || !formData.email) {
        await showAlert({
          type: "warning",
          title: "입력 오류",
          message: "필수 항목을 입력해주세요.",
        });
        return;
      }

      const result = await handleUpdateUser(formData);

      if (result?.success) {
        await showAlert({
          type: "success",
          title: "저장 완료",
          message: "사용자 정보가 성공적으로 저장되었습니다.",
        });
        setIsEditing(false); // 저장 후 읽기모드로
      } else {
        await showAlert({
          type: "error",
          title: "저장 실패",
          message: result?.message || "사용자 정보 저장에 실패했습니다.",
        });
      }
    } catch (error: any) {
      await showAlert({
        type: "error",
        title: "오류 발생",
        message: error?.message || "사용자 정보 저장 중 오류가 발생했습니다.",
      });
    }
  };

  /**
   * @function handleDelete
   * @description 사용자 삭제
   */
  const handleDelete = async () => {
    if (!selectedUserId) {
      await showAlert({
        type: "warning",
        title: "선택 오류",
        message: "삭제할 사용자를 선택해주세요.",
      });
      return;
    }

    const confirmed = await showAlert({
      type: "warning",
      title: "삭제 확인",
      message: "정말로 이 사용자를 삭제하시겠습니까?",
      showCancel: true,
    });

    if (!confirmed) return;

    try {
      const result = await handleDeleteUser(selectedUserId);

      if (result?.success) {
        await showAlert({
          type: "success",
          title: "삭제 완료",
          message: "사용자가 성공적으로 삭제되었습니다.",
        });
        setFormData({});
      } else {
        await showAlert({
          type: "error",
          title: "삭제 실패",
          message: result?.message || "사용자 삭제에 실패했습니다.",
        });
      }
    } catch (error: any) {
      await showAlert({
        type: "error",
        title: "오류 발생",
        message: error?.message || "사용자 삭제 중 오류가 발생했습니다.",
      });
    }
  };

  /**
   * @function handleRefresh
   * @description 데이터 새로고침
   */
  const handleRefresh = async () => {
    try {
      await refetch();
      await showAlert({
        type: "success",
        title: "새로고침 완료",
        message: "데이터가 새로고침되었습니다.",
      });
    } catch (error: any) {
      await showAlert({
        type: "error",
        title: "오류 발생",
        message: error?.message || "데이터 새로고침 중 오류가 발생했습니다.",
      });
    }
  };

  // ============================================================================
  // 렌더링 함수들
  // ============================================================================

  /**
   * @function renderDetailFormField
   * @description 상세정보 폼 필드 렌더링
   */
  const renderDetailFormField = (field: any) => {
    if (field.name === "password") return null; // 비밀번호 필드 완전 제거
    const value = formData[field.name] || "";

    if (field.type === "select") {
      return (
        <Select
          key={field.name}
          label={field.label}
          value={value}
          onChange={(val) => handleFormChange(field.name, val)}
          options={field.options || []}
          disabled={field.disabled || !isEditing}
          fullWidth
        />
      );
    }

    return (
      <Input
        key={field.name}
        type={field.type}
        label={field.label}
        value={value}
        onChange={(e) => handleFormChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        disabled={field.disabled || !isEditing}
        required={field.required}
        fullWidth
      />
    );
  };

  // ============================================================================
  // 좌측 컨텐츠: 검색 + 테이블
  // ============================================================================

  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const leftContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "16px",
      }}
    >
      {/* 검색 폼 */}
      <Card>
        <SearchForm
          fields={searchFields}
          onSearch={handleSearch}
          onReset={() => {
            setSearchFormData({});
            refetch();
          }}
          loading={loading}
          columns={3}
          searchButtonText="검색"
          resetButtonText="초기화"
        />
      </Card>

      {/* 테이블 */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          backgroundColor: "var(--background-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
            사용자 목록 ({userListData.length})
          </h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            새로고침
          </Button>
        </div>
        <Table
          columns={userTableColumns}
          data={userListData}
          rowKey="userId"
          loading={loading}
          emptyText="사용자 데이터가 없습니다."
          hoverable
          bordered
          onRowClick={handleTableRowClickInstant}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>
    </div>
  );

  // ============================================================================
  // 우측 컨텐츠: 상세정보
  // ============================================================================

  const rightContent = (
    <div
      style={{
        height: "100%",
        overflow: "auto",
        backgroundColor: "var(--background-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
          사용자 상세정보
        </h3>
        {selectedUserId && (
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              variant="error"
              size="sm"
              onClick={handleDelete}
              disabled={loading || isEditing}
            >
              삭제
            </Button>
            {!isEditing ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                수정
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={loading}
              >
                저장
              </Button>
            )}
            {isEditing && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFormData({ ...originalFormData.current }); // 원본 데이터로 복원
                  setIsEditing(false);
                }}
                disabled={loading}
              >
                취소
              </Button>
            )}
          </div>
        )}
      </div>

      {formData && formData.userId ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {detailFormFields.map((field) => renderDetailFormField(field))}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "200px",
            color: "var(--text-secondary)",
          }}
        >
          좌측 목록에서 사용자를 선택해주세요.
        </div>
      )}
    </div>
  );

  // ============================================================================
  // 메인 렌더링
  // ============================================================================

  return (
    <div style={{ height: "100%", padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: "700",
            color: "var(--text-primary)",
          }}
        >
          사용자 관리
        </h1>
        <p
          style={{
            margin: "8px 0 0 0",
            fontSize: "14px",
            color: "var(--text-secondary)",
          }}
        >
          사용자 정보를 조회하고 관리합니다.
        </p>
      </div>

      <SplitFrame
        leftContent={leftContent}
        rightContent={rightContent}
        leftWidth="50%"
        rightWidth="50%"
        resizable={true}
      />
    </div>
  );
}
