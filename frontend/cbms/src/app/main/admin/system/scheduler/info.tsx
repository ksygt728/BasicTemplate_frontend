import type { SearchField } from "@/components/common/themed/SearchForm";

/**
 * @파일명 : info.tsx
 * @설명 : 스케줄러 관리 페이지의 컬럼 정의 및 옵션 정보
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
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
    label: "스케줄러 그룹",
    name: "scheGroup",
    type: "text",
    placeholder: "스케줄러 그룹을 입력하세요",
  },
  {
    label: "스케줄아이디",
    name: "scheId",
    type: "text",
    placeholder: "스케줄아이디를 입력하세요",
  },
  {
    label: "스케줄명",
    name: "scheName",
    type: "text",
    placeholder: "스케줄명을 입력하세요",
  },
  {
    label: "사용여부",
    name: "useYn",
    type: "select",
    placeholder: "사용여부를 선택하세요",
    options: [
      { value: "", label: "전체" },
      { value: "Y", label: "사용" },
      { value: "N", label: "미사용" },
    ],
  },
];

// ============================================================================
// 테이블 컬럼 정의
// ============================================================================

/**
 * @컬럼정의 좌측 테이블 컬럼 정의 (스케줄러 기준정보)
 * @설명 스케줄러 마스터 정보 관리 테이블의 컬럼 구조 정의
 * - scheId: 스케줄아이디 (편집 불가 - Primary Key, 필수)
 * - scheName: 스케줄명 (편집 가능, 필수)
 * - scheGroup: 스케줄러 그룹명 (편집 가능, 필수)
 * - description: 설명 (편집 가능, 선택)
 * - className: 클래스명 (편집 가능, 필수)
 * - methodName: 메소드명 (편집 가능, 필수)
 * - triggerName: 트리거명 (편집 가능, 필수)
 * - cronExp: CRON식 (편집 가능, 필수)
 * - lastExecTime: 마지막실행시간 (편집 불가)
 * - nextExecTime: 다음실행시간 (편집 불가)
 * - useYn: 사용여부 (편집 가능, 필수)
 */
export const leftTableColumns = [
  {
    key: "scheGroup",
    label: "스케줄러 그룹",
    width: 150,
    sortable: true,
    editable: true,
    type: "text" as const,
    required: true,
  },
  {
    key: "scheId",
    label: "스케줄아이디",
    width: 180,
    sortable: true,
    editable: false,
    type: "text" as const,
    required: true,
  },
  {
    key: "scheName",
    label: "스케줄명",
    width: 200,
    sortable: true,
    editable: true,
    type: "text" as const,
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
  {
    key: "className",
    label: "클래스명",
    width: 250,
    sortable: false,
    editable: true,
    type: "text" as const,
    required: true,
  },
  {
    key: "methodName",
    label: "메소드명",
    width: 150,
    sortable: false,
    editable: true,
    type: "text" as const,
    required: true,
  },
  {
    key: "triggerName",
    label: "트리거명",
    width: 150,
    sortable: false,
    editable: true,
    type: "text" as const,
    required: true,
  },
  {
    key: "cronExp",
    label: "CRON식",
    width: 150,
    sortable: false,
    editable: true,
    type: "text" as const,
    required: true,
  },
  {
    key: "lastExecTime",
    label: "마지막실행시간",
    width: 180,
    sortable: true,
    editable: false,
    type: "text" as const,
    required: false,
  },
  {
    key: "nextExecTime",
    label: "다음실행시간",
    width: 180,
    sortable: true,
    editable: false,
    type: "text" as const,
    required: false,
  },
  {
    key: "useYn",
    label: "사용여부",
    width: 100,
    sortable: true,
    editable: true,
    type: "select" as const,
    required: true,
    options: ["Y", "N"],
  },
];

/**
 * @컬럼정의 우측 테이블 컬럼 정의 (스케줄러 이력정보)
 * @설명 스케줄러 실행 이력 정보 테이블의 컬럼 구조 정의
 * - logId: 로그아이디 (편집 불가, Primary Key)
 * - scheId: 스케줄아이디 (편집 불가)
 * - scheGroup: 스케줄러 그룹명 (편집 불가)
 * - startTime: 시작시간 (편집 불가)
 * - endTime: 종료시간 (편집 불가)
 * - execTime: 실행시간(ms) (편집 불가)
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
    key: "scheId",
    label: "스케줄아이디",
    width: 180,
    sortable: true,
    editable: false,
    type: "text" as const,
  },
  {
    key: "scheGroup",
    label: "스케줄러 그룹",
    width: 150,
    sortable: true,
    editable: false,
    type: "text" as const,
  },
  {
    key: "startTime",
    label: "시작시간",
    width: 180,
    sortable: true,
    editable: false,
    type: "text" as const,
  },
  {
    key: "endTime",
    label: "종료시간",
    width: 180,
    sortable: true,
    editable: false,
    type: "text" as const,
  },
  {
    key: "execTime",
    label: "실행시간(ms)",
    width: 120,
    sortable: true,
    editable: false,
    type: "number" as const,
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
    width: 300,
    sortable: false,
    editable: false,
    type: "text" as const,
  },
];
