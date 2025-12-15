/**
 * 역할-메뉴 관계 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface RoleMenuResDto {
  /** 메뉴코드 */
  menuCd: string;

  /** 메뉴명 */
  menuNm: string;

  /** 상위메뉴코드 */
  upperMenu: string;

  /** 메뉴레벨 */
  menuLv: number;

  /** 사용여부 (Y,N) */
  useYn: string;

  /** 메뉴 URL */
  menuUrl: string;

  /** 정렬순서 */
  orderNum: number;

  /** 메뉴 접근 수준 (C,R,U,D) */
  menuRw: string;

  /** 메뉴 하위 목록 */
  childMenus: RoleMenuResDto[];
}
