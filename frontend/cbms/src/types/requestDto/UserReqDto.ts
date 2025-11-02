/**
 * 사용자 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface UserReqDto {
  /** 사용자 아이디 */
  userId: string;

  /** 비밀번호 */
  password?: string;

  /** 이름 */
  name: string;

  /** 전화번호 */
  phoneNum: string;

  /** 이메일 */
  email: string;

  /** 사용자타입 */
  userType: string;

  /** 성별 (M, F) */
  gender: string;

  /** 부서코드 */
  deptCode?: string;
}
