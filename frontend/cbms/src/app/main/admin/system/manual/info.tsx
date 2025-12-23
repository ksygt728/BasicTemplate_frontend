import type { SearchField } from "@/components/common/themed/SearchForm";
import type { TableColumn } from "@/components/common/themed/Table";

/**
 * @파일명 : info.tsx
 * @설명 : 게시판 관리 페이지의 컬럼 정의 및 옵션 정보
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
 */

// ============================================================================
// 검색 폼 필드 정의
// ============================================================================

/**
 * @설정 검색 폼 필드들
 * @설명 SearchForm 컴포넌트에서 사용할 검색 조건 필드 정의
 */
export const searchFields: SearchField[] = [
  {
    name: "bbsType",
    label: "게시판 타입",
    type: "select",
    placeholder: "게시판 타입 선택",
    options: [], // 공통코드에서 로드
  },
  {
    name: "title",
    label: "제목",
    type: "text",
    placeholder: "제목을 입력하세요",
  },
];

// ============================================================================
// 테이블 컬럼 정의
// ============================================================================

/**
 * @컬럼정의 게시판 목록 테이블 컬럼 정의
 * @설명 게시판 관리 테이블의 컬럼 구조 정의
 */
export const bbsTableColumns: TableColumn[] = [
  {
    key: "bbsType",
    title: "게시판 타입",
    dataIndex: "bbsType",
    width: 120,
    align: "center",
    sortable: true,
  },
  {
    key: "title",
    title: "제목",
    dataIndex: "title",
    width: 300,
    align: "left",
    sortable: true,
  },
  {
    key: "writorName",
    title: "작성자",
    dataIndex: "writorName",
    width: 120,
    align: "center",
    sortable: true,
  },
  {
    key: "writeDate",
    title: "작성일",
    dataIndex: "writeDate",
    width: 180,
    align: "center",
    sortable: true,
  },
];

// ============================================================================
// 상세정보 폼 필드 정의
// ============================================================================

/**
 * @설정 상세정보 입력 필드들
 * @설명 게시판 상세정보 폼에서 사용할 필드 정의
 */
export const detailFormFields = [
  {
    name: "bbsId",
    label: "게시판 아이디",
    type: "text" as const,
    required: false,
    disabled: true,
  },
  {
    name: "bbsType",
    label: "게시판 타입",
    type: "select" as const,
    required: true,
    disabled: false,
    options: [], // 공통코드에서 로드
  },
  {
    name: "title",
    label: "제목",
    type: "text" as const,
    required: true,
    disabled: false,
    placeholder: "제목을 입력하세요",
  },
  {
    name: "content",
    label: "내용",
    type: "textarea" as const,
    required: true,
    disabled: false,
    placeholder: "내용을 입력하세요",
  },
  {
    name: "writorName",
    label: "작성자",
    type: "text" as const,
    required: false,
    disabled: true,
  },
  {
    name: "writeDate",
    label: "작성일",
    type: "text" as const,
    required: false,
    disabled: true,
  },
];
