/**
 * @파일명 : page.tsx
 * @설명 : 메뉴 관리 화면
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

"use client";

import React, { useState, useEffect } from "react";
import { Frame } from "@/components/common/themed/Frame";
import { TreeView } from "@/components/common/themed/TreeView";
import { Button } from "@/components/common/themed/Button";
import { Input } from "@/components/common/themed/Input";
import { Select } from "@/components/common/themed/Select";
import { Loading } from "@/components/common/themed/Loading";
import { useMenuService, MenuFormData } from "@/service/MenuService";
import { menuFormFields, initialMenuFormData } from "./info";
import { theme } from "@/styles/theme";
import { useAlert } from "@/contexts/AlertContext";

/**
 * @component MenuManagementPage
 * @description 메뉴 관리 페이지 (TreeView + 상세 폼)
 */
export default function MenuManagementPage() {
  const {
    loading,
    treeNodes,
    selectedMenu,
    upperMenuOptions,
    handleLoadMenuTree,
    handleNodeClick,
    handleValidateUpperMenu,
    handleInsertMenu,
    handleUpdateMenu,
    handleDeleteMenu,
    handleResetForm,
    refetch,
  } = useMenuService();

  const { showAlert } = useAlert();

  // 폼 데이터 상태
  const [formData, setFormData] = useState<MenuFormData>(initialMenuFormData);
  const [originalFormData, setOriginalFormData] =
    useState<MenuFormData>(initialMenuFormData); // 수정 전 원본 데이터
  const [isViewMode, setIsViewMode] = useState(false); // 조회 모드 (메뉴 선택됨)
  const [isEditable, setIsEditable] = useState(false); // 수정 가능 모드

  // ============================================================================
  // 초기 로드
  // ============================================================================

  useEffect(() => {
    handleLoadMenuTree();
  }, []);

  // ============================================================================
  // 선택된 메뉴 변경 시 폼 데이터 업데이트
  // ============================================================================

  useEffect(() => {
    if (selectedMenu) {
      const newFormData = {
        menuCd: selectedMenu.menuCd || "",
        menuNm: selectedMenu.menuNm || "",
        upperMenu: selectedMenu.upperMenu || "",
        menuLv: selectedMenu.menuLv || 1,
        useYn: selectedMenu.useYn || "Y",
        menuUrl: selectedMenu.menuUrl || "",
        orderNum: selectedMenu.orderNum || 0,
      };
      setFormData(newFormData);
      setOriginalFormData(newFormData); // 원본 데이터 저장
      setIsViewMode(true); // 조회 모드로 설정
      setIsEditable(false); // 수정 불가능 상태로 설정
    }
  }, [selectedMenu]);

  // ============================================================================
  // 폼 필드 변경 핸들러
  // ============================================================================

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================================================
  // 상위 메뉴 검증 핸들러
  // ============================================================================

  const handleUpperMenuBlur = async () => {
    const menuCd = formData.upperMenu.trim();

    if (!menuCd) {
      // 빈 값이면 메뉴 레벨을 1로 설정
      setFormData((prev) => ({ ...prev, menuLv: 1 }));
      return;
    }

    const validMenu = await handleValidateUpperMenu(menuCd);

    if (!validMenu) {
      // 유효하지 않으면 상위 메뉴와 레벨 초기화
      setFormData((prev) => ({
        ...prev,
        upperMenu: "",
        menuLv: 1,
      }));
    } else {
      // 유효하면 레벨을 상위 메뉴 레벨 + 1로 설정
      setFormData((prev) => ({
        ...prev,
        menuLv: (validMenu.menuLv || 0) + 1,
      }));
    }
  };

  // ============================================================================
  // 신규 버튼 클릭
  // ============================================================================

  const handleNewClick = () => {
    setFormData(initialMenuFormData);
    setOriginalFormData(initialMenuFormData);
    setIsViewMode(false); // 신규 모드
    setIsEditable(true); // 수정 가능
    // handleResetForm() 호출 제거 - API 호출 불필요
  };

  // ============================================================================
  // 수정 버튼 클릭
  // ============================================================================

  const handleEditClick = () => {
    // 수정 모드 진입 시 현재 데이터를 원본으로 백업
    setOriginalFormData({ ...formData });
    setIsEditable(true);
  };

  // ============================================================================
  // 취소 버튼 클릭
  // ============================================================================

  const handleCancelClick = () => {
    // 원본 데이터로 복원
    setFormData({ ...originalFormData });
    setIsEditable(false);
  };

  // ============================================================================
  // 저장 버튼 클릭
  // ============================================================================

  const handleSaveClick = async () => {
    if (isViewMode) {
      // 수정 모드
      const success = await handleUpdateMenu(formData);
      if (success) {
        await refetch();
        setIsEditable(false); // 저장 후 수정 불가능 상태로
      }
    } else {
      // 추가 모드
      const success = await handleInsertMenu(formData);
      if (success) {
        await refetch();
        setFormData(initialMenuFormData);
        setIsViewMode(false);
        setIsEditable(false);
      }
    }
  };

  // ============================================================================
  // 삭제 버튼 클릭
  // ============================================================================

  const handleDeleteClick = async () => {
    if (!formData.menuCd) {
      await showAlert({
        type: "warning",
        message: "삭제할 메뉴를 선택해주세요.",
      });
      return;
    }

    const confirmed = await showAlert({
      type: "warning",
      message: "정말 삭제하시겠습니까?",
      showCancel: true,
    });

    if (confirmed) {
      const success = await handleDeleteMenu(formData.menuCd);
      if (success) {
        await refetch();
        handleNewClick();
      }
    }
  };

  // ============================================================================
  // 스타일 정의
  // ============================================================================

  const containerStyle: React.CSSProperties = {
    display: "flex",
    gap: theme.spacing.md,
    height: "calc(100vh - 200px)",
  };

  const leftPanelStyle: React.CSSProperties = {
    flex: "0 0 400px",
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border.default}`,
    padding: theme.spacing.md,
    overflowY: "auto",
  };

  const rightPanelStyle: React.CSSProperties = {
    flex: 1,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border.default}`,
    padding: theme.spacing.lg,
    overflowY: "auto",
  };

  const formRowStyle: React.CSSProperties = {
    display: "flex",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  };

  const formGroupStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.xs,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  };

  const requiredStyle: React.CSSProperties = {
    color: theme.colors.status.error,
    marginLeft: "4px",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: theme.spacing.sm,
    justifyContent: "flex-end",
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.border.default}`,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  };

  // ============================================================================
  // 렌더링
  // ============================================================================

  if (loading && treeNodes.length === 0) {
    return <Loading />;
  }

  return (
    <Frame
      mode="basic"
      title="메뉴 관리"
      description="시스템 메뉴 구조를 관리합니다. 왼쪽 트리에서 메뉴를 선택하여 수정하거나, 신규 버튼을 클릭하여 새로운 메뉴를 추가할 수 있습니다."
    >
      <div style={containerStyle}>
        {/* 왼쪽 패널: TreeView */}
        <div style={leftPanelStyle}>
          <div style={titleStyle}>메뉴 구조</div>
          <TreeView
            data={treeNodes}
            onNodeClick={handleNodeClick}
            defaultExpandAll={true}
            showControls={true}
          />
        </div>

        {/* 오른쪽 패널: 상세 폼 */}
        <div style={rightPanelStyle}>
          <div style={titleStyle}>
            {isViewMode
              ? isEditable
                ? "메뉴 정보 수정"
                : "메뉴 정보 조회"
              : "신규 메뉴 추가"}
          </div>

          {/* 메뉴 코드 */}
          <div style={formRowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                {menuFormFields.menuCd.label}
                <span style={requiredStyle}>*</span>
              </label>
              <Input
                value={formData.menuCd}
                onChange={(e) => handleFieldChange("menuCd", e.target.value)}
                placeholder={menuFormFields.menuCd.placeholder}
                disabled={isViewMode || !isEditable} // 조회 모드이거나 수정 불가능 시 비활성화
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                {menuFormFields.menuNm.label}
                <span style={requiredStyle}>*</span>
              </label>
              <Input
                value={formData.menuNm}
                onChange={(e) => handleFieldChange("menuNm", e.target.value)}
                placeholder={menuFormFields.menuNm.placeholder}
                disabled={!isEditable}
              />
            </div>
          </div>

          {/* 상위 메뉴 & 메뉴 레벨 */}
          <div style={formRowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                {menuFormFields.upperMenu.label}
                <span style={requiredStyle}>*</span>
              </label>
              <Input
                value={formData.upperMenu}
                onChange={(e) => handleFieldChange("upperMenu", e.target.value)}
                onBlur={handleUpperMenuBlur}
                placeholder={menuFormFields.upperMenu.placeholder}
                disabled={!isEditable}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                {menuFormFields.menuLv.label}
                <span style={requiredStyle}>*</span>
              </label>
              <Input
                type="number"
                value={formData.menuLv}
                onChange={(e) =>
                  handleFieldChange("menuLv", Number(e.target.value))
                }
                placeholder={menuFormFields.menuLv.placeholder}
                disabled={true}
              />
            </div>
          </div>

          {/* 메뉴 URL */}
          <div style={formRowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>{menuFormFields.menuUrl.label}</label>
              <Input
                value={formData.menuUrl}
                onChange={(e) => handleFieldChange("menuUrl", e.target.value)}
                placeholder={menuFormFields.menuUrl.placeholder}
                disabled={!isEditable}
              />
            </div>
          </div>

          {/* 정렬 순서 & 사용 여부 */}
          <div style={formRowStyle}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                {menuFormFields.orderNum.label}
                <span style={requiredStyle}>*</span>
              </label>
              <Input
                type="number"
                value={formData.orderNum}
                onChange={(e) =>
                  handleFieldChange("orderNum", Number(e.target.value))
                }
                placeholder={menuFormFields.orderNum.placeholder}
                disabled={!isEditable}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                {menuFormFields.useYn.label}
                <span style={requiredStyle}>*</span>
              </label>
              <Select
                value={formData.useYn}
                onChange={(value) => handleFieldChange("useYn", value)}
                options={menuFormFields.useYn.options}
                disabled={!isEditable}
              />
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div style={buttonGroupStyle}>
            <Button variant="secondary" onClick={handleNewClick}>
              신규
            </Button>
            {isViewMode && !isEditable && (
              <>
                <Button variant="primary" onClick={handleEditClick}>
                  수정
                </Button>
                <Button variant="error" onClick={handleDeleteClick}>
                  삭제
                </Button>
              </>
            )}
            {isEditable && (
              <>
                <Button variant="primary" onClick={handleSaveClick}>
                  저장
                </Button>
                <Button variant="secondary" onClick={handleCancelClick}>
                  취소
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Frame>
  );
}
