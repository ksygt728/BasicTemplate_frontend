import type { SearchOption } from "@/components/common/themed/SearchForm";

/**
 * @파일명 : info.tsx
 * @설명 : 코드 관리 페이지의 컬럼 정의 및 옵션 정보
 * @작성자 : 김승연
 * @작성일 : 2025.12.01
 * @변경이력 :
 *       2025.12.01 김승연 최초 생성
 */

// ============================================================================
// 검색 폼 옵션
// ============================================================================

/**
 * @설정 검색 폼 옵션들
 * @설명 SearchForm 컴포넌트에서 사용할 검색 조건 옵션 정의
 */
export const searchOptions: SearchOption[] = [
  {
    label: "그룹코드타입",
    value: "grpCdType",
    type: "text",
    placeholder: "그룹코드타입을 입력하세요",
  },
  {
    label: "그룹코드",
    value: "grpCd",
    type: "text",
    placeholder: "그룹코드를 입력하세요",
  },
  {
    label: "그룹명",
    value: "grpNm",
    type: "text",
    placeholder: "그룹명을 입력하세요",
  },
];

// ============================================================================
// 테이블 컬럼 정의
// ============================================================================

/**
 * @컬럼정의 좌측 테이블 컬럼 정의 (그룹코드)
 * @설명 그룹코드 관리 테이블의 컬럼 구조 정의
 * - grpCdType: 그룹코드타입 (편집 가능, 필수)
 * - grpCd: 그룹코드 (편집 불가 - Primary Key, 필수)
 * - grpNm: 그룹명 (편집 가능, 선택)
 */
export const leftTableColumns = [
  {
    key: "grpCdType",
    label: "그룹코드타입",
    width: 100,
    sortable: true,
    editable: true,
    type: "text" as const,
    required: true,
  },
  {
    key: "grpCd",
    label: "그룹코드",
    width: 120,
    sortable: true,
    editable: false,
    type: "text" as const,
    required: true,
  },
  {
    key: "grpNm",
    label: "그룹명",
    width: 150,
    sortable: true,
    editable: true,
    type: "text" as const,
    required: true,
  },
];

/**
 * @컬럼정의 우측 상단 테이블 컬럼 정의 (속성코드)
 * @설명 속성코드 관리 테이블의 컬럼 구조 정의
 * - attrCd: 속성코드 (편집 불가 - Primary Key, 필수)
 * - attrNm: 속성명 (편집 가능, 선택)
 * - orderNum: 정렬순서 (편집 가능, 필수)
 */
export const rightTopTableColumns = [
  {
    key: "attrCd",
    label: "속성코드",
    width: 120,
    sortable: true,
    editable: false,
    type: "text" as const,
    required: true,
  },
  {
    key: "attrNm",
    label: "속성명",
    width: 200,
    sortable: true,
    editable: true,
    type: "text" as const,
    required: true,
  },
  {
    key: "orderNum",
    label: "정렬순서",
    width: 100,
    sortable: true,
    editable: true,
    type: "number" as const,
    required: true,
  },
];

/**
 * @컬럼정의 우측 하단 테이블 고정 시작 컬럼 (상세코드)
 * @설명 상세코드 테이블의 좌측 고정 컬럼
 * - dtlCd: 상세코드 (편집 불가 - Primary Key, 필수)
 */
export const fixedStartColumns = [
  {
    key: "dtlCd",
    label: "상세코드",
    width: 100,
    sortable: true,
    editable: false,
    type: "text" as const,
    required: true,
  },
];

/**
 * @컬럼정의 우측 하단 테이블 고정 끝 컬럼 (상세코드)
 * @설명 상세코드 테이블의 우측 고정 컬럼
 * - useYn: 사용여부 (편집 가능, 필수, 선택 옵션)
 * - dtlOrderNum: 정렬순서 (편집 가능, 필수)
 */
export const fixedEndColumns = [
  {
    key: "useYn",
    label: "사용여부",
    width: 80,
    sortable: true,
    editable: true,
    type: "select" as const,
    options: ["Y", "N"],
    required: true,
  },
  {
    key: "dtlOrderNum",
    label: "정렬순서",
    width: 80,
    sortable: true,
    editable: true,
    type: "number" as const,
    required: true,
  },
];

// ============================================================================
// 동적 컬럼 생성 함수
// ============================================================================

/**
 * @함수 동적 속성 컬럼 생성
 * @설명 선택된 그룹의 속성 정보를 기반으로 동적 컬럼 생성
 * @param {any} codeData - 전체 코드 데이터
 * @param {string | null} selectedGroupCd - 현재 선택된 그룹코드
 * @returns {Array} 동적 생성된 속성 컬럼 배열
 */
export const createDynamicColumns = (
  codeData: any,
  selectedGroupCd: string | null
) => {
  let dynamicColumns: any[] = [];

  if (selectedGroupCd && codeData?.content) {
    const selectedGroup = codeData.content.find(
      (item: any) => item.grpCd === selectedGroupCd
    );

    if (selectedGroup?.comCodeInfo?.length) {
      const attributesMap = new Map();
      selectedGroup.comCodeInfo.forEach((codeInfo: any) => {
        if (codeInfo.codeAttributes) {
          codeInfo.codeAttributes.forEach((attr: any) => {
            if (attr.attrCd && !attributesMap.has(attr.attrCd)) {
              attributesMap.set(attr.attrCd, {
                key: attr.attrCd,
                label: attr.attrNm || attr.attrCd,
                width: 120,
                sortable: true,
                editable: true,
                type: "text" as const,
                required: false,
                attrOrderNum: attr.attrOrderNum || 999,
              });
            }
          });
        }
      });

      dynamicColumns = Array.from(attributesMap.values()).sort(
        (a, b) => a.attrOrderNum - b.attrOrderNum
      );
    }
  }

  return dynamicColumns;
};

/**
 * @함수 우측 하단 테이블 전체 컬럼 생성
 * @설명 고정 컬럼과 동적 컬럼을 합쳐서 최종 컬럼 배열 반환
 * @param {any} codeData - 전체 코드 데이터
 * @param {string | null} selectedGroupCd - 현재 선택된 그룹코드
 * @returns {Array} [고정 시작 컬럼] + [동적 속성 컬럼] + [고정 끝 컬럼]
 */
export const rightBottomTableColumns = (
  codeData: any,
  selectedGroupCd: string | null
) => {
  const dynamicColumns = createDynamicColumns(codeData, selectedGroupCd);
  return [...fixedStartColumns, ...dynamicColumns, ...fixedEndColumns];
};
