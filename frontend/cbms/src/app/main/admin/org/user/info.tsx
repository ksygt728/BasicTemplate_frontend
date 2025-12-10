import type { SearchField } from "@/components/common/themed/SearchForm";
import type { TableColumn } from "@/components/common/themed/Table";

/**
 * @파일명 : info.tsx
 * @설명 : 사용자 관리 페이지의 컬럼 정의 및 옵션 정보
 * @작성자 : 김승연
 * @작성일 : 2025.12.10
 * @변경이력 :
 *       2025.12.10 김승연 최초 생성
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
    name: "userId",
    label: "사용자 아이디",
    type: "text",
    placeholder: "사용자 아이디를 입력하세요",
  },
  {
    name: "name",
    label: "이름",
    type: "text",
    placeholder: "이름을 입력하세요",
  },
  {
    name: "phoneNum",
    label: "전화번호",
    type: "text",
    placeholder: "숫자, -, 공백 모두 입력 가능",
  },
];

// ============================================================================
// 테이블 컬럼 정의
// ============================================================================

/**
 * @컬럼정의 사용자 목록 테이블 컬럼 정의
 * @설명 사용자 관리 테이블의 컬럼 구조 정의
 * - userId: 사용자 아이디 (필수)
 * - name: 이름 (필수)
 * - email: 이메일
 * - phoneNum: 전화번호
 * - userType: 사용자 타입
 * - gender: 성별
 * - deptName: 부서명
 */
export const userTableColumns: TableColumn[] = [
  {
    key: "userId",
    title: "사용자 아이디",
    dataIndex: "userId",
    width: 150,
    align: "left",
    sortable: true,
  },
  {
    key: "name",
    title: "이름",
    dataIndex: "name",
    width: 120,
    align: "left",
    sortable: true,
  },
  {
    key: "deptName",
    title: "부서명",
    dataIndex: "deptName",
    width: 150,
    align: "left",
    sortable: true,
  },
];

// ============================================================================
// 상세정보 폼 필드 정의
// ============================================================================

/**
 * @설정 상세정보 입력 필드들
 * @설명 사용자 상세정보 폼에서 사용할 필드 정의
 */
export const detailFormFields = [
  {
    name: "userId",
    label: "사용자 아이디",
    type: "text" as const,
    required: true,
    disabled: true,
  },
  {
    name: "name",
    label: "이름",
    type: "text" as const,
    required: true,
    disabled: true,
  },
  {
    name: "email",
    label: "이메일",
    type: "email" as const,
    required: true,
    disabled: true,
  },
  {
    name: "phoneNum",
    label: "전화번호",
    type: "text" as const,
    required: true,
  },
  {
    name: "userType",
    label: "사용자 타입",
    type: "text" as const,
    required: false,
    disabled: true,
  },
  {
    name: "gender",
    label: "성별",
    type: "text" as const,
    required: false,
    disabled: true,
  },
  {
    name: "deptName",
    label: "부서명",
    type: "text" as const,
    required: false,
    disabled: true,
  },
];
