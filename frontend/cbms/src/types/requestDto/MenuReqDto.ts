/**
 * 메뉴 관리를 위한 요청 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface MenuReqDto {
  /** 메뉴코드 */
  menuCd?: string;

  /** 메뉴명 */
  menuNm: string;

  /** 상위메뉴코드 */
  upperMenu: string;

  /** 메뉴레벨 */
  menuLv: number;

  /** 사용여부 (Y,N) */
  useYn: string;

  /** 메뉴 URL */
  menuUrl?: string;

  /** 정렬순서 */
  orderNum: number;
}
