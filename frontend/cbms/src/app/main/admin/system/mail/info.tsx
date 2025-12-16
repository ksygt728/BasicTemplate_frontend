import type { SearchField } from "@/components/common/themed/SearchForm";

/**
 * @파일명 : info.tsx
 * @설명 : 메일 관리 페이지의 컬럼 정의 및 옵션 정보
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
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
    label: "메일아이디",
    name: "mailId",
    type: "text",
    placeholder: "메일아이디를 입력하세요",
  },
  {
    label: "언어타입",
    name: "langType",
    type: "select",
    placeholder: "언어타입을 선택하세요",
    options: [
      { value: "", label: "전체" },
      { value: "ko", label: "한국어" },
      { value: "en", label: "영어" },
      { value: "zh", label: "중국어" },
    ],
  },
  {
    label: "메일명",
    name: "mailName",
    type: "text",
    placeholder: "메일명을 입력하세요",
  },
  {
    label: "제목",
    name: "title",
    type: "text",
    placeholder: "제목을 입력하세요",
  },
];

// ============================================================================
// 테이블 컬럼 정의
// ============================================================================

/**
 * @컬럼정의 좌측 테이블 컬럼 정의 (메일 기준정보)
 * @설명 메일 마스터 정보 관리 테이블의 컬럼 구조 정의
 * - mailId: 메일아이디 (편집 불가 - Primary Key, 필수)
 * - langType: 언어타입 (편집 가능, 필수)
 * - mailName: 메일명 (편집 가능, 필수)
 * - title: 제목 (편집 가능, 필수)
 * - content: 내용 (편집 가능, 필수)
 * - description: 설명 (편집 가능, 선택)
 */
export const leftTableColumns = [
  {
    key: "mailId",
    label: "메일아이디",
    width: 150,
    sortable: true,
    editable: false,
    type: "text" as const,
    required: true,
  },
  {
    key: "langType",
    label: "언어타입",
    width: 100,
    sortable: true,
    editable: true,
    type: "select" as const,
    required: true,
    options: ["ko", "en", "zh"],
  },
  {
    key: "mailName",
    label: "메일명",
    width: 200,
    sortable: true,
    editable: true,
    type: "text" as const,
    required: true,
  },
  {
    key: "title",
    label: "제목",
    width: 250,
    sortable: true,
    editable: true,
    type: "text" as const,
    required: true,
  },
  {
    key: "content",
    label: "내용",
    width: 300,
    sortable: false,
    editable: true,
    type: "textarea" as const,
    required: true,
  },
  {
    key: "description",
    label: "설명",
    width: 200,
    sortable: false,
    editable: true,
    type: "text" as const,
    required: false,
  },
];

/**
 * @컬럼정의 우측 테이블 컬럼 정의 (메일 이력정보)
 * @설명 메일 발송 이력 정보 테이블의 컬럼 구조 정의
 * - logId: 로그아이디 (편집 불가, Primary Key)
 * - mailId: 메일아이디 (편집 불가)
 * - fromAddr: 발신자 (편집 불가)
 * - toAddr: 수신자 (편집 불가)
 * - title: 제목 (편집 불가)
 * - content: 내용 (편집 불가)
 * - success: 성공여부 (편집 불가)
 * - errorMsg: 실패사유 (편집 불가)
 */
export const rightTableColumns = [
  {
    key: "logId",
    label: "로그아이디",
    width: 150,
    sortable: true,
    editable: false,
    type: "text" as const,
  },
  {
    key: "mailId",
    label: "메일아이디",
    width: 150,
    sortable: true,
    editable: false,
    type: "text" as const,
  },
  {
    key: "fromAddr",
    label: "발신자",
    width: 200,
    sortable: true,
    editable: false,
    type: "text" as const,
  },
  {
    key: "toAddr",
    label: "수신자",
    width: 200,
    sortable: true,
    editable: false,
    type: "text" as const,
  },
  {
    key: "title",
    label: "제목",
    width: 250,
    sortable: true,
    editable: false,
    type: "text" as const,
  },
  {
    key: "content",
    label: "내용",
    width: 300,
    sortable: false,
    editable: false,
    type: "textarea" as const,
  },
  {
    key: "success",
    label: "성공여부",
    width: 100,
    sortable: true,
    editable: false,
    type: "text" as const,
  },
  {
    key: "errorMsg",
    label: "실패사유",
    width: 200,
    sortable: false,
    editable: false,
    type: "text" as const,
  },
];
