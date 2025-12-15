import { UserReqDto } from "@/types/requestDto/UserReqDto";

/**
 * @파일명 : UserMapper.ts
 * @설명 : 사용자 관리 도메인의 DTO 변환 매퍼
 * @작성자 : 김승연
 * @작성일 : 2025.12.10
 * @변경이력 :
 *       2025.12.10 김승연 최초 생성
 */

// ============================================================================
// 검색 폼 → DTO 변환
// ============================================================================

/**
 * @function toUserSearchReqDto
 * @description SearchForm 데이터를 UserReqDto로 변환
 * @param {Record<string, any>} searchData - 검색 폼 데이터
 * @returns {UserReqDto} 변환된 검색 DTO
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
// 테이블 Row → DTO 변환
// ============================================================================

/**
 * @function toUserReqDto
 * @description 사용자 테이블 행 데이터를 UserReqDto로 변환
 * @param {any} rowData - 테이블 행 데이터
 * @returns {UserReqDto} 변환된 사용자 DTO
 */
export const toUserReqDto = (rowData: any): UserReqDto => {
  return {
    userId: rowData.userId,
    name: rowData.name,
    phoneNum: rowData.phoneNum,
    email: rowData.email,
    userType: rowData.userType,
    gender: rowData.gender,
    password: rowData.password,
    deptCode: rowData.deptCode || rowData.department?.deptCode,
  };
};

// ============================================================================
// 폼 데이터 → DTO 변환 (상세정보 수정용)
// ============================================================================

/**
 * @function toUserReqDtoFromForm
 * @description 상세정보 폼 데이터를 UserReqDto로 변환
 * @param {Record<string, any>} formData - 상세정보 폼 데이터
 * @returns {UserReqDto} 변환된 사용자 DTO
 */
export const toUserReqDtoFromForm = (
  formData: Record<string, any>
): UserReqDto => {
  return {
    userId: formData.userId,
    name: formData.name,
    phoneNum: formData.phoneNum,
    email: formData.email,
    userType: formData.userType,
    gender: formData.gender,
    password: formData.password,
    deptCode: formData.deptCode,
  };
};
