/**
 * @파일명 : info.tsx
 * @설명 : 권한 관리 화면의 정보 설정 (필드 정의)
 * @작성자 : 김승연
 * @작성일 : 2025.12.12
 * @변경이력 :
 *       2025.12.12 김승연 최초 생성
 */

/**
 * @constant tableColumns
 * @description 권한 테이블 컬럼 정의
 */
export const tableColumns = [
  {
    key: "roleCd",
    label: "권한 코드",
    width: 150,
    sortable: true,
    filterable: true,
    editable: false,
    required: true,
    type: "text",
    placeholder: "권한 코드를 입력하세요",
  },
  {
    key: "roleName",
    label: "권한명",
    width: 200,
    sortable: true,
    filterable: true,
    editable: true,
    required: true,
    type: "text",
    placeholder: "권한명을 입력하세요",
  },
  {
    key: "roleDesc",
    label: "권한 설명",
    width: 300,
    sortable: true,
    filterable: true,
    editable: true,
    required: false,
    type: "text",
    placeholder: "권한 설명을 입력하세요",
  },
];

/**
 * @constant initialRoleFormData
 * @description 권한 폼 초기값
 */
export const initialRoleFormData = {
  roleCd: "",
  roleName: "",
  roleDesc: "",
};

/**
 * @constant searchFields
 * @description 권한 검색 필드 정의
 */
export const searchFields = [
  {
    name: "roleCd",
    label: "권한 코드",
    type: "text",
    placeholder: "권한 코드를 입력하세요",
  },
  {
    name: "roleName",
    label: "권한명",
    type: "text",
    placeholder: "권한명을 입력하세요",
  },
];

/**
 * @constant initialSearchData
 * @description 검색 폼 초기값
 */
export const initialSearchData = {
  roleCd: "",
  roleName: "",
};

/**
 * @constant roleFormFields
 * @description 권한 폼 필드 정의 (레거시 - 호환성 유지)
 */
export const roleFormFields = {
  roleCd: {
    label: "권한 코드",
    required: true,
    placeholder: "권한 코드를 입력하세요 (예: ROLE_ADMIN)",
  },
  roleName: {
    label: "권한명",
    required: true,
    placeholder: "권한명을 입력하세요 (예: 관리자)",
  },
  roleDesc: {
    label: "권한 설명",
    required: false,
    placeholder: "권한 설명을 입력하세요",
  },
};
