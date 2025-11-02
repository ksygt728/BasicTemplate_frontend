import type { ComCodeInfo } from "@/types/responseDto/specialDto/ComCodeInfo";

/**
 * 공통 코드 검색 결과 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface CodeSearchFormResDtoFormat {
  /** 그룹코드유형 */
  grpCdType: string;

  /** 그룹코드 */
  grpCd: string;

  /** 그룹코드명 */
  grpNm: string;

  /** 공통코드 정보 */
  comCodeInfo: ComCodeInfo;
}
