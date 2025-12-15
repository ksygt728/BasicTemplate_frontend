/**
 * 역할별 메뉴 권한 관리를 위한 요청 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface RoleMenuReqDto {
  /** 권한코드 */
  roleCd: string;

  /** 메뉴코드 */
  menuCd: string;

  /** 메뉴 접근 수준 (C,R,U,D) */
  menuRw: string;

  /** 사용여부 (Y,N) */
  useYn: string;
}
