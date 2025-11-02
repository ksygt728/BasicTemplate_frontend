/**
 * 사용자 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface UserResDto {
  /** 사용자 아이디 */
  userId: string;

  /** 사용자명 */
  name: string;

  /** 전화번호 */
  phoneNum: string;

  /** 이메일 */
  email: string;

  /** 역할 */
  role: string;

  /** 사용자 타입 */
  userType: string;

  /** 성별 */
  gender: string;
}
