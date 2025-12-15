import { DepartmentResDto } from "@/types/responseDto/DepartmentResDto";
import { TreeNode } from "@/components/common/themed/TreeView";

/**
 * @파일명 : DepartmentTransformer.ts
 * @설명 : 부서 관리 데이터 변환 유틸리티
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

/**
 * @function transformDepartmentToTreeNodes
 * @description 부서 목록을 TreeView용 TreeNode 배열로 변환 (계층 구조)
 * @param {DepartmentResDto[]} departments - 부서 목록
 * @returns {TreeNode[]} TreeView용 노드 배열
 */
export const transformDepartmentToTreeNodes = (
  departments: DepartmentResDto[]
): TreeNode[] => {
  if (!departments || departments.length === 0) {
    return [];
  }

  // 부서 코드를 키로 하는 맵 생성
  const departmentMap = new Map<string, DepartmentResDto>();
  departments.forEach((dept) => {
    departmentMap.set(dept.deptCode, dept);
  });

  // 루트 부서들 (상위 부서가 없거나 상위 부서가 목록에 없는 경우)
  const rootDepartments: DepartmentResDto[] = [];

  // 각 부서의 자식 부서들을 저장할 맵
  const childrenMap = new Map<string, DepartmentResDto[]>();

  // 부서들을 순회하며 관계 정리
  departments.forEach((dept) => {
    if (!dept.upperDeptCode || !departmentMap.has(dept.upperDeptCode)) {
      // 루트 부서
      rootDepartments.push(dept);
    } else {
      // 자식 부서
      const children = childrenMap.get(dept.upperDeptCode) || [];
      children.push(dept);
      childrenMap.set(dept.upperDeptCode, children);
    }
  });

  // 재귀적으로 TreeNode 생성
  const buildTreeNode = (dept: DepartmentResDto): TreeNode => {
    const children = childrenMap.get(dept.deptCode) || [];

    return {
      id: dept.deptCode,
      label: dept.deptNm,
      data: dept,
      children:
        children.length > 0
          ? children
              .sort((a, b) => a.deptCode.localeCompare(b.deptCode))
              .map(buildTreeNode)
          : undefined,
    };
  };

  // 루트 부서들을 TreeNode로 변환하여 반환
  return rootDepartments
    .sort((a, b) => a.deptCode.localeCompare(b.deptCode))
    .map(buildTreeNode);
};

/**
 * @function transformDepartmentDetailData
 * @description 부서 응답 DTO를 상세 폼 데이터로 변환
 * @param {DepartmentResDto | null} department - 부서 응답 DTO
 * @returns {Record<string, any>} 폼 데이터
 */
export const transformDepartmentDetailData = (
  department: DepartmentResDto | null
): Record<string, any> => {
  if (!department) {
    return {};
  }

  return {
    deptCode: department.deptCode,
    deptNm: department.deptNm,
    upperDeptCode: department.upperDeptCode,
    deptLv: department.deptLv,
    useYn: department.useYn,
    companyCode: department.company?.companyCode || "",
    companyName: department.company?.companyName || "",
  };
};
