import type { SearchField } from "@/components/common/themed/SearchForm";

/**
 * @파일명 : info.tsx
 * @설명 : 다국어 관리 페이지의 컬럼 정의 및 옵션 정보
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

// ============================================================================
// 검색 폼 옵션
// ============================================================================

/**
 * @설정 검색 폼 옵션들
 * @설명 SearchForm 컴포넌트에서 사용할 검색 조건 옵션 정의
 */
export const searchOptions: SearchField[] = [
  {
    label: "언어코드",
    name: "langCd",
    type: "text",
    placeholder: "언어코드를 입력하세요 (예: ko, en, ja)",
  },
  {
    label: "언어유형",
    name: "langType",
    type: "text",
    placeholder: "언어유형을 입력하세요",
  },
  {
    label: "언어명",
    name: "langNm",
    type: "text",
    placeholder: "언어명을 입력하세요 (예: 한국어, English)",
  },
  {
    label: "언어구분",
    name: "langGubun",
    type: "text",
    placeholder: "언어구분을 입력하세요",
  },
  {
    label: "사용여부",
    name: "useYn",
    type: "select",
    placeholder: "사용여부를 선택하세요",
    options: [
      { label: "전체", value: "" },
      { label: "사용", value: "Y" },
      { label: "미사용", value: "N" },
    ],
  },
];

// ============================================================================
// 테이블 컬럼 정의
// ============================================================================

/**
 * @컬럼정의 다국어 테이블 컬럼 정의
 * @설명 다국어 관리 테이블의 컬럼 구조 정의
 * - langCd: 언어코드 (편집 불가 - Primary Key 일부, 필수)
 * - langType: 언어유형 (편집 가능, 필수)
 * - langNm: 언어명 (편집 가능, 필수)
 * - langGubun: 언어구분 (편집 불가 - Primary Key 일부, 필수)
 * - useYn: 사용여부 (편집 가능, 필수)
 */
export const tableColumns = [
  {
    key: "langCd",
    label: "언어코드",
    width: 120,
    sortable: true,
    editable: false,
    type: "text" as const,
    required: true,
  },
  {
    key: "langType",
    label: "언어유형",
    width: 120,
    sortable: true,
    editable: false,
    type: "text" as const,
    required: true,
  },
  {
    key: "langNm",
    label: "언어명",
    width: 200,
    sortable: true,
    editable: true,
    type: "text" as const,
    required: true,
  },
  {
    key: "langGubun",
    label: "언어구분",
    width: 120,
    sortable: true,
    editable: false,
    type: "text" as const,
    required: true,
  },
  {
    key: "useYn",
    label: "사용여부",
    width: 100,
    sortable: true,
    editable: true,
    type: "select" as const,
    options: ["Y", "N"],
    required: true,
  },
];
