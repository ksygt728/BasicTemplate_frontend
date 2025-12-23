import type { SearchField } from "@/components/common/themed/SearchForm";

/**
 * @파일명 : info.tsx
 * @설명 : SMS 관리 페이지의 컬럼 정의 및 옵션 정보
 * @작성자 : 김승연
 * @작성일 : 2025.12.17
 */

export const searchOptions: SearchField[] = [
  {
    name: "smsId",
    label: "SMS 아이디",
    type: "text",
    placeholder: "SMS 아이디를 입력하세요",
  },
  {
    name: "langType",
    label: "언어타입",
    type: "select",
    placeholder: "언어타입을 선택하세요",
    options: [
      { value: "", label: "전체" },
      { value: "ko", label: "한국어" },
      { value: "en", label: "영어" },
    ],
  },
  {
    name: "smsName",
    label: "템플릿명",
    type: "text",
    placeholder: "템플릿명을 입력하세요",
  },
];

export const leftTableColumns = [
  {
    key: "smsId",
    label: "SMS 아이디",
    width: 160,
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
    options: ["ko", "en"],
  },
  {
    key: "smsName",
    label: "템플릿명",
    width: 220,
    sortable: true,
    editable: true,
    type: "text" as const,
    required: true,
  },
  {
    key: "text",
    label: "내용",
    width: 340,
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
    key: "smsId",
    label: "SMS 아이디",
    width: 150,
    sortable: true,
    editable: false,
    type: "text" as const,
  },
  {
    key: "fromPhone",
    label: "발신자",
    width: 160,
    sortable: true,
    editable: false,
    type: "text" as const,
  },
  {
    key: "toPhone",
    label: "수신자",
    width: 160,
    sortable: true,
    editable: false,
    type: "text" as const,
  },
  {
    key: "text",
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
