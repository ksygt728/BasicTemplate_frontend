import type { ComCodeTResDto } from "@/types/responseDto/ComCodeTResDto";

/**
 * 공통 코드 마스터 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ComCodeMResDto {
  /** 그룹코드 */
  grpCd: string;

  /** 그룹코드유형 */
  grpCdType: string;

  /** 그룹코드명 */
  grpNm: string;

  /** 그룹코드에 포함된 그룹코드속성 리스트 */
  comCodeTs: ComCodeTResDto[];
}
