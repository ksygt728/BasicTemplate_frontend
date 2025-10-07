import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { MulLangResDto } from "@/types/responseDto/MulLangResDto";

/**
 * @파일명 : sharedApi.ts
 * @설명 : 시스템 공유 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.07.31
 * @변경이력 :
 *       2025.07.31 김승연 최초 생성
 */
export class SharedApi {
  private static instance: SharedApi;

  private constructor() {}

  public static getInstance(): SharedApi {
    if (!SharedApi.instance) {
      SharedApi.instance = new SharedApi();
    }
    return SharedApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  private API_SHARED_BASE_URL = `${this.API_BASE_URL}/api/shared`;

  /**
   * @REQ_ID : -
   * @화면 : -
   * @기능 : 다국어 목록 가져오기
   * @param localeText 언어 코드 (기본값: ko)
   * @returns 다국어 목록
   */
  public async getMulLangList(
    localeText: string = "ko"
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = new URL(`${this.API_SHARED_BASE_URL}/mulLang`);

    url.searchParams.append("localeText", localeText);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }
}
