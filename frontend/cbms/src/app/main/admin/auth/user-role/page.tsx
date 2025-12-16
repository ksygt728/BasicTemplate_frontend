/**
 * @파일명 : page.tsx
 * @설명 : 사용자별 권한 관리 페이지 - 렌더링만 담당
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Frame } from "@/components/common/themed/Frame";
import { AdvancedTable } from "@/components/common/themed/AdvancedTable";
import { SearchForm } from "@/components/common/themed/SearchForm";
import { Button } from "@/components/common/themed/Button";
import { Input } from "@/components/common/themed/Input";
import { Badge } from "@/components/common/themed/Badge";
import { useRoleUserService } from "@/service/RoleUserService";
import {
  userSearchFields,
  userTableColumns,
  userRoleTableColumns,
  availableRoleTableColumns,
  initialSearchData,
} from "./info";
import { theme } from "@/styles/theme";
import { useAlert } from "@/contexts/AlertContext";

/**
 * @component UserRoleManagementPage
 * @description 사용자별 권한 관리 페이지 (2분할 레이아웃)
 */
export default function UserRoleManagementPage() {
  const {
    loading,
    selectedUser,
    userTableData,
    userRoleTableData,
    availableRoleTableData,
    handleSearchUsers,
    handleUserSelect,
    handleGrantRole,
    handleRevokeRole,
    handleToggleRoleUseYn,
    refetch,
  } = useRoleUserService();

  const { showAlert } = useAlert();

  // 중복 호출 방지 플래그
  const isFetched = useRef(false);

  // 검색어 상태 (부여 가능한 권한 검색용)
  const [roleSearchTerm, setRoleSearchTerm] = useState("");

  // 우측 영역 로딩 상태 (사용자 선택 시)
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================================
  // 이벤트 핸들러
  // ============================================================================

  /**
   * @function onSearchUsers
   * @description 사용자 검색 처리
   * @param {Record<string, any>} searchData - 검색 폼 데이터
   */
  const onSearchUsers = async (searchData: Record<string, any>) => {
    await handleSearchUsers(searchData);
  };

  /**
   * @function onUserRowClick
   * @description 사용자 테이블 행 클릭 처리
   * @param {any} row - 클릭된 행 데이터
   */
  const onUserRowClick = async (row: any) => {
    const user: any = {
      userId: row.userId,
      name: row.name,
      phoneNum: row.phoneNum,
      email: row.email,
      userType: row.userType,
      gender: row.gender,
      role: "",
      department: {
        deptCode: row.deptCode || "",
        deptNm: row.deptName || "",
        upperDeptCode: "",
        deptLv: 0,
        company: {} as any,
        useYn: "Y",
      },
    };

    setIsLoadingRoles(true);
    try {
      await handleUserSelect(user);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  /**
   * @function onGrantRole
   * @description 권한 부여 버튼 클릭 처리
   * @param {string} roleCd - 부여할 권한 코드
   */
  const onGrantRole = async (roleCd: string) => {
    if (!selectedUser) {
      showAlert({ message: "사용자를 먼저 선택해주세요.", type: "warning" });
      return;
    }

    try {
      await handleGrantRole(roleCd);
      showAlert({
        message: "권한이 성공적으로 부여되었습니다.",
        type: "success",
      });
    } catch (error) {
      showAlert({
        message: "권한 부여 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  /**
   * @function onRevokeRole
   * @description 권한 회수 버튼 클릭 처리
   * @param {string} roleCd - 회수할 권한 코드
   */
  const onRevokeRole = async (roleCd: string) => {
    if (!selectedUser) {
      showAlert({ message: "사용자를 먼저 선택해주세요.", type: "warning" });
      return;
    }

    try {
      await handleRevokeRole(roleCd);
      showAlert({
        message: "권한이 성공적으로 회수되었습니다.",
        type: "success",
      });
    } catch (error) {
      showAlert({
        message: "권한 회수 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  /**
   * @function onToggleUseYn
   * @description 권한 사용여부 토글 처리
   * @param {string} roleCd - 토글할 권한 코드
   */
  const onToggleUseYn = async (roleCd: string) => {
    if (!selectedUser) {
      showAlert({ message: "사용자를 먼저 선택해주세요.", type: "warning" });
      return;
    }

    try {
      await handleToggleRoleUseYn(roleCd);
      showAlert({
        message: "권한 사용여부가 변경되었습니다.",
        type: "success",
      });
    } catch (error) {
      showAlert({
        message: "권한 사용여부 변경 중 오류가 발생했습니다.",
        type: "error",
      });
    }
  };

  // ============================================================================
  // 필터링된 부여 가능한 권한 리스트
  // ============================================================================

  const filteredAvailableRoles = availableRoleTableData.filter(
    (role) =>
      role.roleCd.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
      role.roleName.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
      role.roleDesc.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );

  // ============================================================================
  // 좌측 콘텐츠: 사용자 검색 + 사용자 리스트
  // ============================================================================

  const leftContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.md,
        height: "100%",
      }}
    >
      {/* 사용자 검색 폼 */}
      <div
        style={{
          padding: theme.spacing.md,
          background: theme.colors.background.surface,
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.border.default}`,
        }}
      >
        <h3
          style={{
            margin: `0 0 ${theme.spacing.md} 0`,
            fontSize: "16px",
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text.primary,
          }}
        >
          사용자 검색
        </h3>
        <SearchForm
          fields={userSearchFields}
          initialValues={initialSearchData}
          onSearch={onSearchUsers}
        />
      </div>

      {/* 사용자 리스트 테이블 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <AdvancedTable
          title="사용자 목록"
          columns={userTableColumns.map((col) => ({
            key: col.key,
            title: col.label,
            width: col.width,
            sortable: col.sortable,
            filterable: col.filterable,
          }))}
          data={userTableData}
          onRowClick={onUserRowClick}
          emptyText="조회된 사용자가 없습니다."
          hoverable={true}
          striped={true}
        />
      </div>
    </div>
  );

  // ============================================================================
  // 우측 콘텐츠: 선택된 사용자 정보 + 권한 관리
  // ============================================================================

  const rightContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.md,
        height: "100%",
      }}
    >
      {/* 선택된 사용자 정보 */}
      <div
        style={{
          padding: theme.spacing.md,
          background: theme.colors.background.surface,
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.border.default}`,
        }}
      >
        <h3
          style={{
            margin: `0 0 ${theme.spacing.md} 0`,
            fontSize: "16px",
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text.primary,
          }}
        >
          선택된 사용자
        </h3>
        {selectedUser ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: theme.spacing.sm,
              fontSize: "14px",
            }}
          >
            <div style={{ color: theme.colors.text.secondary }}>
              <strong>사용자 ID:</strong> {selectedUser.userId}
            </div>
            <div style={{ color: theme.colors.text.secondary }}>
              <strong>이름:</strong> {selectedUser.name}
            </div>
            <div style={{ color: theme.colors.text.secondary }}>
              <strong>이메일:</strong> {selectedUser.email}
            </div>
            <div style={{ color: theme.colors.text.secondary }}>
              <strong>전화번호:</strong> {selectedUser.phoneNum}
            </div>
          </div>
        ) : (
          <div
            style={{
              color: theme.colors.text.tertiary,
              fontSize: "14px",
              textAlign: "center",
              padding: theme.spacing.md,
            }}
          >
            좌측에서 사용자를 선택해주세요.
          </div>
        )}
      </div>

      {/* 사용자가 가진 권한 리스트 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          background: theme.colors.background.surface,
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.border.default}`,
          padding: theme.spacing.md,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.md,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.text.primary,
            }}
          >
            보유 권한
          </h3>
          <Badge variant="primary">{`${userRoleTableData.length}개`}</Badge>
        </div>

        {selectedUser ? (
          <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            {userRoleTableData.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: theme.spacing.sm,
                }}
              >
                {userRoleTableData.map((role) => (
                  <div
                    key={role.roleCd}
                    style={{
                      padding: theme.spacing.md,
                      background: theme.colors.background.overlay,
                      borderRadius: theme.borderRadius.sm,
                      border: `1px solid ${theme.colors.border.default}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: theme.typography.weights.medium,
                          color: theme.colors.text.primary,
                          marginBottom: theme.spacing.xs,
                        }}
                      >
                        {role.roleName}{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            color: theme.colors.text.tertiary,
                          }}
                        >
                          ({role.roleCd})
                        </span>
                      </div>
                      {role.roleDesc && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: theme.colors.text.secondary,
                          }}
                        >
                          {role.roleDesc}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: theme.spacing.sm,
                        alignItems: "center",
                      }}
                    >
                      <Badge
                        variant={role.useYn === "Y" ? "success" : "neutral"}
                      >
                        {role.useYn === "Y" ? "사용" : "미사용"}
                      </Badge>
                      <Button
                        onClick={() => onToggleUseYn(role.roleCd)}
                        variant="secondary"
                        size="sm"
                      >
                        {role.useYn === "Y" ? "비활성화" : "활성화"}
                      </Button>
                      <Button
                        onClick={() => onRevokeRole(role.roleCd)}
                        variant="error"
                        size="sm"
                      >
                        회수
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  color: theme.colors.text.tertiary,
                  fontSize: "14px",
                  textAlign: "center",
                  padding: theme.spacing.xl,
                }}
              >
                보유한 권한이 없습니다.
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              color: theme.colors.text.tertiary,
              fontSize: "14px",
              textAlign: "center",
              padding: theme.spacing.xl,
            }}
          >
            사용자를 선택하면 권한이 표시됩니다.
          </div>
        )}
      </div>

      {/* 부여 가능한 권한 리스트 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          background: theme.colors.background.surface,
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.border.default}`,
          padding: theme.spacing.md,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.md,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.text.primary,
            }}
          >
            부여 가능한 권한
          </h3>
          <Badge variant="info">{`${filteredAvailableRoles.length}개`}</Badge>
        </div>

        {/* 권한 검색 */}
        <div style={{ marginBottom: theme.spacing.md }}>
          <Input
            value={roleSearchTerm}
            onChange={(e) => setRoleSearchTerm(e.target.value)}
            placeholder="권한 코드 또는 권한명으로 검색..."
          />
        </div>

        {selectedUser ? (
          <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            {filteredAvailableRoles.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: theme.spacing.sm,
                }}
              >
                {filteredAvailableRoles.map((role) => (
                  <div
                    key={role.roleCd}
                    style={{
                      padding: theme.spacing.md,
                      background: theme.colors.background.overlay,
                      borderRadius: theme.borderRadius.sm,
                      border: `1px solid ${theme.colors.border.default}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: theme.typography.weights.medium,
                          color: theme.colors.text.primary,
                          marginBottom: theme.spacing.xs,
                        }}
                      >
                        {role.roleName}{" "}
                        <span
                          style={{
                            fontSize: "12px",
                            color: theme.colors.text.tertiary,
                          }}
                        >
                          ({role.roleCd})
                        </span>
                      </div>
                      {role.roleDesc && (
                        <div
                          style={{
                            fontSize: "12px",
                            color: theme.colors.text.secondary,
                          }}
                        >
                          {role.roleDesc}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => onGrantRole(role.roleCd)}
                      variant="primary"
                      size="sm"
                    >
                      부여
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  color: theme.colors.text.tertiary,
                  fontSize: "14px",
                  textAlign: "center",
                  padding: theme.spacing.xl,
                }}
              >
                {roleSearchTerm
                  ? "검색 결과가 없습니다."
                  : "부여 가능한 권한이 없습니다."}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              color: theme.colors.text.tertiary,
              fontSize: "14px",
              textAlign: "center",
              padding: theme.spacing.xl,
            }}
          >
            사용자를 선택하면 부여 가능한 권한이 표시됩니다.
          </div>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // 렌더링
  // ============================================================================

  return (
    <Frame
      mode="split"
      leftContent={leftContent}
      rightContent={rightContent}
      leftWidth="40%" // 좌측 40%, 우측 60%
      resizable={true}
    />
  );
}
