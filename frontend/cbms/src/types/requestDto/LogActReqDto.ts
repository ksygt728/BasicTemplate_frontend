/**
 * 액션 로그 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface LogActReqDto {
  /** 로그아이디 */
  logId: string;

  /** 사용자 아이디 */
  userId?: string;

  /** 아이피주소 */
  ipAddr?: string;

  /** 페이지URL */
  pageUrl?: string;

  /** 액션타입 */
  actionType?: string;

  /** 액션 내용 */
  actionTypeDetail?: string;
}
