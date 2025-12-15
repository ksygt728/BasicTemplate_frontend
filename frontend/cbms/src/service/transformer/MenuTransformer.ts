import { MenuResDto } from "@/types/responseDto/MenuResDto";
import { TreeNode } from "@/components/common/themed/TreeView";

/**
 * @파일명 : MenuTransformer.ts
 * @설명 : 메뉴 관리 도메인의 데이터 변환 트랜스포머
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

// ============================================================================
// API 응답 → TreeView 노드 변환
// ============================================================================

/**
 * @function transformMenuToTreeNode
 * @description MenuResDto를 TreeNode 형식으로 변환 (메뉴명, 코드, 레벨 표시)
 * @param {MenuResDto} menu - 메뉴 응답 DTO
 * @returns {TreeNode} TreeView에서 사용할 노드 객체
 */
export const transformMenuToTreeNode = (menu: MenuResDto): TreeNode => {
  // UI/UX: 메뉴명 (코드) [Lv.레벨] 형식으로 표시
  const label = `${menu.menuNm} (${menu.menuCd}) [Lv.${menu.menuLv}]`;

  return {
    id: menu.menuCd,
    label: label,
    children: menu.childMenus
      ? menu.childMenus.map(transformMenuToTreeNode)
      : undefined,
    data: menu, // 원본 데이터 저장
  };
};

/**
 * @function transformMenuListToTreeNodes
 * @description MenuResDto 배열을 TreeNode 배열로 변환
 * @param {MenuResDto[]} menuList - 메뉴 응답 DTO 배열
 * @returns {TreeNode[]} TreeView에서 사용할 노드 배열
 */
export const transformMenuListToTreeNodes = (
  menuList: MenuResDto[]
): TreeNode[] => {
  return menuList.map(transformMenuToTreeNode);
};

// ============================================================================
// 메뉴 트리 플랫화 (Tree → Flat List)
// ============================================================================

/**
 * @function flattenMenuTree
 * @description 계층 구조의 메뉴 트리를 평면 리스트로 변환
 * @param {MenuResDto[]} menuTree - 메뉴 트리 구조
 * @returns {MenuResDto[]} 평면화된 메뉴 리스트
 */
export const flattenMenuTree = (menuTree: MenuResDto[]): MenuResDto[] => {
  const result: MenuResDto[] = [];

  const traverse = (menu: MenuResDto) => {
    result.push(menu);
    if (menu.childMenus && menu.childMenus.length > 0) {
      menu.childMenus.forEach(traverse);
    }
  };

  menuTree.forEach(traverse);
  return result;
};

// ============================================================================
// 메뉴 코드 목록 추출
// ============================================================================

/**
 * @function extractMenuCodes
 * @description 메뉴 트리에서 모든 메뉴 코드를 추출
 * @param {MenuResDto[]} menuTree - 메뉴 트리 구조
 * @returns {string[]} 메뉴 코드 배열
 */
export const extractMenuCodes = (menuTree: MenuResDto[]): string[] => {
  const flatList = flattenMenuTree(menuTree);
  return flatList.map((menu) => menu.menuCd);
};

/**
 * @function findMenuByCode
 * @description 메뉴 코드로 메뉴 정보를 찾기
 * @param {MenuResDto[]} menuTree - 메뉴 트리 구조
 * @param {string} menuCd - 찾을 메뉴 코드
 * @returns {MenuResDto | null} 찾은 메뉴 정보 또는 null
 */
export const findMenuByCode = (
  menuTree: MenuResDto[],
  menuCd: string
): MenuResDto | null => {
  if (!menuCd) return null;
  const flatList = flattenMenuTree(menuTree);
  return flatList.find((menu) => menu.menuCd === menuCd) || null;
};

// ============================================================================
// 상위 메뉴 옵션 생성
// ============================================================================

/**
 * @function createUpperMenuOptions
 * @description 상위 메뉴 선택을 위한 옵션 배열 생성
 * @param {MenuResDto[]} menuTree - 메뉴 트리 구조
 * @param {number} maxLevel - 표시할 최대 레벨 (기본값: 2, 3레벨까지만 선택 가능)
 * @returns {Array<{value: string, label: string}>} 옵션 배열
 */
export const createUpperMenuOptions = (
  menuTree: MenuResDto[],
  maxLevel: number = 2
): Array<{ value: string; label: string }> => {
  const flatList = flattenMenuTree(menuTree);

  // 최대 레벨 미만의 메뉴만 상위 메뉴로 선택 가능
  const filteredList = flatList.filter((menu) => menu.menuLv < maxLevel);

  return [
    { value: "", label: "최상위 메뉴" },
    ...filteredList.map((menu) => ({
      value: menu.menuCd,
      label: `${"　".repeat(menu.menuLv)}${menu.menuNm} (Lv${menu.menuLv})`,
    })),
  ];
};
