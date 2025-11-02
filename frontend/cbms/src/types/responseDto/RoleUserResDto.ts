import type { RoleResDto } from "@/types/responseDto/RoleResDto";

/**
 * 사용자-역할 관계 응답 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface RoleUserResDto {
  /** 사용자 아이디 */
  userId: string;

  /** 사용여부 (Y,N) */
  useYn: string;

  /** 역할 정보 */
  role: RoleResDto;
}
