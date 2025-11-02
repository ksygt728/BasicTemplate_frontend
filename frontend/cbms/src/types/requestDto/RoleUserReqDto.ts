/**
 * 사용자-역할 관계 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface RoleUserReqDto {
  /** 권한코드 */
  roleCd: string;

  /** 사용자아이디 */
  userId: string;

  /** 사용여부 (Y,N) */
  useYn: string;
}
