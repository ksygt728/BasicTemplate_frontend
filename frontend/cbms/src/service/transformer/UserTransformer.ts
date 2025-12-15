import { UserResDto } from "@/types/responseDto/UserResDto";

/**
 * @파일명 : UserTransformer.ts
 * @설명 : 사용자 관리 도메인의 UI 데이터 변환 트랜스포머
 * @작성자 : 김승연
 * @작성일 : 2025.12.10
 * @변경이력 :
 *       2025.12.10 김승연 최초 생성
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
  role: string;
  userType: string;
  gender: string;
  deptCode?: string;
  deptName?: string;
}

// ============================================================================
// API Response → 테이블 데이터 변환
// ============================================================================

/**
 * @function transformUserListData
 * @description API 응답 데이터를 사용자 테이블 데이터로 변환
 * @param {any} userData - API 응답 데이터
 * @returns {UserTableRow[]} 사용자 테이블 데이터 배열
 */
export const transformUserListData = (userData: any): UserTableRow[] => {
  if (!userData?.content) return [];

  return userData.content.map((user: UserResDto) => ({
    id: user.userId,
    userId: user.userId,
    name: user.name,
    phoneNum: user.phoneNum,
    email: user.email,
    role: user.role,
    userType: user.userType,
    gender: user.gender,
    deptCode: user.department?.deptCode,
    deptName: user.department?.deptNm,
  }));
};

/**
 * @function transformUserDetailData
 * @description API 응답 데이터를 사용자 상세 폼 데이터로 변환
 * @param {UserResDto | null} userData - API 응답 사용자 데이터
 * @returns {Record<string, any>} 사용자 상세 폼 데이터
 */
export const transformUserDetailData = (
  userData: UserResDto | null
): Record<string, any> => {
  if (!userData) {
    return {
      userId: "",
      name: "",
      phoneNum: "",
      email: "",
      role: "",
      userType: "",
      gender: "",
      deptCode: "",
      deptName: "",
    };
  }

  return {
    userId: userData.userId || "",
    name: userData.name || "",
    phoneNum: userData.phoneNum || "",
    email: userData.email || "",
    role: userData.role || "",
    userType: userData.userType || "",
    gender: userData.gender || "",
    deptCode: userData.department?.deptCode || "",
    deptName: userData.department?.deptNm || "",
  };
};
