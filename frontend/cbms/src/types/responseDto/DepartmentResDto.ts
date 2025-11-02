import type { CompanyResDto } from "@/types/responseDto/CompanyResDto";

/**
 * 부서 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface DepartmentResDto {
  /** 부서코드 */
  deptCode: string;

  /** 부서명 */
  deptNm: string;

  /** 상위부서코드 */
  upperDeptCode: string;

  /** 부서레벨 */
  deptLv: number;

  /** 회사 정보 */
  company: CompanyResDto;

  /** 사용여부 (Y,N) */
  useYn: string;
}
