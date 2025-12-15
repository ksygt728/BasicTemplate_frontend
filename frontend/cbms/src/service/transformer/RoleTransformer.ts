import { RoleResDto } from "@/types/responseDto/RoleResDto";
import { RoleMenuResDto } from "@/types/responseDto/RoleMenuResDto";
import { TreeNode } from "@/components/common/themed/TreeView";
import { TableColumn } from "@/components/common/themed/Table";

/**
 * @파일명 : RoleTransformer.ts
 * @설명 : 권한 관리 도메인의 데이터 변환 트랜스포머
 * @작성자 : 김승연
 * @작성일 : 2025.12.12
 * @변경이력 :
 *       2025.12.12 김승연 최초 생성
 */

// ============================================================================
// API 응답 → TreeView 노드 변환 (권한별 메뉴)
// ============================================================================

/**
 * @function transformRoleMenuToTreeNode
 * @description RoleMenuResDto를 TreeNode 형식으로 변환 (메뉴명, 코드, 레벨 표시)
 * @param {RoleMenuResDto} menu - 권한별 메뉴 응답 DTO
 * @returns {TreeNode} TreeView에서 사용할 노드 객체
 */
export const transformRoleMenuToTreeNode = (menu: RoleMenuResDto): TreeNode => {
  // UI/UX: 메뉴명 (코드) [Lv.레벨] 형식으로 표시 (권한은 제외)
  const label = `${menu.menuNm} (${menu.menuCd}) [Lv.${menu.menuLv}]`;

  return {
    id: menu.menuCd,
    label: label,
    children: menu.childMenus
      ? menu.childMenus.map(transformRoleMenuToTreeNode)
      : undefined,
    data: menu, // 원본 데이터 저장
  };
};

/**
 * @function transformRoleMenuListToTreeNodes
 * @description RoleMenuResDto 배열을 TreeNode 배열로 변환
 * @param {RoleMenuResDto[]} menuList - 권한별 메뉴 응답 DTO 배열
 * @returns {TreeNode[]} TreeView에서 사용할 노드 배열
 */
export const transformRoleMenuListToTreeNodes = (
  menuList: RoleMenuResDto[]
): TreeNode[] => {
  return menuList.map(transformRoleMenuToTreeNode);
};

// ============================================================================
// 메뉴 트리 플랫화 (Tree → Flat List)
// ============================================================================

/**
 * @function flattenRoleMenuTree
 * @description 계층 구조의 권한별 메뉴 트리를 평면 리스트로 변환
 * @param {RoleMenuResDto[]} menuTree - 권한별 메뉴 트리 구조
 * @returns {RoleMenuResDto[]} 평면화된 메뉴 리스트
 */
export const flattenRoleMenuTree = (
  menuTree: RoleMenuResDto[]
): RoleMenuResDto[] => {
  const result: RoleMenuResDto[] = [];

  const traverse = (menu: RoleMenuResDto) => {
    result.push(menu);
    if (menu.childMenus && menu.childMenus.length > 0) {
      menu.childMenus.forEach(traverse);
    }
  };

  menuTree.forEach(traverse);
  return result;
};

/**
 * @function findRoleMenuByCode
 * @description 메뉴 코드로 권한별 메뉴 정보를 찾기
 * @param {RoleMenuResDto[]} menuTree - 권한별 메뉴 트리 구조
 * @param {string} menuCd - 찾을 메뉴 코드
 * @returns {RoleMenuResDto | null} 찾은 메뉴 정보 또는 null
 */
export const findRoleMenuByCode = (
  menuTree: RoleMenuResDto[],
  menuCd: string
): RoleMenuResDto | null => {
  if (!menuCd) return null;
  const flatList = flattenRoleMenuTree(menuTree);
  return flatList.find((menu) => menu.menuCd === menuCd) || null;
};

// ============================================================================
// 권한 리스트 → 테이블 컬럼 변환
// ============================================================================

/**
 * @function transformRoleListToTableData
 * @description 권한 리스트를 테이블 데이터 형식으로 변환
 * @param {RoleResDto[]} roleList - 권한 리스트
 * @returns {Array<Record<string, any>>} 테이블 데이터 배열
 */
export const transformRoleListToTableData = (
  roleList: RoleResDto[]
): Array<Record<string, any>> => {
  return roleList.map((role, index) => ({
    key: role.roleCd,
    index: index + 1,
    roleCd: role.roleCd,
    roleName: role.roleName,
    roleDesc: role.roleDesc || "-",
  }));
};

/**
 * @function getRoleTableColumns
 * @description 권한 테이블 컬럼 정의
 * @returns {TableColumn[]} 테이블 컬럼 배열
 */
export const getRoleTableColumns = (): TableColumn[] => {
  return [
    {
      key: "index",
      title: "No",
      dataIndex: "index",
      width: 60,
      align: "center",
      sortable: true,
    },
    {
      key: "roleCd",
      title: "권한 코드",
      dataIndex: "roleCd",
      width: 150,
      align: "center",
      sortable: true,
      filterable: true,
    },
    {
      key: "roleName",
      title: "권한명",
      dataIndex: "roleName",
      width: 200,
      align: "left",
      sortable: true,
      filterable: true,
    },
    {
      key: "roleDesc",
      title: "권한 설명",
      dataIndex: "roleDesc",
      width: 300,
      align: "left",
      sortable: true,
      filterable: true,
    },
  ];
};

/**
 * @function extractAllMenuCodes
 * @description 권한별 메뉴 트리에서 모든 메뉴 코드를 추출
 * @param {RoleMenuResDto[]} menuTree - 권한별 메뉴 트리 구조
 * @returns {string[]} 메뉴 코드 배열
 */
export const extractAllMenuCodes = (menuTree: RoleMenuResDto[]): string[] => {
  const flatList = flattenRoleMenuTree(menuTree);
  return flatList.map((menu) => menu.menuCd);
};
