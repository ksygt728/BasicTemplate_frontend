/**
 * @파일명 : info.tsx
 * @설명 : 채번 관리 화면의 정보 설정 (필드 정의)
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

/**
 * @constant tableColumns
 * @description 채번 테이블 컬럼 정의
 */
export const tableColumns = [
  {
    key: "seqId",
    title: "채번 ID",
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    key: "seqName",
    title: "채번명",
    width: 200,
    sortable: true,
    filterable: true,
  },
  {
    key: "pattern",
    title: "패턴",
    width: 200,
    sortable: true,
    filterable: true,
  },
  {
    key: "prefix",
    title: "접두어(PREFIX)",
    width: 120,
    sortable: true,
    filterable: true,
  },
  {
    key: "currentValue",
    title: "현재값(VALUE)",
    width: 100,
    sortable: true,
    filterable: false,
  },
  {
    key: "step",
    title: "증가량",
    width: 100,
    sortable: true,
    filterable: false,
  },
  {
    key: "length",
    title: "길이",
    width: 100,
    sortable: true,
    filterable: false,
  },
  {
    key: "dateformat",
    title: "날짜 포맷(DATEFORMAT)",
    width: 150,
    sortable: true,
    filterable: true,
  },
];

/**
 * @constant searchFields
 * @description 채번 검색 필드 정의
 */
export const searchFields = [
  {
    name: "seqId",
    label: "채번 ID",
    type: "text" as const,
    placeholder: "채번 ID를 입력하세요",
  },
  {
    name: "seqName",
    label: "채번명",
    type: "text" as const,
    placeholder: "채번명을 입력하세요",
  },
  {
    name: "prefix",
    label: "접두어",
    type: "text" as const,
    placeholder: "접두어를 입력하세요",
  },
];

/**
 * @constant initialSearchData
 * @description 검색 폼 초기값
 */
export const initialSearchData = {
  seqId: "",
  seqName: "",
  prefix: "",
};

/**
 * @constant initialChaebunFormData
 * @description 채번 폼 초기값
 */
export const initialChaebunFormData = {
  seqId: "",
  seqName: "",
  pattern: "",
  prefix: "",
  step: 1,
  length: 5,
  dateformat: "",
};

/**
 * @constant chaebunFormFields
 * @description 채번 폼 필드 정의
 */
export const chaebunFormFields = [
  {
    name: "seqId",
    label: "채번 ID",
    type: "text",
    required: true,
    placeholder: "채번 ID를 입력하세요 (예: SEQ_ORDER)",
    disabled: false,
  },
  {
    name: "seqName",
    label: "채번명",
    type: "text",
    required: true,
    placeholder: "채번명을 입력하세요 (예: 주문번호 채번)",
  },
  {
    name: "pattern",
    label: "패턴",
    type: "text",
    required: true,
    placeholder: "예: {prefix}{date}{seq}",
  },
  {
    name: "prefix",
    label: "접두어(PREFIX)",
    type: "text",
    required: true,
    placeholder: "예: ORD",
  },
  {
    name: "step",
    label: "증가량(VALUE의 증가 단위)",
    type: "number",
    required: true,
    placeholder: "1",
  },
  {
    name: "length",
    label: "길이(VALUE의 자릿수)",
    type: "number",
    required: true,
    placeholder: "5",
  },
  {
    name: "dateformat",
    label: "날짜 포맷(DATEFORMAT)",
    type: "text",
    required: false,
    placeholder: "예: yyyyMMdd (선택사항)",
  },
  {
    name: "currentValue",
    label: "현재값(VALUE)",
    type: "number",
    required: false,
    placeholder: "",
    disabled: true,
    showOnlyInEditMode: true, // 수정 모드일 때만 표시
  },
];
