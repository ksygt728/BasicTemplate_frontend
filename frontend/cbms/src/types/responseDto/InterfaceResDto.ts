/**
 * 인터페이스 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface InterfaceResDto {
  /** 인터페이스 아이디 */
  ifId: string;

  /** 인터페이스명 */
  ifName: string;

  /** WSDL */
  text: string;
}
