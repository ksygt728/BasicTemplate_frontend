import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { MenuReqDto } from "@/types/requestDto/MenuReqDto";
import { MenuResDto } from "@/types/responseDto/MenuResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";

/**
 * @파일명 : menuApi.ts
 * @설명 : 메뉴 권한 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.10.07
 * @변경이력 :
 *       2025.10.07 김승연 최초 생성
 */
export class MenuApi {
  private static instance: MenuApi;

  private constructor() {}

  public static getInstance(): MenuApi {
    if (!MenuApi.instance) {
      MenuApi.instance = new MenuApi();
    }
    return MenuApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private ADMIN_MENU_BASE_URL = `${this.API_BASE_URL}/admin/menu`;
  /**
   * @REQ_ID : REQ_ADM_038
   * @화면 : 기준 정보 > 메뉴 관리
   * @기능 : 메뉴 리스트 조회
   * @param menuReqDto 메뉴 검색 조건 DTO
   * @param pageable 페이지네이션 정보
   * @return 메뉴 리스트 조회 결과
   */
  public async findAllMenuForAdmin(
    menuReqDto: MenuReqDto,
    pageable: Pageable = {
      page: 0,
      size: 2000,
      sort: "orderNum",
      direction: "ASC",
    }
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: pageable.page.toString(),
      size: pageable.size.toString(),
      sort: pageable.sort ?? "orderNum",
      direction: pageable.direction ?? "ASC",
      ...Object.fromEntries(
        Object.entries(menuReqDto).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      ),
    });

    const url = `${this.ADMIN_MENU_BASE_URL}/search?${params}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_038_2
   * @화면 : 기준 정보 > 메뉴 관리
   * @기능 : 메뉴 조회
   * @param menuCd 메뉴 코드
   * @return 메뉴 상세 조회 결과
   */
  public async findByMenuForAdmin(
    menuCd: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MENU_BASE_URL}/${menuCd}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_039
   * @화면 : 기준 정보 > 메뉴 관리
   * @기능 : 메뉴 추가
   * @param menuReqDto 메뉴 정보 DTO
   * @return 메뉴 추가 결과
   */
  public async insertMenuForAdmin(
    menuReqDto: MenuReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MENU_BASE_URL}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuReqDto),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_040
   * @화면 : 기준 정보 > 메뉴 관리
   * @기능 : 메뉴 수정
   * @param menuReqDto 메뉴 정보 DTO
   * @return 메뉴 수정 결과
   */
  public async updateMenuForAdmin(
    menuReqDto: MenuReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MENU_BASE_URL}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuReqDto),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_041
   * @화면 : 기준 정보 > 메뉴 관리
   * @기능 : 메뉴 삭제
   * @param menuCd 메뉴 코드
   * @return 메뉴 삭제 결과
   */
  public async deleteMenuForAdmin(
    menuCd: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MENU_BASE_URL}/${menuCd}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @기능 : 메뉴 트리 조회 (계층 구조)
   * @return 메뉴 트리 조회 결과
   */
  public async findMenuTreeForAdmin(): Promise<
    ResponseApi<Map<string, object>>
  > {
    const url = `${this.ADMIN_MENU_BASE_URL}/tree`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @기능 : 사용자별 권한 메뉴 조회
   * @param userId 사용자 아이디
   * @return 사용자별 권한 메뉴 조회 결과
   */
  public async findUserMenusForAdmin(
    userId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MENU_BASE_URL}/user/${userId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
