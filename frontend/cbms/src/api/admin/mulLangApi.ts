import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { MulLangReqDto } from "@/types/requestDto/MulLangReqDto";
import { MulLangResDto } from "@/types/responseDto/MulLangResDto";

/**
 * @파일명 : mulLangApi.ts
 * @설명 : 다국어 메시지 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.10.07
 * @변경이력 :
 *       2025.10.07 김승연 최초 생성
 */
export class MulLangApi {
  private static instance: MulLangApi;

  private constructor() {}

  public static getInstance(): MulLangApi {
    if (!MulLangApi.instance) {
      MulLangApi.instance = new MulLangApi();
    }
    return MulLangApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  private ADMIN_MUL_LANG_BASE_URL = `${this.API_BASE_URL}/admin/lang`;
  /**
   * @REQ_ID : REQ_ADM_033
   * @화면 : 기준 정보 > 다국어 관리
   * @기능 : 다국어 리스트 조회
   * @param mulLangReqDto 다국어 검색 조건 DTO
   * @param page 페이지 번호
   * @param size 페이지 크기
   * @param sort 정렬 필드
   * @param direction 정렬 방향
   * @return 다국어 리스트 조회 결과
   */
  public async findAllMulLangForAdmin(
    mulLangReqDto: MulLangReqDto,
    page: number = 0,
    size: number = 2000,
    sort: string = "langCd",
    direction: "ASC" | "DESC" = "ASC"
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: sort,
      direction: direction,
      ...Object.fromEntries(
        Object.entries(mulLangReqDto).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      ),
    });

    const url = `${this.ADMIN_MUL_LANG_BASE_URL}/search?${params}`;
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
   * @REQ_ID : REQ_ADM_034
   * @화면 : 기준 정보 > 다국어 관리
   * @기능 : 다국어 리스트 언어별 조회
   * @param langGubun 언어 구분
   * @param langCd 언어 코드
   * @return 다국어 리스트 언어별 조회 결과
   */
  public async findByMulLangForAdmin(
    langGubun: string,
    langCd: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MUL_LANG_BASE_URL}/${langGubun}/${langCd}`;
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
   * @REQ_ID : REQ_ADM_035
   * @화면 : 기준 정보 > 다국어 관리
   * @기능 : 다국어 추가
   * @param mulLang 다국어 정보 DTO
   * @return 다국어 추가 결과
   */
  public async insertMulLangForAdmin(
    mulLang: MulLangReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MUL_LANG_BASE_URL}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mulLang),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_036
   * @화면 : 기준 정보 > 다국어 관리
   * @기능 : 다국어 수정
   * @param mulLang 다국어 정보 DTO
   * @return 다국어 수정 결과
   */
  public async updateMulLangForAdmin(
    mulLang: MulLangReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MUL_LANG_BASE_URL}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mulLang),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_037
   * @화면 : 기준 정보 > 다국어 관리
   * @기능 : 다국어 삭제
   * @param langGubun 언어 구분
   * @param langCd 언어 코드
   * @return 다국어 삭제 결과
   */
  public async deleteMulLangForAdmin(
    langGubun: string,
    langCd: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MUL_LANG_BASE_URL}/${langGubun}/${langCd}`;
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
   * @기능 : 언어별 전체 메시지 조회
   * @param langGubun 언어 구분
   * @return 언어별 전체 메시지 조회 결과
   */
  public async findAllMessagesByLang(
    langGubun: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MUL_LANG_BASE_URL}/messages/${langGubun}`;
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
   * @기능 : 지원 언어 목록 조회
   * @return 지원 언어 목록 조회 결과
   */
  public async findSupportedLanguages(): Promise<
    ResponseApi<Map<string, object>>
  > {
    const url = `${this.ADMIN_MUL_LANG_BASE_URL}/supported`;
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
   * @기능 : 다국어 일괄 업로드
   * @param langGubun 언어 구분
   * @param file 업로드할 파일
   * @return 다국어 일괄 업로드 결과
   */
  public async bulkUploadMulLang(
    langGubun: string,
    file: File
  ): Promise<ResponseApi<Map<string, object>>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("langGubun", langGubun);

    const url = `${this.ADMIN_MUL_LANG_BASE_URL}/bulk-upload`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
