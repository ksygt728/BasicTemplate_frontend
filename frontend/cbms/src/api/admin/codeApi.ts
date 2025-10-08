import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { ComCodeMReqDto } from "@/types/requestDto/ComCodeMReqDto";
import { ComCodeDReqDto } from "@/types/requestDto/ComCodeDReqDto";
import { ComCodeTReqDto } from "@/types/requestDto/ComCodeTReqDto";
import { CodeSearchFormReqDto } from "@/types/requestDto/specialDto/CodeSearchFormReqDto";
import { ComCodeMResDto } from "@/types/responseDto/ComCodeMResDto";
import { ComCodeDResDto } from "@/types/responseDto/ComCodeDResDto";
import { ComCodeTResDto } from "@/types/responseDto/ComCodeTResDto";
import { CodeSearchFormResDto } from "@/types/responseDto/specialDto/CodeSearchFormResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";

/**
 * @파일명 : codeApi.ts
 * @설명 : 공통 코드 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.10.07
 * @변경이력 :
 *       2025.10.07 김승연 최초 생성
 */
export class CodeApi {
  private static instance: CodeApi;

  private constructor() {}

  public static getInstance(): CodeApi {
    if (!CodeApi.instance) {
      CodeApi.instance = new CodeApi();
    }
    return CodeApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private ADMIN_CODE_BASE_URL = `${this.API_BASE_URL}/admin/code`;
  /**
   * @REQ_ID : REQ_ADM_009_1
   * @화면 : 기준 정보 > 코드 관리
   * @기능 : 공통코드 검색
   * @param reqDto 코드 검색 조건 DTO
   * @param page 페이지 번호
   * @param size 페이지 크기
   * @return 공통코드 검색 결과
   */
  public async findAllCodeMWithConditions(
    reqDto: CodeSearchFormReqDto,
    page: number = 0,
    size: number = 2000
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...Object.fromEntries(
        Object.entries(reqDto).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      ),
    });

    const url = `${this.ADMIN_CODE_BASE_URL}/search?${params}`;
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
   * @REQ_ID : REQ_ADM_009_2
   * @화면 : 기준 정보 > 코드 관리
   * @기능 : 그룹 코드 조회
   * @param grpCd 그룹 코드
   * @return 그룹 코드 상세 정보
   */
  public async findByGroupCodeForAdmin(
    grpCd: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CODE_BASE_URL}/group/${grpCd}`;
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
   * @REQ_ID : REQ_ADM_010
   * @화면 : 기준 정보 > 코드 관리
   * @기능 : 그룹 코드 추가
   * @param comCodeM 그룹 코드 정보 DTO
   * @return 그룹 코드 추가 결과
   */
  public async insertGroupCodeForAdmin(
    comCodeM: ComCodeMReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CODE_BASE_URL}/group`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comCodeM),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_011
   * @화면 : 기준 정보 > 코드 관리
   * @기능 : 그룹 코드 수정
   * @param comCodeM 그룹 코드 정보 DTO
   * @return 그룹 코드 수정 결과
   */
  public async updateGroupCodeForAdmin(
    comCodeM: ComCodeMReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CODE_BASE_URL}/group`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comCodeM),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_012
   * @화면 : 기준 정보 > 코드 관리
   * @기능 : 그룹 코드 삭제
   * @param grpCd 그룹 코드
   * @return 그룹 코드 삭제 결과
   */
  public async deleteGroupCodeForAdmin(
    grpCd: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CODE_BASE_URL}/group/${grpCd}`;
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
   * @기능 : 상세 코드 리스트 조회
   * @param grpCd 그룹 코드
   * @param page 페이지 번호
   * @param size 페이지 크기
   * @return 상세 코드 리스트 조회 결과
   */
  public async codeFormD(
    codeSearchForm: CodeSearchFormReqDto,
    pageable: Pageable = {
      page: 0,
      size: 20,
      sort: "searchCdId",
      direction: "ASC",
    }
  ): Promise<ResponseApi<CodeSearchFormResDto[]>> {
    const url = `${this.API_BASE_URL}/admin/code/form/detail?page=${pageable.page}&size=${pageable.size}&sort=${pageable.sort}&direction=${pageable.direction}`;
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

  public async insertDetailCodeForAdmin(
    comCodeD: ComCodeDReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CODE_BASE_URL}/detail`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comCodeD),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  public async updateDetailCodeForAdmin(
    comCodeD: ComCodeDReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CODE_BASE_URL}/detail`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comCodeD),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  public async deleteDetailCodeForAdmin(
    grpCd: string,
    dtlCd: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CODE_BASE_URL}/detail/${grpCd}/${dtlCd}`;
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
