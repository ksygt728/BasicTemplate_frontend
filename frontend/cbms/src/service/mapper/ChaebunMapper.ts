/**
 * @파일명 : ChaebunMapper.ts
 * @설명 : 채번 관리 DTO 변환 로직
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

import { ChaebunReqDto } from "@/types/requestDto/ChaebunReqDto";

/**
 * @function toChaebunReqDto
 * @description 검색 폼 데이터를 채번 요청 DTO로 변환 (검색용 - 빈 값은 전송하지 않음)
 * @param {Record<string, any>} searchData - 검색 폼 데이터
 * @returns {ChaebunReqDto} 채번 요청 DTO
 */
export const toChaebunReqDto = (
  searchData: Record<string, any>
): ChaebunReqDto => {
  const dto: ChaebunReqDto = {};

  if (searchData.seqId) dto.seqId = searchData.seqId;
  if (searchData.seqName) dto.seqName = searchData.seqName;
  if (searchData.pattern) dto.pattern = searchData.pattern;
  if (searchData.prefix) dto.prefix = searchData.prefix;
  if (
    searchData.step !== undefined &&
    searchData.step !== null &&
    searchData.step !== ""
  ) {
    dto.step = searchData.step;
  }
  if (
    searchData.length !== undefined &&
    searchData.length !== null &&
    searchData.length !== ""
  ) {
    dto.length = searchData.length;
  }
  if (searchData.dateformat) dto.dateformat = searchData.dateformat;

  return dto;
};

/**
 * @function toChaebunFormData
 * @description 채번 응답 데이터를 폼 데이터로 변환 (등록/수정용 - 기본값 포함)
 * @param {any} chaebunData - 채번 응답 데이터
 * @returns {ChaebunReqDto} 채번 폼 데이터
 */
export const toChaebunFormData = (chaebunData: any): ChaebunReqDto => {
  return {
    seqId: chaebunData.seqId || "",
    seqName: chaebunData.seqName || "",
    pattern: chaebunData.pattern || "",
    prefix: chaebunData.prefix || "",
    step: chaebunData.step !== undefined ? chaebunData.step : 1,
    length: chaebunData.length !== undefined ? chaebunData.length : 1,
    dateformat: chaebunData.dateformat || "",
  };
};
