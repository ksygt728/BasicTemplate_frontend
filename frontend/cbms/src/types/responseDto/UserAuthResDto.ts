/**
 * 사용자 인증 응답 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface UserAuthResDto {
  /** 사용자아이디 */
  userId: string;

  /** 리프레시토큰 */
  refreshToken: string;
}
