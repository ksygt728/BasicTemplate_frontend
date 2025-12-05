import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { ComCodeMReqDto } from "@/types/requestDto/ComCodeMReqDto";
import { ComCodeDReqDto } from "@/types/requestDto/ComCodeDReqDto";
import { ComCodeTReqDto } from "@/types/requestDto/ComCodeTReqDto";
import { CodeSearchFormReqDto } from "@/types/requestDto/specialDto/CodeSearchFormReqDto";
import { authGet, authPost, authPut, authDelete } from "@/utils/authFetch";

/**
 * @파일명 : codeApiV2.ts (예시)
 * @설명 : authFetch를 사용하는 공통 코드 관리 API (JWT 인증 포함)
 * @작성자 : 김승연
 * @작성일 : 2025.12.03
 * @변경이력 :
 *       2025.12.03 김승연 최초 생성
 */
export class CodeApiV2 {
  private static instance: CodeApiV2;

  private constructor() {}

  public static getInstance(): CodeApiV2 {
    if (!CodeApiV2.instance) {
      CodeApiV2.instance = new CodeApiV2();
    }
    return CodeApiV2.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private ADMIN_CODE_BASE_URL = `${this.API_BASE_URL}/admin/code`;

  /**
   * @REQ_ID : REQ_ADM_009_1
   * @화면 : 기준 정보 > 코드 관리
   * @기능 : 공통코드 검색 (JWT 인증 포함)
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

    // authGet 사용 - 자동으로 JWT 토큰이 헤더에 추가됨
    const response = await authGet(url);
    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_010
   * @화면 : 기준 정보 > 코드 관리
   * @기능 : 그룹 코드 추가 (JWT 인증 포함)
   * @param comCodeM 그룹 코드 정보 DTO
   * @return 그룹 코드 추가 결과
   */
  public async insertGroupCodeForAdmin(
    comCodeM: ComCodeMReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CODE_BASE_URL}/group`;

    // authPost 사용 - 자동으로 JWT 토큰이 헤더에 추가됨
    const response = await authPost(url, comCodeM);
    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_011
   * @화면 : 기준 정보 > 코드 관리
   * @기능 : 그룹 코드 수정 (JWT 인증 포함)
   * @param comCodeM 그룹 코드 정보 DTO
   * @return 그룹 코드 수정 결과
   */
  public async updateGroupCodeForAdmin(
    comCodeM: ComCodeMReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CODE_BASE_URL}/group`;

    // authPut 사용 - 자동으로 JWT 토큰이 헤더에 추가됨
    const response = await authPut(url, comCodeM);
    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_012
   * @화면 : 기준 정보 > 코드 관리
   * @기능 : 그룹 코드 삭제 (JWT 인증 포함)
   * @param grpCd 그룹 코드
   * @return 그룹 코드 삭제 결과
   */
  public async deleteGroupCodeForAdmin(
    grpCd: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CODE_BASE_URL}/group/${grpCd}`;

    // authDelete 사용 - 자동으로 JWT 토큰이 헤더에 추가됨
    const response = await authDelete(url);
    return response.json();
  }
}
