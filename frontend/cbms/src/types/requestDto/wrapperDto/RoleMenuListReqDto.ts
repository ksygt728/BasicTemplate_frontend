import type { RoleMenuReqDto } from "@/types/requestDto/RoleMenuReqDto";

/**
 * 역할-메뉴 리스트 요청 래퍼 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface RoleMenuListReqDto {
  /** 역할-메뉴 리스트 */
  roleMenus: RoleMenuReqDto[];
}
