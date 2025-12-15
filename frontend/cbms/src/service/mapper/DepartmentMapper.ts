import { DepartmentReqDto } from "@/types/requestDto/DepartmentReqDto";
import { DepartmentResDto } from "@/types/responseDto/DepartmentResDto";

/**
 * @파일명 : DepartmentMapper.ts
 * @설명 : 부서 관리 데이터 매핑 유틸리티
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

/**
 * @function toDepartmentSearchReqDto
 * @description 검색 폼 데이터를 부서 검색 요청 DTO로 변환
 * @param {Record<string, any>} searchData - 검색 폼 데이터
 * @returns {DepartmentReqDto} 부서 검색 요청 DTO
 */
export const toDepartmentSearchReqDto = (
  searchData: Record<string, any>
): DepartmentReqDto => {
  return {
    deptCode: searchData.deptCode,
    deptNm: searchData.deptNm,
    upperDeptCode: searchData.upperDeptCode,
    useYn: searchData.useYn,
  } as DepartmentReqDto;
};

/**
 * @function toDepartmentReqDto
 * @description 부서 응답 DTO를 요청 DTO로 변환
 * @param {DepartmentResDto} department - 부서 응답 DTO
 * @returns {DepartmentReqDto} 부서 요청 DTO
 */
export const toDepartmentReqDto = (
  department: DepartmentResDto
): DepartmentReqDto => {
  return {
    deptCode: department.deptCode,
    deptNm: department.deptNm,
    upperDeptCode: department.upperDeptCode,
    deptLv: department.deptLv,
    useYn: department.useYn,
  } as DepartmentReqDto;
};

/**
 * @function toDepartmentReqDtoFromForm
 * @description 폼 데이터를 부서 요청 DTO로 변환
 * @param {Record<string, any>} formData - 폼 데이터
 * @returns {DepartmentReqDto} 부서 요청 DTO
 */
export const toDepartmentReqDtoFromForm = (
  formData: Record<string, any>
): DepartmentReqDto => {
  return {
    deptCode: formData.deptCode,
    deptNm: formData.deptNm,
    upperDeptCode: formData.upperDeptCode,
    deptLv: formData.deptLv,
    useYn: formData.useYn,
  } as DepartmentReqDto;
};
