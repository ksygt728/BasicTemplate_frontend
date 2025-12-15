/**
 * @파일명 : info.tsx
 * @설명 : 부서 관리 페이지 설정 정보 (검색 필드, 컬럼 등)
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

import { SearchField } from "@/components/common/themed/SearchForm";

/**
 * @constant searchFields
 * @description 부서 검색 폼 필드 정의
 */
export const searchFields: SearchField[] = [
  {
    name: "deptCode",
    label: "부서 코드",
    type: "text",
    placeholder: "부서 코드를 입력하세요",
  },
  {
    name: "deptNm",
    label: "부서명",
    type: "text",
    placeholder: "부서명을 입력하세요",
  },
  {
    name: "useYn",
    label: "사용 여부",
    type: "select",
    options: [
      { value: "", label: "전체" },
      { value: "Y", label: "사용" },
      { value: "N", label: "미사용" },
    ],
  },
];

/**
 * @interface DetailFormField
 * @description 상세 폼 필드 정의 인터페이스
 */
export interface DetailFormField {
  name: string;
  label: string;
  type: "text" | "select" | "number";
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

/**
 * @constant detailFormFields
 * @description 부서 상세 폼 필드 정의
 */
export const detailFormFields: DetailFormField[] = [
  {
    name: "deptCode",
    label: "부서 코드",
    type: "text",
    required: true,
    disabled: true,
    placeholder: "부서 코드",
  },
  {
    name: "deptNm",
    label: "부서명",
    type: "text",
    required: true,
    placeholder: "부서명을 입력하세요",
  },
  {
    name: "upperDeptCode",
    label: "상위 부서 코드",
    type: "text",
    placeholder: "상위 부서 코드",
  },
  {
    name: "deptLv",
    label: "부서 레벨",
    type: "number",
    disabled: true,
    placeholder: "부서 레벨",
  },
  {
    name: "useYn",
    label: "사용 여부",
    type: "select",
    required: true,
    options: [
      { value: "Y", label: "사용" },
      { value: "N", label: "미사용" },
    ],
  },
];
