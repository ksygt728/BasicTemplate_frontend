import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { WebSvcReqDto } from "@/types/requestDto/WebSvcReqDto";
import { WebSvcResDto } from "@/types/responseDto/WebSvcResDto";

/**
 * @파일명 : webserviceApi.ts
 * @설명 : 웹서비스 연동 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.07.23
 * @변경이력 :
 *       2025.07.23 김승연 최초 생성
 */
export class WebserviceApi {
  private static instance: WebserviceApi;

  private constructor() {}

  public static getInstance(): WebserviceApi {
    if (!WebserviceApi.instance) {
      WebserviceApi.instance = new WebserviceApi();
    }
    return WebserviceApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  private ADMIN_WEBSERVICE_BASE_URL = `${this.API_BASE_URL}/admin/webservice`;

  /**
   * @REQ_ID : REQ_ADM_027
   * @화면 : 기준 정보 > 웹서비스 관리
   * @기능 : 웹서비스 기준정보 리스트 조회
   * @returns 웹서비스 기준정보 목록
   */
  public async findAllWebserviceForAdmin(): Promise<
    ResponseApi<Map<string, object>>
  > {
    const url = `${this.ADMIN_WEBSERVICE_BASE_URL}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_027_2
   * @화면 : 기준 정보 > 웹서비스 관리
   * @기능 : 웹서비스 기준정보 조회
   * @param svcId 웹서비스 아이디
   * @returns 웹서비스 기준정보 상세
   */
  public async findByWebserviceForAdmin(
    svcId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_WEBSERVICE_BASE_URL}/${svcId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_030
   * @화면 : 기준 정보 > 웹서비스 관리
   * @기능 : 웹서비스 추가
   * @param webSvc 웹서비스 추가 요청
   * @returns 웹서비스 추가 결과
   */
  public async insertWebserviceForAdmin(
    webSvc: WebSvcReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_WEBSERVICE_BASE_URL}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webSvc),
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_031
   * @화면 : 기준 정보 > 웹서비스 관리
   * @기능 : 웹서비스 수정
   * @param webSvc 웹서비스 수정 요청
   * @returns 웹서비스 수정 결과
   */
  public async updateWebserviceForAdmin(
    webSvc: WebSvcReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_WEBSERVICE_BASE_URL}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webSvc),
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_032
   * @화면 : 기준 정보 > 웹서비스 관리
   * @기능 : 웹서비스 삭제
   * @param svcId 웹서비스 아이디
   * @returns 웹서비스 삭제 결과
   */
  public async deleteWebserviceForAdmin(
    svcId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_WEBSERVICE_BASE_URL}/${svcId}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_028
   * @화면 : 기준 정보 > 웹서비스 관리
   * @기능 : 웹서비스 직접 실행
   * @param svcId 웹서비스 아이디
   * @returns 웹서비스 실행 결과
   */
  public async executeWebserviceForAdmin(
    svcId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_WEBSERVICE_BASE_URL}/execute/${svcId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_029
   * @화면 : 기준 정보 > 웹서비스 관리
   * @기능 : 웹서비스 이력조회
   * @param svcId 웹서비스 아이디
   * @returns 웹서비스 이력 목록
   */
  public async findByWebserviceHistoryForAdmin(
    svcId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_WEBSERVICE_BASE_URL}/history/${svcId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }
}
