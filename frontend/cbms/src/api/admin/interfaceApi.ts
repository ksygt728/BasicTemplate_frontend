import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { InterfaceReqDto } from "@/types/requestDto/InterfaceReqDto";
import { InterfaceResDto } from "@/types/responseDto/InterfaceResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";

/**
 * @파일명 : interfaceApi.ts
 * @설명 : 외부 시스템 인터페이스 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.10.07
 * @변경이력 :
 *       2025.10.07 김승연 최초 생성
 */
export class InterfaceApi {
  private static instance: InterfaceApi;

  private constructor() {}

  public static getInstance(): InterfaceApi {
    if (!InterfaceApi.instance) {
      InterfaceApi.instance = new InterfaceApi();
    }
    return InterfaceApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private ADMIN_INTERFACE_BASE_URL = `${this.API_BASE_URL}/admin/interface`;
  /**
   * @REQ_ID : REQ_ADM_021_0
   * @화면 : 기준 정보 > 인터페이스 관리
   * @기능 : 인터페이스 조회 폼 조회
   * @param interfaceReqDto 인터페이스 검색 조건 DTO
   * @param page 페이지 번호
   * @param size 페이지 크기
   * @param sort 정렬 필드
   * @param direction 정렬 방향
   * @return 인터페이스 리스트 조회 결과
   */
  public async findAllInterfaceWithConditionsForAdmin(
    interfaceReqDto: InterfaceReqDto,
    pageable: Pageable = { page: 0, size: 5, sort: "ifId", direction: "ASC" }
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: pageable.page.toString(),
      size: pageable.size.toString(),
      sort: pageable.sort || "ifId",
      direction: pageable.direction || "ASC",
      ...Object.fromEntries(
        Object.entries(interfaceReqDto).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      ),
    });

    const url = `${this.ADMIN_INTERFACE_BASE_URL}/search?${params}`;
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
   * @REQ_ID : REQ_ADM_021
   * @화면 : 기준 정보 > 인터페이스 관리
   * @기능 : 인터페이스 기준정보 리스트 조회
   * @param page 페이지 번호
   * @param size 페이지 크기
   * @param sort 정렬 필드
   * @param direction 정렬 방향
   * @return 인터페이스 기준정보 리스트 조회 결과
   */
  public async findAllInterfaceForAdmin(
    pageable: Pageable = { page: 0, size: 10, sort: "ifId", direction: "ASC" }
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: pageable.page.toString(),
      size: pageable.size.toString(),
      sort: pageable.sort || "ifId",
      direction: pageable.direction || "ASC",
    });

    const url = `${this.ADMIN_INTERFACE_BASE_URL}?${params}`;
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
   * @REQ_ID : REQ_ADM_021_2
   * @화면 : 기준 정보 > 인터페이스 관리
   * @기능 : 인터페이스 기준정보 조회
   * @param ifId 인터페이스 아이디
   * @return 인터페이스 기준정보 상세 조회 결과
   */
  public async findByInterfaceForAdmin(
    ifId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_INTERFACE_BASE_URL}/${ifId}`;
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
   * @REQ_ID : REQ_ADM_022
   * @화면 : 기준 정보 > 인터페이스 관리
   * @기능 : 인터페이스 직접 실행
   * @param ifc 인터페이스 정보 DTO
   * @return 인터페이스 실행 결과
   */
  public async executeInterfaceForAdmin(
    ifc: InterfaceReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_INTERFACE_BASE_URL}/execute/${ifc.ifId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ifc),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_023
   * @화면 : 기준 정보 > 인터페이스 관리
   * @기능 : 인터페이스 이력조회
   * @param ifId 인터페이스 아이디
   * @return 인터페이스 이력 조회 결과
   */
  public async findByInterfaceHistoryForAdmin(
    ifId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_INTERFACE_BASE_URL}/history/${ifId}`;
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
   * @REQ_ID : REQ_ADM_024
   * @화면 : 기준 정보 > 인터페이스 관리
   * @기능 : 인터페이스 추가
   * @param ifc 인터페이스 정보 DTO
   * @return 인터페이스 추가 결과
   */
  public async insertInterfaceForAdmin(
    ifc: InterfaceReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_INTERFACE_BASE_URL}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ifc),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_025
   * @화면 : 기준 정보 > 인터페이스 관리
   * @기능 : 인터페이스 수정
   * @param ifc 인터페이스 정보 DTO
   * @return 인터페이스 수정 결과
   */
  public async updateInterfaceForAdmin(
    ifc: InterfaceReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_INTERFACE_BASE_URL}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ifc),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_026
   * @화면 : 기준 정보 > 인터페이스 관리
   * @기능 : 인터페이스 삭제
   * @param ifId 인터페이스 아이디
   * @return 인터페이스 삭제 결과
   */
  public async deleteInterfaceForAdmin(
    ifId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_INTERFACE_BASE_URL}/${ifId}`;
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
}
