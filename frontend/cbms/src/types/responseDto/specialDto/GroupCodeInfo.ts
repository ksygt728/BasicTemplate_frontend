import type { ComCodeInfo } from "@/types/responseDto/specialDto/ComCodeInfo";

/**
 * 그룹코드 정보 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface GroupCodeInfo {
  /** 그룹코드유형 */
  grpCdType: string;

  /** 그룹코드 */
  grpCd: string;

  /** 그룹코드명 */
  grpNm: string;

  /** 각각 행 */
  comCodeInfo: ComCodeInfo[];
}
