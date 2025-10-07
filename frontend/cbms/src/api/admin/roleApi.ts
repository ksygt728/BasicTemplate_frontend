import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { RoleReqDto } from "@/types/requestDto/RoleReqDto";
import { RoleResDto } from "@/types/responseDto/RoleResDto";
import { RoleMenuReqDto } from "@/types/requestDto/RoleMenuReqDto";
import { RoleMenuResDto } from "@/types/responseDto/RoleMenuResDto";
import { RoleUserReqDto } from "@/types/requestDto/RoleUserReqDto";
import { RoleUserResDto } from "@/types/responseDto/RoleUserResDto";

/**
 * @파일명 : roleApi.ts
 * @설명 : 사용자 권한 및 역할 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.07.23
 * @변경이력 :
 *       2025.07.23 김승연 최초 생성
 */
export class RoleApi {
  private static instance: RoleApi;

  private constructor() {}

  public static getInstance(): RoleApi {
    if (!RoleApi.instance) {
      RoleApi.instance = new RoleApi();
    }
    return RoleApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  private ADMIN_ROLE_BASE_URL = `${this.API_BASE_URL}/admin/role`;

  /**
   * @REQ_ID : REQ_ADM_042
   * @화면 : 권한 관리 > 권한 관리(Role)
   * @기능 : 권한 리스트 조회
   * @param roleReqDto 권한 검색 조건 DTO
   * @param page 페이지 번호 (기본값: 0)
   * @param size 페이지 크기 (기본값: 2000)
   * @param sort 정렬 기준 (기본값: roleCd)
   * @returns 권한 리스트 조회 결과
   */
  public async findAllRoleForAdmin(
    roleReqDto?: RoleReqDto,
    page: number = 0,
    size: number = 2000,
    sort: string = "roleCd"
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = new URL(`${this.ADMIN_ROLE_BASE_URL}/search`);

    if (roleReqDto) {
      Object.keys(roleReqDto).forEach((key) => {
        const value = (roleReqDto as any)[key];
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    url.searchParams.append("page", page.toString());
    url.searchParams.append("size", size.toString());
    url.searchParams.append("sort", sort);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_042_2
   * @화면 : 권한 관리 > 권한 관리(Role)
   * @기능 : 권한 조회
   * @param roleCd 권한 코드
   * @returns 권한 상세 조회 결과
   */
  public async findByRoleForAdmin(
    roleCd: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_ROLE_BASE_URL}/${roleCd}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_045
   * @화면 : 권한 관리 > 권한 관리(Role)
   * @기능 : 권한 추가
   * @param roleReqDto 권한 정보 DTO
   * @returns 권한 추가 결과
   */
  public async insertRoleForAdmin(
    roleReqDto: RoleReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_ROLE_BASE_URL}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleReqDto),
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_046
   * @화면 : 권한 관리 > 권한 관리(Role)
   * @기능 : 권한 수정
   * @param roleReqDto 권한 정보 DTO
   * @returns 권한 수정 결과
   */
  public async updateRoleForAdmin(
    roleReqDto: RoleReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_ROLE_BASE_URL}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roleReqDto),
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_047
   * @화면 : 권한 관리 > 권한 관리(Role)
   * @기능 : 권한 삭제
   * @param roleCd 권한 코드
   * @returns 권한 삭제 결과
   */
  public async deleteRoleForAdmin(
    roleCd: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_ROLE_BASE_URL}/${roleCd}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_043
   * @화면 : 권한 관리 > 권한 관리(Role)
   * @기능 : 권한별 메뉴 리스트 조회
   * @param roleCd 권한 코드
   * @returns 권한별 메뉴 리스트 조회 결과
   */
  public async findByRoleMenuForAdmin(
    roleCd: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_ROLE_BASE_URL}/role-menu/${roleCd}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_044
   * @화면 : 권한 관리 > 권한 관리(Role)
   * @기능 : 권한별 메뉴 리스트 수정
   * @param roleMenus 권한별 메뉴 리스트 DTO
   * @returns 권한별 메뉴 리스트 수정 결과
   */
  public async updateRoleMenuForAdmin(
    roleMenus: RoleMenuReqDto[]
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_ROLE_BASE_URL}/role-menu`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roleMenus }),
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_048
   * @화면 : 권한 관리 > 권한 관리(Role)
   * @기능 : 권한별 사용자 리스트 조회
   * @param roleCd 권한 코드
   * @returns 권한별 사용자 리스트 조회 결과
   */
  public async findByRoleUserForAdmin(
    roleCd: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_ROLE_BASE_URL}/role-user/${roleCd}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_049
   * @화면 : 권한 관리 > 권한 관리(Role)
   * @기능 : 권한별 사용자 리스트 수정
   * @param roleUsers 권한별 사용자 리스트 DTO
   * @returns 권한별 사용자 리스트 수정 결과
   */
  public async updateRoleUserForAdmin(
    roleUsers: RoleUserReqDto[]
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_ROLE_BASE_URL}/role-user`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roleUsers }),
    });

    return await response.json();
  }
}
