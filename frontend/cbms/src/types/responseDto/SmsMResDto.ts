/**
 * SMS 마스터 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface SmsMResDto {
  /** SMS 아이디 */
  smsId: string;

  /** 언어타입 */
  langType: string;

  /** 템플릿명 */
  smsName: string;

  /** SMS내용 */
  text: string;

  /** 설명 */
  description: string;
}
