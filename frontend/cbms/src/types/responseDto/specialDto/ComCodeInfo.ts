import type { ComCodeAttributesAndValues } from "@/types/responseDto/specialDto/ComCodeAttributesAndValues";

/**
 * 공통코드 정보 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ComCodeInfo {
  /** 상세코드 */
  dtlCd: string;

  /** 속성 정보 */
  codeAttributes: ComCodeAttributesAndValues[];

  /** 사용여부 (Y,N) */
  useYn: string;

  /** 정렬순서 */
  dtlOrderNum: number;
}
