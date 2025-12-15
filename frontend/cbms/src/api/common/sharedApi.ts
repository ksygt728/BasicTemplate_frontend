import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { MulLangResDto } from "@/types/responseDto/MulLangResDto";
import { MenuReqDto } from "@/types/requestDto/MenuReqDto";
import { CodeSearchFormReqDto } from "@/types/requestDto/specialDto/CodeSearchFormReqDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { authGet } from "@/utils/authFetch";

/**
 * @파일명 : sharedApi.ts
 * @설명 : 시스템 공유 기능 제공 API (인증 불필요)
 * @작성자 : 김승연
 * @작성일 : 2025.07.31
 * @변경이력 :
 *       2025.07.31 김승연 최초 생성
 *       2025.12.11 김승연 메뉴/코드 공통 API 추가
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
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private API_SHARED_BASE_URL = `${this.API_BASE_URL}/api/v1/shared`;

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

  /**
   * @REQ_ID : -
   * @화면 : All
   * @기능 : 공통으로 사용하는 메뉴 리스트 조회 (인증 불필요)
   * @param menuReqDto 메뉴 검색 조건 DTO
   * @param pageable 페이징 정보
   * @returns 메뉴 리스트 조회 결과
   */
  public async findAllMenuForShared(
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

    const url = `${this.API_SHARED_BASE_URL}/menu/search?${params}`;
    return authGet(url, { skipAuth: true }).then((res) => res.json());
  }

  /**
   * @REQ_ID : -
   * @화면 : All
   * @기능 : 다양한 화면에서 공통으로 사용할 코드 검색 (인증 불필요)
   * @param reqDto 코드 검색 조건 DTO
   * @param pageable 페이징 정보
   * @returns 공통코드 검색 결과
   */
  public async findAllCodeForShared(
    reqDto: CodeSearchFormReqDto,
    pageable: Pageable = {
      page: 0,
      size: 2000,
      sort: "grpCd",
      direction: "ASC",
    }
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: pageable.page.toString(),
      size: pageable.size.toString(),
      sort: pageable.sort ?? "grpCd",
      direction: pageable.direction ?? "ASC",
      ...Object.fromEntries(
        Object.entries(reqDto).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      ),
    });

    const url = `${this.API_SHARED_BASE_URL}/code/search?${params}`;
    return authGet(url, { skipAuth: true }).then((res) => res.json());
  }
}
