import { RoleUserReqDto } from "@/types/requestDto/RoleUserReqDto";
import { UserReqDto } from "@/types/requestDto/UserReqDto";

/**
 * @파일명 : RoleUserMapper.ts
 * @설명 : 사용자별 권한 관리 도메인의 DTO 변환 매퍼
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

// ============================================================================
// 검색 폼 → DTO 변환
// ============================================================================

/**
 * @function toUserSearchReqDto
 * @description 사용자 검색 폼 데이터를 UserReqDto로 변환
 * @param {Record<string, any>} searchData - 검색 폼 데이터
 * @returns {Partial<UserReqDto>} 변환된 검색 DTO
 */
export const toUserSearchReqDto = (
  searchData: Record<string, any>
): Partial<UserReqDto> => {
  const searchForm: Partial<UserReqDto> = {};

  // 사용자 아이디
  if (searchData.userId && searchData.userId.trim() !== "") {
    searchForm.userId = searchData.userId;
  }

  // 이름
  if (searchData.name && searchData.name.trim() !== "") {
    searchForm.name = searchData.name;
  }

  // 이메일
  if (searchData.email && searchData.email.trim() !== "") {
    searchForm.email = searchData.email;
  }

  // 전화번호
  if (searchData.phoneNum && searchData.phoneNum.trim() !== "") {
    searchForm.phoneNum = searchData.phoneNum;
  }

  // 사용자타입
  if (searchData.userType && searchData.userType.trim() !== "") {
    searchForm.userType = searchData.userType;
  }

  // 성별
  if (searchData.gender && searchData.gender.trim() !== "") {
    searchForm.gender = searchData.gender;
  }

  // 부서코드
  if (searchData.deptCode && searchData.deptCode.trim() !== "") {
    searchForm.deptCode = searchData.deptCode;
  }

  return searchForm;
};

// ============================================================================
// 권한 데이터 → DTO 변환
// ============================================================================

/**
 * @function toRoleUserReqDto
 * @description 권한 부여/수정 데이터를 RoleUserReqDto로 변환
 * @param {string} userId - 사용자 아이디
 * @param {string} roleCd - 권한 코드
 * @param {string} useYn - 사용 여부 (Y, N)
 * @returns {RoleUserReqDto} 변환된 권한-사용자 DTO
 */
export const toRoleUserReqDto = (
  userId: string,
  roleCd: string,
  useYn: string
): RoleUserReqDto => {
  return {
    userId: userId.trim(),
    roleCd: roleCd.trim(),
    useYn: useYn.trim(),
  };
};

/**
 * @function toRoleUserReqDtoList
 * @description 여러 권한 부여/수정 데이터를 RoleUserReqDto 배열로 변환
 * @param {string} userId - 사용자 아이디
 * @param {Array<{roleCd: string, useYn: string}>} roles - 권한 리스트
 * @returns {RoleUserReqDto[]} 변환된 권한-사용자 DTO 배열
 */
export const toRoleUserReqDtoList = (
  userId: string,
  roles: Array<{ roleCd: string; useYn: string }>
): RoleUserReqDto[] => {
  return roles.map((role) => toRoleUserReqDto(userId, role.roleCd, role.useYn));
};
