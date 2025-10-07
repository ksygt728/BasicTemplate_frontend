/**
 * 로그인폼에 사용하는 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface AuthReqDto {
  /** 사용자 아이디 */
  userId: string;

  /** 비밀번호 */
  password: string;
}
