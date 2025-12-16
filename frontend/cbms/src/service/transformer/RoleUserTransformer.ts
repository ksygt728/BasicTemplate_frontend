import { UserResDto } from "@/types/responseDto/UserResDto";
import { RoleResDto } from "@/types/responseDto/RoleResDto";
import { RoleUserResDto } from "@/types/responseDto/RoleUserResDto";

/**
 * @파일명 : RoleUserTransformer.ts
 * @설명 : 사용자별 권한 관리 도메인의 UI 데이터 변환 트랜스포머
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface UserTableRow
 * @description 사용자 테이블 Row 타입
 */
export interface UserTableRow {
  id: string;
  userId: string;
  name: string;
  phoneNum: string;
  email: string;
  userType: string;
  gender: string;
  deptCode?: string;
  deptName?: string;
}

/**
 * @interface UserRoleTableRow
 * @description 사용자 권한 테이블 Row 타입
 */
export interface UserRoleTableRow {
  id: string;
  roleCd: string;
  roleName: string;
  roleDesc: string;
  useYn: string;
}

/**
 * @interface AvailableRoleTableRow
 * @description 부여 가능한 권한 테이블 Row 타입
 */
export interface AvailableRoleTableRow {
  id: string;
  roleCd: string;
  roleName: string;
  roleDesc: string;
}

// ============================================================================
// API Response → 테이블 데이터 변환
// ============================================================================

/**
 * @function transformUserListToTableData
 * @description 사용자 리스트 API 응답을 테이블 데이터로 변환
 * @param {any} userData - API 응답 사용자 데이터
 * @returns {UserTableRow[]} 사용자 테이블 데이터 배열
 */
export const transformUserListToTableData = (userData: any): UserTableRow[] => {
  if (!userData?.content) return [];

  return userData.content.map((user: UserResDto) => ({
    id: user.userId,
    userId: user.userId,
    name: user.name,
    phoneNum: user.phoneNum,
    email: user.email,
    userType: user.userType,
    gender: user.gender,
    deptCode: user.department?.deptCode,
    deptName: user.department?.deptNm,
  }));
};

/**
 * @function transformUserRoleListToTableData
 * @description 사용자가 가진 권한 리스트를 테이블 데이터로 변환
 * @param {RoleUserResDto[]} userRoleList - 사용자 권한 리스트
 * @returns {UserRoleTableRow[]} 사용자 권한 테이블 데이터 배열
 */
export const transformUserRoleListToTableData = (
  userRoleList: RoleUserResDto[]
): UserRoleTableRow[] => {
  if (!userRoleList || userRoleList.length === 0) return [];

  return userRoleList.map((userRole) => ({
    id: userRole.role.roleCd,
    roleCd: userRole.role.roleCd,
    roleName: userRole.role.roleName,
    roleDesc: userRole.role.roleDesc || "",
    useYn: userRole.useYn,
  }));
};

/**
 * @function transformAvailableRoleListToTableData
 * @description 부여 가능한 권한 리스트를 테이블 데이터로 변환
 * @param {RoleResDto[]} roleList - 권한 리스트
 * @param {RoleUserResDto[]} userRoleList - 사용자가 이미 가진 권한 리스트
 * @returns {AvailableRoleTableRow[]} 부여 가능한 권한 테이블 데이터 배열
 */
export const transformAvailableRoleListToTableData = (
  roleList: RoleResDto[],
  userRoleList: RoleUserResDto[]
): AvailableRoleTableRow[] => {
  if (!roleList || roleList.length === 0) return [];

  // 사용자가 이미 가진 권한 코드 목록
  const userRoleCodes = new Set(userRoleList.map((ur) => ur.role.roleCd));

  // 사용자가 가지지 않은 권한만 필터링
  return roleList
    .filter((role) => !userRoleCodes.has(role.roleCd))
    .map((role) => ({
      id: role.roleCd,
      roleCd: role.roleCd,
      roleName: role.roleName,
      roleDesc: role.roleDesc || "",
    }));
};

/**
 * @function getUserTableColumns
 * @description 사용자 테이블의 컬럼 정의를 반환
 * @returns {Array} 컬럼 정의 배열
 */
export const getUserTableColumns = () => [
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
 * @function getUserRoleTableColumns
 * @description 사용자 권한 테이블의 컬럼 정의를 반환
 * @returns {Array} 컬럼 정의 배열
 */
export const getUserRoleTableColumns = () => [
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
  {
    key: "useYn",
    label: "사용여부",
    width: 80,
    sortable: true,
  },
];

/**
 * @function getAvailableRoleTableColumns
 * @description 부여 가능한 권한 테이블의 컬럼 정의를 반환
 * @returns {Array} 컬럼 정의 배열
 */
export const getAvailableRoleTableColumns = () => [
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
