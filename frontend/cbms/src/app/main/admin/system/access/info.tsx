import type { SearchField } from "@/components/common/themed/SearchForm";
import type { TableColumn } from "@/components/common/themed/Table";

/**
 * @파일명 : info.tsx
 * @설명 : 로그 관리 페이지의 컬럼 정의 및 옵션 정보
 * @작성자 : 김승연
 * @작성일 : 2025.12.16
 * @변경이력 :
 *       2025.12.16 김승연 최초 생성
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
    name: "logId",
    label: "로그 ID",
    type: "text",
    placeholder: "로그 ID를 입력하세요",
  },
  {
    name: "userId",
    label: "사용자 아이디",
    type: "text",
    placeholder: "사용자 아이디를 입력하세요",
  },
  {
    name: "requestUri",
    label: "요청 URI",
    type: "text",
    placeholder: "요청 URI를 입력하세요",
  },
  {
    name: "httpMethod",
    label: "메소드",
    type: "text",
    placeholder: "HTTP 메소드를 입력하세요",
  },
  {
    name: "ipAddr",
    label: "IP 주소",
    type: "text",
    placeholder: "IP 주소를 입력하세요",
  },
  {
    name: "startDateRange",
    label: "시작일자",
    type: "dateRange",
    placeholder: "시작일자 기간을 선택하세요",
  },
  {
    name: "endDateRange",
    label: "종료일자",
    type: "dateRange",
    placeholder: "종료일자 기간을 선택하세요",
  },
];

// ============================================================================
// 테이블 컬럼 정의
// ============================================================================

/**
 * @컬럼정의 로그 목록 테이블 컬럼 정의
 * @설명 로그 관리 테이블의 컬럼 구조 정의
 * - userId: 사용자 아이디
 * - requestUri: 요청 URI
 * - httpMethod: HTTP 메소드
 * - statusCode: 상태 코드
 * - startDate: 시작 시간
 * - endDate: 종료 시간
 * - execTime: 실행 시간 (ms)
 * - ipAddr: IP 주소
 */
export const logTableColumns: TableColumn[] = [
  {
    key: "logId",
    title: "로그 ID",
    dataIndex: "logId",
    width: 100,
    align: "left",
    sortable: true,
  },
  {
    key: "userId",
    title: "사용자 ID",
    dataIndex: "userId",
    width: 120,
    align: "left",
    sortable: true,
  },
  {
    key: "requestUri",
    title: "요청 URI",
    dataIndex: "requestUri",
    width: 250,
    align: "left",
    sortable: true,
  },
  {
    key: "httpMethod",
    title: "메소드",
    dataIndex: "httpMethod",
    width: 80,
    align: "center",
    sortable: true,
  },
  {
    key: "statusCode",
    title: "상태",
    dataIndex: "statusCode",
    width: 70,
    align: "center",
    sortable: true,
  },
  {
    key: "startDate",
    title: "시작시간",
    dataIndex: "startDate",
    width: 180,
    align: "center",
    sortable: true,
  },
  {
    key: "endDate",
    title: "종료시간",
    dataIndex: "endDate",
    width: 180,
    align: "center",
    sortable: true,
  },
  {
    key: "execTime",
    title: "실행시간(ms)",
    dataIndex: "execTime",
    width: 100,
    align: "right",
    sortable: true,
  },
  {
    key: "ipAddr",
    title: "IP 주소",
    dataIndex: "ipAddr",
    width: 130,
    align: "left",
    sortable: true,
  },
];

// ============================================================================
// 상세정보 필드 정의
// ============================================================================

/**
 * @설정 상세정보 표시 필드들
 * @설명 로그 상세정보에서 표시할 필드 정의
 */
export const detailFields = [
  { name: "logId", label: "로그 ID" },
  { name: "userId", label: "사용자 ID" },
  { name: "requestUri", label: "요청 URI" },
  { name: "httpMethod", label: "메소드" },
  { name: "statusCode", label: "상태 코드" },
  { name: "execTime", label: "실행시간(ms)" },
  { name: "startDate", label: "시작시간" },
  { name: "endDate", label: "종료시간" },
  { name: "ipAddr", label: "IP 주소" },
  { name: "userAgent", label: "브라우저 정보" },
];
