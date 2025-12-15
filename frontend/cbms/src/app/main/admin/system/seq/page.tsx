/**
 * @파일명 : page.tsx
 * @설명 : 채번 관리 페이지 - 렌더링만 담당
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
import { useChaebunService } from "@/service/ChaebunService";
import {
  searchFields,
  tableColumns,
  initialSearchData,
  initialChaebunFormData,
  chaebunFormFields,
} from "./info";
import { theme } from "@/styles/theme";
import { useAlert } from "@/contexts/AlertContext";
import type { ChaebunResDto } from "@/types/responseDto/ChaebunResDto";

/**
 * @component ChaebunManagementPage
 * @description 채번 관리 페이지
 */
export default function ChaebunManagementPage() {
  const {
    loading,
    chaebunList,
    selectedChaebun,
    tableData,
    handleSearchChaebun,
    handleChaebunSelect,
    handleInsertChaebun,
    handleUpdateChaebun,
    handleDeleteChaebun,
    handleBulkDeleteChaebun,
    handleGenerateSeq,
    refetch,
  } = useChaebunService();

  const { showAlert } = useAlert();

  // 중복 호출 방지 플래그
  const isFetched = useRef(false);

  // 폼 데이터 상태
  const [formData, setFormData] = useState(initialChaebunFormData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 편집 가능 여부

  // 초기 데이터 로드
  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 선택된 채번이 변경되면 폼 데이터 업데이트
  useEffect(() => {
    if (selectedChaebun) {
      setFormData({
        seqId: selectedChaebun.seqId,
        seqName: selectedChaebun.seqName,
        pattern: selectedChaebun.pattern,
        prefix: selectedChaebun.prefix,
        step: selectedChaebun.step,
        length: selectedChaebun.length,
        dateformat: selectedChaebun.dateformat || "",
      });
      setIsEditMode(true);
      setIsEditing(false); // 새로운 항목 선택 시 편집 모드 해제
    } else {
      setFormData(initialChaebunFormData);
      setIsEditMode(false);
      setIsEditing(false);
    }
  }, [selectedChaebun]);

  // ============================================================================
  // 검색 처리
  // ============================================================================

  const onSearchChaebun = async (searchData: Record<string, any>) => {
    await handleSearchChaebun(searchData);
  };

  // ============================================================================
  // 테이블 행 클릭 처리
  // ============================================================================

  const onRowClick = (row: Record<string, any>) => {
    const chaebun = chaebunList.find((c) => c.seqId === row.seqId);
    if (chaebun) {
      handleChaebunSelect(chaebun);
    }
  };

  // ============================================================================
  // 폼 입력 변경 처리
  // ============================================================================

  const onFormChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================================
  // 채번 패턴 미리보기 생성
  // ============================================================================

  const generatePreviewPattern = () => {
    if (!formData.pattern) return "";

    let preview = formData.pattern;

    // {PREFIX} 치환 (대문자만)
    if (formData.prefix) {
      preview = preview.replace(/{PREFIX}/g, formData.prefix);
    }

    // {DATEFORMAT} 치환 (대문자만)
    if (formData.dateformat) {
      // 간단한 날짜 포맷 예시 생성
      const today = new Date();
      let dateExample = formData.dateformat;
      dateExample = dateExample.replace(/yyyy/i, String(today.getFullYear()));
      dateExample = dateExample.replace(
        /MM/,
        String(today.getMonth() + 1).padStart(2, "0")
      );
      dateExample = dateExample.replace(
        /dd/i,
        String(today.getDate()).padStart(2, "0")
      );
      dateExample = dateExample.replace(/HH/i, "00");
      dateExample = dateExample.replace(/mm/i, "00");
      dateExample = dateExample.replace(/ss/i, "00");
      preview = preview.replace(/{DATEFORMAT}/g, dateExample);
    }

    // {VALUE} 치환 (대문자만)
    if (formData.length) {
      // 수정 모드일 때는 현재값+증가량, 신규 모드일 때는 1
      const nextValue = selectedChaebun
        ? Number(selectedChaebun.currentValue) + Number(formData.step || 1)
        : 1;
      const seqExample = String(nextValue).padStart(formData.length, "0");
      preview = preview.replace(/{VALUE}/g, seqExample);
    }

    return preview;
  };

  // ============================================================================
  // 신규 추가 모드
  // ============================================================================

  const onNewChaebun = () => {
    handleChaebunSelect(null as any); // 먼저 선택 해제 (useEffect 트리거)
    // useEffect 이후에 상태 설정을 위해 setTimeout 사용
    setTimeout(() => {
      setFormData(initialChaebunFormData);
      setIsEditMode(false);
      setIsEditing(true); // 신규 추가는 바로 편집 가능
    }, 0);
  };

  // ============================================================================
  // 편집 모드 토글
  // ============================================================================

  const onToggleEdit = () => {
    if (isEditing) {
      // 취소: 원래 데이터로 복원
      if (selectedChaebun) {
        // 수정 모드였으면 원래 데이터로 복원
        setFormData({
          seqId: selectedChaebun.seqId,
          seqName: selectedChaebun.seqName,
          pattern: selectedChaebun.pattern,
          prefix: selectedChaebun.prefix,
          step: selectedChaebun.step,
          length: selectedChaebun.length,
          dateformat: selectedChaebun.dateformat || "",
        });
      } else {
        // 신규 모드였으면 초기값으로 리셋
        setFormData(initialChaebunFormData);
      }
      setIsEditing(false);
    } else {
      // 수정 모드 활성화
      setIsEditing(true);
    }
  };

  // ============================================================================
  // 저장 처리
  // ============================================================================

  const onSaveChaebun = async () => {
    let success = false;

    if (isEditMode) {
      // 수정 모드
      success = await handleUpdateChaebun(formData);
    } else {
      // 추가 모드
      success = await handleInsertChaebun(formData);
    }

    if (success) {
      setFormData(initialChaebunFormData);
      setIsEditMode(false);
      setIsEditing(false); // 저장 후 편집 모드 해제
    }
  };

  // ============================================================================
  // 삭제 처리
  // ============================================================================

  const onDeleteChaebun = async () => {
    if (!selectedChaebun) {
      await showAlert({
        type: "warning",
        message: "삭제할 채번을 선택해주세요.",
      });
      return;
    }

    const confirmed = await showAlert({
      type: "warning",
      title: "삭제 확인",
      message: `채번 "${selectedChaebun.seqName}"을(를) 삭제하시겠습니까?`,
      showCancel: true,
      okText: "삭제",
      cancelText: "취소",
    });
    if (!confirmed) return;

    const success = await handleDeleteChaebun(selectedChaebun.seqId);
    if (success) {
      setFormData(initialChaebunFormData);
      setIsEditMode(false);
      setIsEditing(false); // 삭제 후 편집 모드 해제
    }
  };

  // ============================================================================
  // 채번 생성 처리
  // ============================================================================

  const onGenerateSeq = async () => {
    if (!selectedChaebun) {
      await showAlert({
        type: "warning",
        message: "채번을 선택해주세요.",
      });
      return;
    }

    await handleGenerateSeq(selectedChaebun.seqId);
  };

  // ============================================================================
  // 좌측 콘텐츠: 채번 검색 + 채번 리스트
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
      {/* 검색 폼 */}
      <SearchForm
        fields={searchFields}
        initialValues={initialSearchData}
        onSearch={onSearchChaebun}
      />

      {/* 채번 테이블 */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <AdvancedTable
          columns={tableColumns}
          data={tableData}
          loading={loading}
          onRowClick={onRowClick}
        />
      </div>
    </div>
  );

  // ============================================================================
  // 우측 콘텐츠: 채번 상세 정보 및 수정
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
      {/* 상단 버튼 영역 */}
      <div
        style={{
          display: "flex",
          gap: theme.spacing.sm,
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant={isEditing && !isEditMode ? "secondary" : "primary"}
          size="md"
          onClick={isEditing && !isEditMode ? onToggleEdit : onNewChaebun}
        >
          {isEditing && !isEditMode ? "취소" : "신규"}
        </Button>
        <Button
          variant={isEditing && isEditMode ? "secondary" : "primary"}
          size="md"
          onClick={onToggleEdit}
          disabled={!selectedChaebun || (isEditing && !isEditMode)}
        >
          {isEditing && isEditMode ? "취소" : "수정"}
        </Button>
        <Button
          variant="success"
          size="md"
          onClick={onSaveChaebun}
          disabled={!isEditing}
        >
          저장
        </Button>
        <Button
          variant="error"
          size="md"
          onClick={onDeleteChaebun}
          disabled={!selectedChaebun || isEditing}
        >
          삭제
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onGenerateSeq}
          disabled={!selectedChaebun || isEditing}
        >
          채번 생성
        </Button>
      </div>

      {/* 채번 정보 폼 */}
      <div
        style={{
          flex: 1,
          backgroundColor: theme.colors.background.surface,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.lg,
          border: `1px solid ${theme.colors.border.default}`,
          overflow: "auto",
        }}
      >
        <h3
          style={{
            fontSize: theme.typography.baseSize,
            fontWeight: theme.typography.weights.semibold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.lg,
          }}
        >
          {isEditMode ? "채번 수정" : "채번 추가"}
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.md,
          }}
        >
          {chaebunFormFields.map((field) => {
            // showOnlyInEditMode가 true인 경우, isEditMode가 true일 때만 표시
            if (field.showOnlyInEditMode && !isEditMode) {
              return null;
            }

            return (
              <div key={field.name}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: theme.typography.weights.medium,
                    color: theme.colors.text.secondary,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {field.label}
                  {field.required && (
                    <span style={{ color: theme.colors.status.error }}>*</span>
                  )}
                </label>
                <Input
                  type={field.type}
                  value={
                    field.name === "currentValue" && selectedChaebun
                      ? selectedChaebun.currentValue
                      : formData[field.name as keyof typeof formData] || ""
                  }
                  onChange={(e) => onFormChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  disabled={
                    !isEditing ||
                    (isEditMode && field.name === "seqId") ||
                    field.disabled
                  }
                  fullWidth
                />
              </div>
            );
          })}
        </div>

        {/* 채번 패턴 미리보기 */}
        {isEditing && formData.pattern && (
          <div
            style={{
              marginTop: theme.spacing.lg,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.background.default,
              borderRadius: theme.borderRadius.sm,
              border: `2px solid ${theme.colors.status.error}`,
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: theme.typography.weights.semibold,
                color: theme.colors.text.secondary,
                margin: 0,
                marginBottom: theme.spacing.xs,
              }}
            >
              패턴 미리보기:{" "}
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: theme.typography.weights.regular,
                }}
              >
                ({formData.step || 1}씩 증가)
              </span>
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: theme.typography.weights.semibold,
                color: theme.colors.status.error,
                margin: 0,
                fontFamily: "monospace",
              }}
            >
              {generatePreviewPattern()}
            </p>
          </div>
        )}

        {/* 안내 메시지 */}
        <div
          style={{
            marginTop: theme.spacing.lg,
            padding: theme.spacing.md,
            backgroundColor: theme.colors.background.default,
            borderRadius: theme.borderRadius.sm,
            border: `1px solid ${theme.colors.border.default}`,
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: theme.colors.text.secondary,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: theme.colors.status.error }}>
              ⚠️ 중요:
            </strong>
            <br />
            패턴에서 사용하는 키워드는 반드시 대문자로 작성해야 합니다.
            <br />• {"{PREFIX}"} - 접두어
            <br />• {"{DATEFORMAT}"} - 날짜
            <br />• {"{VALUE}"} - 시퀀스 번호
            <br />
            <br />
            <strong>패턴 예시:</strong>
            <br />
            {"{PREFIX}-{DATEFORMAT}-{VALUE}"} → ORD-20251215-00001
            <br />
            {"{PREFIX}-{VALUE}"} → ORD-00001
            <br />
            <br />
            <strong>날짜 포맷:</strong> yyyyMMdd, yyyy-MM-dd 등<br />
            <strong>길이:</strong> 채번 시퀀스 부분의 자릿수 (예: 5 → 00001)
          </p>
        </div>
      </div>
    </div>
  );

  // ============================================================================
  // 메인 레이아웃
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
