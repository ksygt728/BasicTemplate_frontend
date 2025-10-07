/**
 * API 로그 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface LogApiResDto {
  /** 로그아이디 */
  logId: string;

  /** 사용자 아이디 */
  userId: string;

  /** 시작시간 (yyyy-MM-dd HH:mm:ss.SSS) */
  startDate: string;

  /** 종료시간 (yyyy-MM-dd HH:mm:ss.SSS) */
  endDate: string;

  /** 아이피주소 */
  ipAddr: string;

  /** 브라우저 정보 */
  userAgent: string;

  /** 요청 URI */
  requestUri: string;

  /** 메소드 */
  httpMethod: string;

  /** 요청내용 */
  requestBody: string;

  /** 응답내용 */
  responseBody: string;

  /** STATUS_CODE */
  statusCode: string;

  /** 실행시간 */
  execTime: number;
}
