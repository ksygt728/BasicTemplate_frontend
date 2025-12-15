/**
 * @파일명 : info.tsx
 * @설명 : 사용자별 권한 관리 화면의 정보 설정 (필드 정의, 컬럼 정의)
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

/**
 * @constant userSearchFields
 * @description 사용자 검색 폼 필드 정의
 */
export const userSearchFields = [
  {
    name: "userId",
    label: "사용자 ID",
    type: "text" as const,
    placeholder: "사용자 ID를 입력하세요",
  },
  {
    name: "name",
    label: "이름",
    type: "text" as const,
    placeholder: "이름을 입력하세요",
  },
  {
    name: "email",
    label: "이메일",
    type: "text" as const,
    placeholder: "이메일을 입력하세요",
  },
];

/**
 * @constant userTableColumns
 * @description 사용자 테이블 컬럼 정의
 */
export const userTableColumns = [
  {
    key: "userId",
    label: "사용자 ID",
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    key: "name",
    label: "이름",
    width: 120,
    sortable: true,
    filterable: true,
  },
  {
    key: "email",
    label: "이메일",
    width: 200,
    sortable: true,
    filterable: true,
  },
  {
    key: "phoneNum",
    label: "전화번호",
    width: 150,
    sortable: false,
  },
  {
    key: "deptName",
    label: "부서",
    width: 150,
    sortable: true,
  },
];

/**
 * @constant userRoleTableColumns
 * @description 사용자 권한 테이블 컬럼 정의
 */
export const userRoleTableColumns = [
  {
    key: "roleCd",
    label: "권한 코드",
    width: 120,
    sortable: true,
  },
  {
    key: "roleName",
    label: "권한명",
    width: 150,
    sortable: true,
  },
  {
    key: "roleDesc",
    label: "설명",
    width: 200,
    sortable: false,
  },
  {
    key: "useYn",
    label: "사용여부",
    width: 80,
    sortable: true,
  },
];

/**
 * @constant availableRoleTableColumns
 * @description 부여 가능한 권한 테이블 컬럼 정의
 */
export const availableRoleTableColumns = [
  {
    key: "roleCd",
    label: "권한 코드",
    width: 120,
    sortable: true,
  },
  {
    key: "roleName",
    label: "권한명",
    width: 150,
    sortable: true,
  },
  {
    key: "roleDesc",
    label: "설명",
    width: 250,
    sortable: false,
  },
];

/**
 * @constant initialSearchData
 * @description 초기 검색 데이터
 */
export const initialSearchData = {
  userId: "",
  name: "",
  email: "",
};
