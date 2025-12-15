/**
 * @파일명 : code.types.ts
 * @설명 : 공통코드 관련 타입 정의
 * @작성자 : 김승연
 * @작성일 : 2025.12.09
 */

import type { ComCodeMResDto } from "./responseDto/ComCodeMResDto";
import type { ComCodeTResDto } from "./responseDto/ComCodeTResDto";
import type { ComCodeDResDto } from "./responseDto/ComCodeDResDto";

/**
 * Select 컴포넌트에서 사용할 옵션 타입
 */
export interface CodeOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * 공통코드 상세 정보 (속성값 포함)
 */
export interface CodeDetailWithAttributes extends ComCodeDResDto {
  [key: string]: any; // 동적 속성값 (attrCd를 키로 사용)
}

/**
 * 그룹코드별 상세코드 맵
 */
export interface CodesByGroup {
  [grpCd: string]: CodeDetailWithAttributes[];
}

/**
 * 공통코드 전체 구조
 */
export interface CommonCodeData {
  groups: ComCodeMResDto[]; // 그룹코드 리스트
  detailsByGroup: CodesByGroup; // 그룹별 상세코드
  attributesByGroup: { [grpCd: string]: ComCodeTResDto[] }; // 그룹별 속성코드
}

/**
 * Redux 상태 타입
 */
export interface CommonCodeState {
  data: CommonCodeData | null;
  isLoaded: boolean;
  lastUpdated: number | null;
  error: string | null;
}
