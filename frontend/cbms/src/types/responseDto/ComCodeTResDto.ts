import type { ComCodeDResDto } from "@/types/responseDto/ComCodeDResDto";

/**
 * 공통코드 속성 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ComCodeTResDto {
  /** 속성코드 */
  attrCd: string;

  /** 속성명 */
  attrNm: string;

  /** 정렬순서 */
  orderNum: number;

  /** 코드 상세 리스트 */
  comCodeDs: ComCodeDResDto[];
}
