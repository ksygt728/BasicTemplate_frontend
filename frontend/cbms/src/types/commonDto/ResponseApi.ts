/**
 * REST API 공통 응답 래퍼 클래스
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ResponseApi<T = any> {
  /** 성공 여부 */
  success: boolean;

  /** 에러 코드 */
  errorCode: string | null;

  /** 메시지 */
  message: string;

  /** 응답 데이터 */
  data: T | null;
}
