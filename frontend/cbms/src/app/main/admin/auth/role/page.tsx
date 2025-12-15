/**
 * @파일명 : page.tsx
 * @설명 : 권한 관리 페이지 - 렌더링만 담당
 * @작성자 : 김승연
 * @작성일 : 2025.12.12
 * @변경이력 :
 *       2025.12.12 김승연 최초 생성
 */

"use client";

import React, { useEffect, useRef, useState } from "react";
import { Frame } from "@/components/common/themed/Frame";
import { TreeView } from "@/components/common/themed/TreeView";
import { TreeViewWithCheckbox } from "@/components/common/themed/TreeViewWithCheckbox";
import { AdvancedTable } from "@/components/common/themed/AdvancedTable";
import { SearchForm } from "@/components/common/themed/SearchForm";
import { Button } from "@/components/common/themed/Button";
import { useRoleService } from "@/service/RoleService";
import { searchFields, tableColumns, initialSearchData } from "./info";
import { theme } from "@/styles/theme";
import { useAlert } from "@/contexts/AlertContext";
import type { RoleMenuResDto } from "@/types/responseDto/RoleMenuResDto";

/**
 * @component RoleManagementPage
 * @description 권한 관리 페이지 (2분할 레이아웃)
 */
export default function RoleManagementPage() {
  const {
    loading,
    roleList,
    selectedRole,
    roleMenuTree,
    treeNodes,
    tableData,
    handleSearchRoles,
    handleRoleSelect,
    handleInsertRole,
    handleUpdateRole,
    handleDeleteRole,
    handleBulkDeleteRole,
    handleUpdateRoleMenu,
    refetch,
  } = useRoleService();

  const { showAlert } = useAlert();

  // 중복 호출 방지 플래그
  const isFetched = useRef(false);

  // 메뉴 권한 상태 관리
  const [menuPermissions, setMenuPermissions] = useState<
    Record<string, { menuRw: string; useYn: string }>
  >({});
  const [originalPermissions, setOriginalPermissions] = useState<
    Record<string, { menuRw: string; useYn: string }>
  >({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 선택된 권한이 변경되면 메뉴 권한 상태 초기화
  useEffect(() => {
    if (roleMenuTree.length > 0) {
      const permissions: Record<string, { menuRw: string; useYn: string }> = {};
      const flattenMenus = (menus: RoleMenuResDto[]) => {
        menus.forEach((menu) => {
          permissions[menu.menuCd] = {
            menuRw: menu.menuRw || "", // null인 경우 빈 문자열
            useYn: menu.useYn || "N",
          };
          if (menu.childMenus && menu.childMenus.length > 0) {
            flattenMenus(menu.childMenus);
          }
        });
      };
      flattenMenus(roleMenuTree);
      setMenuPermissions(permissions);
      setOriginalPermissions(JSON.parse(JSON.stringify(permissions))); // 원본 저장
      setHasChanges(false);
      setIsEditMode(false); // 권한 변경 시 편집 모드 해제
    } else {
      setMenuPermissions({});
      setHasChanges(false);
    }
  }, [roleMenuTree]);

  // ============================================================================
  // 좌측 콘텐츠: 권한 검색 + 권한 리스트
  // ============================================================================

  const leftContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: theme.spacing.lg,
      }}
    >
      {/* 권한 검색 폼 */}
      <div>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.md,
          }}
        >
          권한 검색
        </h3>
        <SearchForm
          fields={searchFields.map((field: any) => ({
            ...field,
            type: field.type as any,
          }))}
          onSearch={handleSearchRoles}
          loading={loading}
          initialValues={initialSearchData}
          columns={2}
        />
      </div>

      {/* 권한 리스트 테이블 */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.md,
          }}
        >
          권한 리스트
        </h3>
        <AdvancedTable
          columns={tableColumns.map((col: any, index: number) => ({
            key: col.key,
            title: col.label || col.key,
            dataIndex: col.key,
            width: col.width,
            align: "left",
            sortable: col.sortable,
            filterable: col.filterable,
            editable: col.editable,
            editableOnUpdate: col.key === "roleCd" ? false : col.editable,
            type: col.type,
            options: col.options,
            required: col.required,
          }))}
          data={tableData}
          rowKey="roleCd"
          hoverable
          striped
          compact
          onRowClick={(record: any) => {
            const role = roleList.find((r) => r.roleCd === record.roleCd);
            if (role) handleRoleSelect(role);
          }}
          pagination={{
            pageSize: 20,
            pageSizeOptions: [10, 20, 50, 100],
          }}
          selection={{
            type: "checkbox",
          }}
          filtering={true}
          exportable={true}
          editable={true}
          onAdd={async (record: any) => {
            const success = await handleInsertRole({
              roleCd: record.roleCd,
              roleName: record.roleName,
              roleDesc: record.roleDesc || "",
            });
            if (success) await refetch();
          }}
          onUpdate={async (id: React.Key, record: any) => {
            const success = await handleUpdateRole({
              roleCd: String(id),
              roleName: record.roleName,
              roleDesc: record.roleDesc || "",
            });
            if (success) await refetch();
          }}
          onDelete={async (id: React.Key) => {
            const success = await handleDeleteRole(String(id));
            if (success) await refetch();
          }}
          onBulkDelete={async (ids: React.Key[]) => {
            await handleBulkDeleteRole(ids.map(String));
            await refetch();
          }}
        />
      </div>
    </div>
  );

  // ============================================================================
  // 우측 콘텐츠: 권한별 메뉴 트리
  // ============================================================================

  const rightContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: theme.spacing.lg,
      }}
    >
      <div style={{ flex: 1, overflow: "auto" }}>
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
              fontSize: "16px",
              fontWeight: theme.typography.weights.semibold,
              color: theme.colors.text.primary,
              margin: 0,
            }}
          >
            권한별 메뉴 트리
          </h3>
          {selectedRole && treeNodes.length > 0 && (
            <div style={{ display: "flex", gap: theme.spacing.sm }}>
              {!isEditMode ? (
                <Button
                  onClick={() => {
                    setIsEditMode(true);
                  }}
                >
                  수정
                </Button>
              ) : (
                <>
                  <Button
                    onClick={async () => {
                      // 변경된 항목만 필터링
                      const changedMenuList = Object.entries(menuPermissions)
                        .filter(([menuCd, { menuRw, useYn }]) => {
                          const original = originalPermissions[menuCd];
                          // 원본과 비교해서 변경된 항목만 선택
                          return (
                            !original ||
                            original.menuRw !== menuRw ||
                            original.useYn !== useYn
                          );
                        })
                        .map(([menuCd, { menuRw, useYn }]) => ({
                          menuCd,
                          menuRw,
                          useYn,
                        }));

                      // console.log("=== 저장 요청 데이터 ===");
                      // console.log("roleCd:", selectedRole.roleCd);
                      // console.log(
                      //   "전체 항목 수:",
                      //   Object.keys(menuPermissions).length
                      // );
                      // console.log("변경된 항목 수:", changedMenuList.length);
                      // console.log("변경된 항목:", changedMenuList);

                      if (changedMenuList.length === 0) {
                        await showAlert({
                          type: "info",
                          message: "변경된 항목이 없습니다.",
                        });
                        return;
                      }

                      // 저장 확인
                      const confirmResult = await showAlert({
                        type: "info",
                        message: "저장하시겠습니까?",
                        showCancel: true,
                      });

                      if (!confirmResult) {
                        return;
                      }

                      const success = await handleUpdateRoleMenu(
                        selectedRole.roleCd,
                        changedMenuList
                      );
                      if (success) {
                        setHasChanges(false);
                        setIsEditMode(false);
                        // 원본 데이터 업데이트
                        setOriginalPermissions(
                          JSON.parse(JSON.stringify(menuPermissions))
                        );
                      }
                    }}
                  >
                    저장
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      // 원본으로 복원
                      setMenuPermissions(
                        JSON.parse(JSON.stringify(originalPermissions))
                      );
                      setHasChanges(false);
                      setIsEditMode(false);
                    }}
                  >
                    취소
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
        {selectedRole ? (
          <>
            <div
              style={{
                marginBottom: theme.spacing.md,
                padding: theme.spacing.sm,
                backgroundColor: theme.colors.background.subtle,
                borderRadius: theme.borderRadius.sm,
              }}
            >
              <span
                style={{ fontSize: "14px", color: theme.colors.text.secondary }}
              >
                선택된 권한:{" "}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: theme.typography.weights.semibold,
                  color: theme.colors.primary.default,
                }}
              >
                {selectedRole.roleName} ({selectedRole.roleCd})
              </span>
            </div>
            {treeNodes.length > 0 ? (
              <TreeViewWithCheckbox
                data={treeNodes}
                permissions={menuPermissions}
                isEditMode={isEditMode}
                onPermissionChange={(menuCd, type, checked) => {
                  if (!isEditMode) return; // 편집 모드가 아니면 변경 불가

                  setMenuPermissions((prev) => {
                    if (type === "useYn") {
                      // UseYn 토글
                      setHasChanges(true);
                      return {
                        ...prev,
                        [menuCd]: {
                          ...prev[menuCd],
                          useYn: checked ? "Y" : "N",
                        },
                      };
                    }

                    // CRUD 권한 토글
                    const current = prev[menuCd]?.menuRw || "";
                    let newRw = current;

                    // 현재 권한 상태
                    const permissions = {
                      C: current.includes("C"),
                      R: current.includes("R"),
                      U: current.includes("U"),
                      D: current.includes("D"),
                    };

                    // 해당 권한 토글
                    if (type === "create") {
                      permissions.C = checked;
                    } else if (type === "read") {
                      permissions.R = checked;
                    } else if (type === "update") {
                      permissions.U = checked;
                    } else if (type === "delete") {
                      permissions.D = checked;
                    }

                    // 권한 문자열 재구성
                    newRw = "";
                    if (permissions.C) newRw += "C";
                    if (permissions.R) newRw += "R";
                    if (permissions.U) newRw += "U";
                    if (permissions.D) newRw += "D";

                    setHasChanges(true);
                    return {
                      ...prev,
                      [menuCd]: {
                        ...prev[menuCd],
                        menuRw: newRw,
                      },
                    };
                  });
                }}
                onBulkPermissionChange={(type, checked) => {
                  if (!isEditMode) return;

                  setMenuPermissions((prev) => {
                    const updated = { ...prev };
                    Object.keys(updated).forEach((menuCd) => {
                      if (type === "useYn") {
                        // UseYn 전체 토글
                        updated[menuCd] = {
                          ...updated[menuCd],
                          useYn: checked ? "Y" : "N",
                        };
                      } else {
                        // CRUD 권한 토글
                        const current = updated[menuCd].menuRw || "";

                        // 현재 권한 상태
                        const permissions = {
                          C: current.includes("C"),
                          R: current.includes("R"),
                          U: current.includes("U"),
                          D: current.includes("D"),
                        };

                        // 해당 권한 토글
                        if (type === "create") {
                          permissions.C = checked;
                        } else if (type === "read") {
                          permissions.R = checked;
                        } else if (type === "update") {
                          permissions.U = checked;
                        } else if (type === "delete") {
                          permissions.D = checked;
                        }

                        // 권한 문자열 재구성
                        let newRw = "";
                        if (permissions.C) newRw += "C";
                        if (permissions.R) newRw += "R";
                        if (permissions.U) newRw += "U";
                        if (permissions.D) newRw += "D";

                        updated[menuCd] = {
                          ...updated[menuCd],
                          menuRw: newRw,
                        };
                      }
                    });
                    setHasChanges(true);
                    return updated;
                  });
                }}
                defaultExpandAll={true}
                showControls={true}
              />
            ) : (
              <div
                style={{
                  padding: theme.spacing.xl,
                  textAlign: "center",
                  color: theme.colors.text.secondary,
                  fontSize: "14px",
                }}
              >
                메뉴가 없습니다.
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              padding: theme.spacing.xl,
              textAlign: "center",
              color: theme.colors.text.secondary,
              fontSize: "14px",
            }}
          >
            권한을 선택해주세요.
          </div>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // 메인 렌더링
  // ============================================================================

  return (
    <Frame
      mode="split"
      leftContent={leftContent}
      rightContent={rightContent}
      leftWidth="50%"
      resizable
    />
  );
}
