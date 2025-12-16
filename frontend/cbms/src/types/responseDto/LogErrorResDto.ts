/**
 * 에러 로그 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface LogErrorResDto {
  /** 로그아이디 */
  errId: string;

  /** 사용자 아이디 */
  userId: string;

  /** 아이피주소 */
  ipAddr: string;

  /** 브라우저 정보 */
  userAgent: string;

  /** 요청 URI */
  requestUri: string;

  /** 메소드 */
  httpMethod: string;

  /** 에러내용 */
  errMsg: string;

  /** 에러내용상세 */
  errStack: string;

  createDate: string;
}
