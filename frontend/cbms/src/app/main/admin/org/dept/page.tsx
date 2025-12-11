"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Frame } from "@/components/common/themed/Frame";
import { TreeView } from "@/components/common/themed/TreeView";
import { Card } from "@/components/common/themed/Card";
import { SearchForm } from "@/components/common/themed/SearchForm";
import { useDepartmentService } from "@/service/DepartmentService";
import { searchFields } from "./info";
import { theme } from "@/styles/theme";

/**
 * @파일명 : page.tsx
 * @설명 : 부서 관리 페이지 - 렌더링만 담당
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */
export default function DepartmentManagementPage() {
  const {
    // 상태
    loading,
    error,

    // 트리뷰 데이터
    treeData,

    // 비즈니스 로직
    handleNodeClick,
    refetch,
  } = useDepartmentService();

  // 중복 호출 방지 플래그
  const isFetched = useRef(false);

  // 검색 조건 상태
  const [searchCondition, setSearchCondition] = useState<Record<string, any>>(
    {}
  );

  // 검색된 노드 ID 목록 (하이라이트용)
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<Set<string>>(
    new Set()
  );

  // 초기 데이터 로드
  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 트리뷰 노드 클릭 핸들러
  const handleTreeNodeClick = (node: any) => {
    handleNodeClick(node);
  };

  // ============================================================================
  // 검색 기능
  // ============================================================================

  /**
   * @function handleSearch
   * @description 검색 조건으로 트리 노드 필터링 및 하이라이트
   */
  const handleSearch = (searchData: Record<string, any>) => {
    setSearchCondition(searchData);

    // 검색 조건이 비어있으면 하이라이트 초기화
    if (!searchData.deptCode && !searchData.deptNm && !searchData.useYn) {
      setHighlightedNodeIds(new Set());
      return;
    }

    // 검색 조건에 맞는 노드 찾기
    const matchedIds = new Set<string>();
    const parentIds = new Set<string>(); // 매칭된 노드의 부모 노드들

    const searchInTree = (nodes: any[], parents: string[] = []): boolean => {
      let hasMatch = false;

      nodes.forEach((node) => {
        let isMatch = true;

        // 부서 코드 검색
        if (
          searchData.deptCode &&
          !node.id.toLowerCase().includes(searchData.deptCode.toLowerCase())
        ) {
          isMatch = false;
        }

        // 부서명 검색
        if (
          searchData.deptNm &&
          !node.label.toLowerCase().includes(searchData.deptNm.toLowerCase())
        ) {
          isMatch = false;
        }

        // 사용 여부 검색
        if (searchData.useYn && node.data?.useYn !== searchData.useYn) {
          isMatch = false;
        }

        // 자식 노드 검색
        const childHasMatch =
          node.children && node.children.length > 0
            ? searchInTree(node.children, [...parents, node.id])
            : false;

        // 현재 노드가 매칭되거나 자식에 매칭이 있으면
        if (isMatch || childHasMatch) {
          if (isMatch) {
            matchedIds.add(node.id);
          }
          // 부모 노드들도 펼쳐지도록 추가
          parents.forEach((parentId) => parentIds.add(parentId));
          hasMatch = true;
        }
      });

      return hasMatch;
    };

    searchInTree(treeData);
    setHighlightedNodeIds(matchedIds);
  };

  /**
   * @function handleSearchReset
   * @description 검색 조건 및 하이라이트 초기화
   */
  const handleSearchReset = () => {
    setSearchCondition({});
    setHighlightedNodeIds(new Set());
  };

  /**
   * @function filteredTreeData
   * @description 검색된 노드에 하이라이트 속성 추가
   */
  const filteredTreeData = useMemo(() => {
    if (highlightedNodeIds.size === 0) {
      return treeData;
    }

    const addHighlight = (nodes: any[]): any[] => {
      return nodes.map((node) => ({
        ...node,
        highlighted: highlightedNodeIds.has(node.id),
        children: node.children ? addHighlight(node.children) : [],
      }));
    };

    return addHighlight(treeData);
  }, [treeData, highlightedNodeIds]);

  // ============================================================================
  // 렌더링
  // ============================================================================

  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      <Frame
        mode="basic"
        title="부서 관리"
        description="부서 조직도를 관리합니다. 부서정보는 HR시스템에서 인터페이스받는다고 가정하고 추가/수정/삭제 기능은 구현하지 않습니다."
      >
        <div
          style={{
            height: "calc(100vh - 200px)",
            padding: theme.spacing.md,
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.md,
          }}
        >
          {/* 검색 폼 */}
          <Card title="부서 검색">
            <SearchForm
              fields={searchFields}
              onSearch={handleSearch}
              onReset={handleSearchReset}
              loading={loading}
              columns={3}
              searchButtonText="검색"
              resetButtonText="초기화"
            />
            {highlightedNodeIds.size > 0 && (
              <div
                style={{
                  marginTop: theme.spacing.md,
                  padding: theme.spacing.sm,
                  backgroundColor: theme.colors.background.surface,
                  borderRadius: theme.borderRadius.md,
                  fontSize: "14px",
                  color: theme.colors.text.secondary,
                }}
              >
                검색 결과:{" "}
                <strong style={{ color: theme.colors.primary.default }}>
                  {highlightedNodeIds.size}개
                </strong>{" "}
                부서가 검색되었습니다.
              </div>
            )}
          </Card>

          {/* 부서 조직도 */}
          <div style={{ flex: 1, overflow: "auto" }}>
            <Card title="부서 조직도">
              {loading && (
                <div style={{ padding: theme.spacing.lg, textAlign: "center" }}>
                  로딩중...
                </div>
              )}
              {error && (
                <div
                  style={{
                    padding: theme.spacing.lg,
                    color: theme.colors.status.error,
                    textAlign: "center",
                  }}
                >
                  에러: {error}
                </div>
              )}
              {!loading && !error && filteredTreeData.length > 0 && (
                <TreeView
                  data={filteredTreeData}
                  onNodeClick={handleTreeNodeClick}
                  defaultExpandAll={highlightedNodeIds.size > 0}
                  showControls={true}
                />
              )}
              {!loading && !error && treeData.length === 0 && (
                <div
                  style={{
                    padding: theme.spacing.lg,
                    color: theme.colors.text.tertiary,
                    textAlign: "center",
                  }}
                >
                  부서 데이터가 없습니다.
                </div>
              )}
            </Card>
          </div>
        </div>
      </Frame>
    </div>
  );
}
