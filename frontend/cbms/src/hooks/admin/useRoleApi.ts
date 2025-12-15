/**
 * @파일명 : useRoleApi.ts
 * @설명 : 권한 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.12
 * @변경이력 :
 *       2025.12.12 김승연 최초 생성
 */

import { useState, useCallback } from "react";
import { RoleApi } from "@/api/admin/roleApi";
import { RoleReqDto } from "@/types/requestDto/RoleReqDto";
import { RoleResDto } from "@/types/responseDto/RoleResDto";
import { RoleMenuReqDto } from "@/types/requestDto/RoleMenuReqDto";
import { RoleMenuResDto } from "@/types/responseDto/RoleMenuResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { useCommonApi } from "@/hooks/common/useCommonApiFormat";

/**
 * 권한 관리 API 호출을 위한 커스텀 훅
 * @returns {Object} 권한 관리에 필요한 상태와 함수들을 반환
 * @returns {RoleResDto[]} roleList - 권한 리스트 데이터
 * @returns {RoleResDto | null} selectedRole - 선택된 권한 상세 정보
 * @returns {RoleMenuResDto[]} roleMenuTree - 권한별 메뉴 트리 구조 데이터
 * @returns {boolean} loading - 로딩 상태
 * @returns {string | null} error - 에러 메시지
 * @returns {Function} fetchRoleList - 권한 리스트 조회 함수
 * @returns {Function} fetchRoleDetail - 권한 상세 조회 함수
 * @returns {Function} fetchRoleMenuTree - 권한별 메뉴 트리 조회 함수
 * @returns {Function} insertRole - 권한 추가 함수
 * @returns {Function} updateRole - 권한 수정 함수
 * @returns {Function} deleteRole - 권한 삭제 함수
 * @returns {Function} updateRoleMenu - 권한별 메뉴 리스트 수정 함수
 * @returns {Function} setSelectedRole - 선택된 권한 설정 함수
 * @returns {Function} refetch - 데이터 새로고침 함수
 */
export const useRoleApi = () => {
  const [roleList, setRoleList] = useState<RoleResDto[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleResDto | null>(null);
  const [roleMenuTree, setRoleMenuTree] = useState<RoleMenuResDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleApiCall } = useCommonApi();

  /**
   * @기능 권한 리스트 조회
   * @param roleReqDto 권한 검색 조건 DTO
   * @param pageable 페이지네이션 정보
   * @returns Promise<void>
   */
  const fetchRoleList = useCallback(
    async (
      roleReqDto: RoleReqDto = {
        roleCd: "",
        roleName: "",
        roleDesc: "",
      },
      pageable?: Pageable
    ): Promise<void> => {
      const result = await handleApiCall(
        async () => {
          const roleApi = RoleApi.getInstance();
          return await roleApi.findAllRoleForAdmin(roleReqDto, pageable);
        },
        (response) => {
          const responseData = response as any;

          // Spring Boot Page 객체 구조 처리: data.data.content
          if (
            responseData.data?.data?.content &&
            Array.isArray(responseData.data.data.content)
          ) {
            setRoleList(responseData.data.data.content);
          } else if (
            responseData.data?.data &&
            Array.isArray(responseData.data.data)
          ) {
            setRoleList(responseData.data.data);
          } else if (
            responseData.data?.content &&
            Array.isArray(responseData.data.content)
          ) {
            setRoleList(responseData.data.content);
          } else if (responseData.data && Array.isArray(responseData.data)) {
            setRoleList(responseData.data);
          } else {
            setRoleList([]);
          }
        }
      );

      if (!result) {
        setRoleList([]);
      }
    },
    [handleApiCall]
  );

  /**
   * @기능 권한 상세 조회
   * @param roleCd 권한 코드
   * @returns Promise<void>
   */
  const fetchRoleDetail = useCallback(
    async (roleCd: string): Promise<void> => {
      const result = await handleApiCall(
        async () => {
          const roleApi = RoleApi.getInstance();
          return await roleApi.findByRoleForAdmin(roleCd);
        },
        (response) => {
          const responseData = response as any;
          if (responseData.data) {
            setSelectedRole(responseData.data);
          }
        }
      );

      if (!result) {
        setSelectedRole(null);
      }
    },
    [handleApiCall]
  );

  /**
   * @기능 권한별 메뉴 트리 조회
   * @param roleCd 권한 코드
   * @returns Promise<void>
   */
  const fetchRoleMenuTree = useCallback(
    async (roleCd: string): Promise<void> => {
      const result = await handleApiCall(
        async () => {
          const roleApi = RoleApi.getInstance();
          return await roleApi.findByRoleMenuForAdmin(roleCd);
        },
        (response) => {
          const responseData = response as any;

          if (
            responseData.data &&
            responseData.data.data &&
            Array.isArray(responseData.data.data)
          ) {
            setRoleMenuTree(responseData.data.data);
          } else if (responseData.data && Array.isArray(responseData.data)) {
            setRoleMenuTree(responseData.data);
          } else {
            setRoleMenuTree([]);
          }
        }
      );

      if (!result) {
        setRoleMenuTree([]);
      }
    },
    [handleApiCall]
  );

  /**
   * @기능 권한 추가
   * @param roleReqDto 권한 추가 DTO
   * @returns Promise<boolean> 성공 여부
   */
  const insertRole = useCallback(
    async (roleReqDto: RoleReqDto): Promise<boolean> => {
      const result = await handleApiCall(async () => {
        const roleApi = RoleApi.getInstance();
        return await roleApi.insertRoleForAdmin(roleReqDto);
      });

      if (result) {
        await fetchRoleList();
        return true;
      }

      return false;
    },
    [handleApiCall, fetchRoleList]
  );

  /**
   * @기능 권한 수정
   * @param roleReqDto 권한 수정 DTO
   * @returns Promise<boolean> 성공 여부
   */
  const updateRole = useCallback(
    async (roleReqDto: RoleReqDto): Promise<boolean> => {
      const result = await handleApiCall(async () => {
        const roleApi = RoleApi.getInstance();
        return await roleApi.updateRoleForAdmin(roleReqDto);
      });

      if (result) {
        await fetchRoleList();
        return true;
      }

      return false;
    },
    [handleApiCall, fetchRoleList]
  );

  /**
   * @기능 권한 삭제
   * @param roleCd 권한 코드
   * @returns Promise<boolean> 성공 여부
   */
  const deleteRole = useCallback(
    async (roleCd: string): Promise<boolean> => {
      const result = await handleApiCall(async () => {
        const roleApi = RoleApi.getInstance();
        return await roleApi.deleteRoleForAdmin(roleCd);
      });

      if (result) {
        await fetchRoleList();
        setSelectedRole(null);
        setRoleMenuTree([]);
        return true;
      }

      return false;
    },
    [handleApiCall, fetchRoleList]
  );

  /**
   * @기능 권한별 메뉴 리스트 수정
   * @param roleMenus 권한별 메뉴 리스트 DTO 배열
   * @returns Promise<boolean> 성공 여부
   */
  const updateRoleMenu = useCallback(
    async (roleMenus: RoleMenuReqDto[]): Promise<boolean> => {
      const result = await handleApiCall(async () => {
        const roleApi = RoleApi.getInstance();
        return await roleApi.updateRoleMenuForAdmin(roleMenus);
      });

      if (result && selectedRole) {
        await fetchRoleMenuTree(selectedRole.roleCd);
        return true;
      }

      return false;
    },
    [handleApiCall, fetchRoleMenuTree, selectedRole]
  );

  /**
   * @기능 데이터 새로고침
   * @returns Promise<void>
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetchRoleList();
    if (selectedRole) {
      await fetchRoleDetail(selectedRole.roleCd);
      await fetchRoleMenuTree(selectedRole.roleCd);
    }
  }, [fetchRoleList, fetchRoleDetail, fetchRoleMenuTree, selectedRole]);

  return {
    roleList,
    selectedRole,
    roleMenuTree,
    loading,
    error,
    fetchRoleList,
    fetchRoleDetail,
    fetchRoleMenuTree,
    insertRole,
    updateRole,
    deleteRole,
    updateRoleMenu,
    setSelectedRole,
    refetch,
  };
};
