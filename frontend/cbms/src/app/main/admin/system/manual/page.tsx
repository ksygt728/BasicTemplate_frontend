"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchForm } from "@/components/common/themed/SearchForm";
import { Table } from "@/components/common/themed/Table";
import { Button } from "@/components/common/themed/Button";
import { Card } from "@/components/common/themed/Card";
import { searchFields, bbsTableColumns } from "./info";
import { useBbsService } from "@/service/BbsService";
import { useAlert } from "@/contexts/AlertContext";
import { useCommonCode } from "@/hooks/common/useCommonCode";

/**
 * @파일명 : page.tsx
 * @설명 : 게시판 관리 목록 페이지
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
 */
export default function BbsManagementPage() {
  const router = useRouter();
  const {
    // 상태
    loading,

    // 테이블 데이터
    bbsListData,

    // 비즈니스 로직
    handleSearch,
    refetch,
  } = useBbsService();

  const { showAlert } = useAlert();
  const { getSelectOptions, getDtlCode } = useCommonCode();

  // 중복 호출 방지 플래그
  const isFetched = useRef(false);

  // 공통코드 옵션
  const bbsTypeOptions = getSelectOptions("BBS_TYPE", "001");

  // 테이블 컬럼에 render 함수 추가 (bbsType을 공통코드명으로 변환)
  const enhancedTableColumns = bbsTableColumns.map((col) => {
    if (col.key === "bbsType") {
      return {
        ...col,
        render: (value: string) => {
          const typeName = getDtlCode("BBS_TYPE", "001", value);
          return typeof typeName === "string" ? typeName : value;
        },
      };
    }
    return col;
  });

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
   * @function handleNew
   * @description 신규 게시글 작성 - detail 페이지로 이동
   */
  const handleNew = () => {
    router.push("/main/admin/system/manual/detail?mode=new");
  };

  /**
   * @function handleRowClick
   * @description 게시글 클릭 - detail 페이지로 이동
   */
  const handleRowClick = async (row: any) => {
    router.push(`/main/admin/system/manual/detail?bbsId=${row.bbsId}`);
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
  // 메인 렌더링
  // ============================================================================

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* 검색 영역 */}
      <div style={{ marginBottom: "24px" }}>
        <Card>
          <SearchForm
            fields={searchFields.map((field) => {
              if (field.name === "bbsType") {
                return { ...field, options: bbsTypeOptions };
              }
              return field;
            })}
            onSearch={handleSearch}
            loading={loading}
          />
        </Card>
      </div>

      {/* 테이블 영역 */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            paddingBottom: "12px",
            borderBottom: "2px solid #e5e7eb",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
            게시글 목록 ({bbsListData.length})
          </h3>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button variant="primary" onClick={handleNew}>
              신규 작성
            </Button>
            <Button
              variant="secondary"
              onClick={handleRefresh}
              disabled={loading}
            >
              새로고침
            </Button>
          </div>
        </div>

        <Table
          columns={enhancedTableColumns}
          data={bbsListData}
          onRowClick={handleRowClick}
          loading={loading}
        />
      </Card>
    </div>
  );
}
