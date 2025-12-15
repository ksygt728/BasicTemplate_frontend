import { RoleReqDto } from "@/types/requestDto/RoleReqDto";
import { RoleMenuReqDto } from "@/types/requestDto/RoleMenuReqDto";

/**
 * @파일명 : RoleMapper.ts
 * @설명 : 권한 관리 도메인의 DTO 변환 매퍼
 * @작성자 : 김승연
 * @작성일 : 2025.12.12
 * @변경이력 :
 *       2025.12.12 김승연 최초 생성
 */

// ============================================================================
// 폼 데이터 → DTO 변환
// ============================================================================

/**
 * @function toRoleReqDto
 * @description 권한 폼 데이터를 RoleReqDto로 변환
 * @param {Record<string, any>} formData - 폼 데이터
 * @returns {RoleReqDto} 변환된 권한 DTO
 */
export const toRoleReqDto = (formData: Record<string, any>): RoleReqDto => {
  return {
    roleCd: formData.roleCd?.trim() || "",
    roleName: formData.roleName?.trim() || "",
    roleDesc: formData.roleDesc?.trim(),
  };
};

/**
 * @function toRoleSearchReqDto
 * @description 검색 폼 데이터를 RoleReqDto로 변환
 * @param {Record<string, any>} searchData - 검색 폼 데이터
 * @returns {RoleReqDto} 변환된 검색 DTO
 */
export const toRoleSearchReqDto = (
  searchData: Record<string, any>
): RoleReqDto => {
  const roleCd = searchData.roleCd?.trim();
  const roleName = searchData.roleName?.trim();
  const roleDesc = searchData.roleDesc?.trim();

  return {
    roleCd: roleCd || "",
    roleName: roleName || "",
    roleDesc: roleDesc || "",
  };
};

/**
 * @function toRoleMenuReqDto
 * @description 권한별 메뉴 폼 데이터를 RoleMenuReqDto로 변환
 * @param {string} roleCd - 권한 코드
 * @param {string} menuCd - 메뉴 코드
 * @param {string} menuRw - 메뉴 접근 수준 (C,R,U,D)
 * @param {string} useYn - 사용 여부 (Y, N)
 * @returns {RoleMenuReqDto} 변환된 권한별 메뉴 DTO
 */
export const toRoleMenuReqDto = (
  roleCd: string,
  menuCd: string,
  menuRw: string,
  useYn: string
): RoleMenuReqDto => {
  return {
    roleCd: roleCd.trim(),
    menuCd: menuCd.trim(),
    menuRw: menuRw.trim(),
    useYn: useYn.trim(),
  };
};
