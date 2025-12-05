import { ComCodeMReqDto } from "@/types/requestDto/ComCodeMReqDto";
import { ComCodeTReqDto } from "@/types/requestDto/ComCodeTReqDto";
import { ComCodeDReqDto } from "@/types/requestDto/ComCodeDReqDto";
import { CodeSearchFormReqDto } from "@/types/requestDto/specialDto/CodeSearchFormReqDto";

/**
 * @파일명 : CodeMapper.ts
 * @설명 : 코드 관리 도메인의 DTO 변환 매퍼
 * @작성자 : 김승연
 * @작성일 : 2025.12.01
 * @변경이력 :
 *       2025.12.01 김승연 최초 생성
 */

// ============================================================================
// 검색 폼 → DTO 변환
// ============================================================================

/**
 * @function toCodeSearchFormReqDto
 * @description SearchForm 데이터를 CodeSearchFormReqDto로 변환
 * @param {Record<string, any>} searchData - 검색 폼 데이터
 * @returns {CodeSearchFormReqDto} 변환된 검색 DTO
 */
export const toCodeSearchFormReqDto = (
  searchData: Record<string, any>
): CodeSearchFormReqDto => {
  const searchForm: CodeSearchFormReqDto = {};

  // 그룹코드타입
  if (searchData.grpCdType && searchData.grpCdType.trim() !== "") {
    searchForm.grpCdType = searchData.grpCdType;
  }

  // 그룹코드
  if (searchData.grpCd && searchData.grpCd.trim() !== "") {
    searchForm.grpCd = searchData.grpCd;
  }

  // 그룹명
  if (searchData.grpNm && searchData.grpNm.trim() !== "") {
    searchForm.grpNm = searchData.grpNm;
  }

  // 사용여부
  if (searchData.useYn && searchData.useYn.trim() !== "") {
    searchForm.useYn = searchData.useYn;
  }

  // 날짜 범위 처리 (필요시 주석 해제)
  // if (searchData.regDate_start && searchData.regDate_end) {
  //   searchForm.startDate = searchData.regDate_start;
  //   searchForm.endDate = searchData.regDate_end;
  // }

  return searchForm;
};

// ============================================================================
// 그룹코드 테이블 Row → DTO 변환
// ============================================================================

/**
 * @function toComCodeMReqDto
 * @description 그룹코드 테이블 행 데이터를 ComCodeMReqDto로 변환
 * @param {any} rowData - 테이블 행 데이터
 * @returns {ComCodeMReqDto} 변환된 그룹코드 DTO
 */
export const toComCodeMReqDto = (rowData: any): ComCodeMReqDto => {
  return {
    grpCdType: rowData.grpCdType,
    grpCd: rowData.grpCd,
    grpNm: rowData.grpNm,
  };
};

// ============================================================================
// 속성코드 테이블 Row → DTO 변환
// ============================================================================

/**
 * @function toComCodeTReqDto
 * @description 속성코드 테이블 행 데이터를 ComCodeTReqDto로 변환
 * @param {any} rowData - 테이블 행 데이터
 * @param {string} grpCd - 현재 선택된 그룹코드
 * @returns {ComCodeTReqDto} 변환된 속성코드 DTO
 */
export const toComCodeTReqDto = (
  rowData: any,
  grpCd: string
): ComCodeTReqDto => {
  return {
    grpCd: grpCd,
    attrCd: rowData.attrCd,
    attrNm: rowData.attrNm || "",
    orderNum: rowData.orderNum || 1,
  };
};

// ============================================================================
// 상세코드 테이블 Row → DTO 변환
// ============================================================================

/**
 * @function toComCodeDReqDto
 * @description 상세코드 테이블 행 데이터를 ComCodeDReqDto로 변환
 * @param {any} rowData - 테이블 행 데이터
 * @param {string} grpCd - 현재 선택된 그룹코드
 * @param {string} attrCd - 속성코드
 * @param {string} dtlNm - 상세명
 * @returns {ComCodeDReqDto} 변환된 상세코드 DTO
 */
export const toComCodeDReqDto = (
  rowData: any,
  grpCd: string,
  attrCd: string,
  dtlNm: string
): ComCodeDReqDto => {
  return {
    grpCd: grpCd,
    attrCd: attrCd,
    dtlCd: rowData.dtlCd,
    dtlNm: dtlNm,
    useYn: rowData.useYn || "Y",
    orderNum: rowData.dtlOrderNum || 1,
  };
};

/**
 * @function collectValidAttributes
 * @description 테이블 행 데이터에서 값이 있는 속성들을 수집
 * @param {any} rowData - 테이블 행 데이터
 * @param {any[]} rightTopTableData - 속성코드 테이블 데이터
 * @returns {Array<{attrCd: string, dtlNm: string}>} 유효한 속성 배열
 */
export const collectValidAttributes = (
  rowData: any,
  rightTopTableData: any[]
): Array<{ attrCd: string; dtlNm: string }> => {
  const validAttributes: Array<{ attrCd: string; dtlNm: string }> = [];

  if (rightTopTableData.length > 0) {
    rightTopTableData.forEach((attr) => {
      if (rowData[attr.attrCd] && rowData[attr.attrCd].trim() !== "") {
        validAttributes.push({
          attrCd: attr.attrCd,
          dtlNm: rowData[attr.attrCd],
        });
      }
    });
  }

  // 값이 있는 속성이 없으면 빈값으로 처리
  if (validAttributes.length === 0) {
    if (rightTopTableData.length > 0) {
      rightTopTableData.forEach((attr) => {
        validAttributes.push({
          attrCd: attr.attrCd,
          dtlNm: "",
        });
      });
    } else {
      validAttributes.push({
        attrCd: "DEFAULT",
        dtlNm: "",
      });
    }
  }

  return validAttributes;
};

/**
 * @function extractAttrCdForDelete
 * @description 삭제할 상세코드의 속성코드를 원본 데이터에서 추출
 * @param {any} codeData - 전체 코드 데이터
 * @param {string} selectedGroupCd - 현재 선택된 그룹코드
 * @param {string} dtlCd - 삭제할 상세코드
 * @returns {string | null} 추출된 속성코드 또는 null
 * @throws {Error} 그룹 데이터나 속성 정보를 찾을 수 없을 때
 */
export const extractAttrCdForDelete = (
  codeData: any,
  selectedGroupCd: string,
  dtlCd: string
): string | null => {
  // 선택된 그룹 찾기
  const selectedGroup = codeData?.content?.find(
    (item: any) => item.grpCd === selectedGroupCd
  );

  if (!selectedGroup?.comCodeInfo) {
    throw new Error("그룹 데이터를 찾을 수 없습니다.");
  }

  // 해당 상세코드의 속성 정보 찾기
  const targetCodeInfo = selectedGroup.comCodeInfo.find(
    (codeInfo: any) => codeInfo.dtlCd === dtlCd
  );

  if (!targetCodeInfo?.codeAttributes?.length) {
    throw new Error("해당 상세 코드의 속성 정보를 찾을 수 없습니다.");
  }

  // 첫 번째 속성의 attrCd 추출
  const attrCd = targetCodeInfo.codeAttributes[0].attrCd;

  if (!attrCd) {
    throw new Error("속성 코드를 찾을 수 없습니다.");
  }

  return attrCd;
};
