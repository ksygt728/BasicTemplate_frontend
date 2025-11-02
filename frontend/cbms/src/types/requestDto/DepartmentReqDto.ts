/**
 * 부서 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface DepartmentReqDto {
  /** 부서코드 */
  deptCode: string;

  /** 부서명 */
  deptNm: string;

  /** 상위부서코드 */
  upperDeptCode: string;

  /** 부서레벨 */
  deptLv: number;

  /** 회사코드 */
  companyCode: string;

  /** 사용여부 (Y,N) */
  useYn: string;
}
