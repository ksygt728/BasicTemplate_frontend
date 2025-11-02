import type { RoleUserReqDto } from "@/types/requestDto/RoleUserReqDto";

/**
 * 역할-사용자 리스트 요청 래퍼 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface RoleUserListReqDto {
  /** 역할-사용자 리스트 */
  roleUsers: RoleUserReqDto[];
}
