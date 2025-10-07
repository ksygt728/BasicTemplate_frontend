/**
 * 사용자 역할 관리를 위한 요청 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface RoleReqDto {
  /** 권한코드 */
  roleCd: string;

  /** 권한명 */
  roleName: string;

  /** 권한설명 */
  roleDesc?: string;
}
