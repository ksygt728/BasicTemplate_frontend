import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { BbsReqDto } from "@/types/requestDto/BbsReqDto";
import { BbsResDto } from "@/types/responseDto/BbsResDto";
import { BbsCommentReqDto } from "@/types/requestDto/BbsCommentReqDto";
import { BbsCommentResDto } from "@/types/responseDto/BbsCommentResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";

/**
 * @파일명 : bbsApi.ts
 * @설명 : 게시판 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.10.07
 * @변경이력 :
 *       2025.10.07 김승연 최초 생성
 */
export class BbsApi {
  private static instance: BbsApi;

  private constructor() {}

  public static getInstance(): BbsApi {
    if (!BbsApi.instance) {
      BbsApi.instance = new BbsApi();
    }
    return BbsApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private ADMIN_BBS_BASE_URL = `${this.API_BASE_URL}/admin/bbs`;

  /**
   * @REQ_ID : REQ_ADM_081
   * @화면 : 시스템 관리 > 게시판 관리
   * @기능 : 게시판 리스트 조회
   * @param bbsReqDto 게시판 검색 조건 DTO
   * @param pageable 페이지네이션 정보
   * @return 게시판 리스트 조회 결과
   */
  public async findAllBbsForAdmin(
    bbsReqDto: BbsReqDto,
    pageable: Pageable = {
      page: 0,
      size: 100,
      sort: "writeDate",
      direction: "DESC",
    }
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: pageable.page.toString(),
      size: pageable.size.toString(),
      sort: pageable.sort ?? "writeDate",
      direction: pageable.direction ?? "DESC",
      ...Object.fromEntries(
        Object.entries(bbsReqDto).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      ),
    });

    const url = `${this.ADMIN_BBS_BASE_URL}/search?${params}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_081_2
   * @화면 : 시스템 관리 > 게시판 관리
   * @기능 : 게시판 상세 조회
   * @param bbsId 게시판 아이디
   * @return 게시판 상세 조회 결과
   */
  public async findByBbsForAdmin(
    bbsId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_BBS_BASE_URL}/${bbsId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_083
   * @화멤 : 시스템 관리 > 게시판 관리
   * @기능 : 게시판 추가
   * @param bbs 게시판 정보 DTO
   * @return 게시판 추가 결과
   */
  public async insertBbsForAdmin(
    bbs: BbsReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_BBS_BASE_URL}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bbs),
    });

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_084
   * @화멤 : 시스템 관리 > 게시판 관리
   * @기능 : 게시판 수정
   * @param bbs 게시판 정보 DTO
   * @return 게시판 수정 결과
   */
  public async updateBbsForAdmin(
    bbs: BbsReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_BBS_BASE_URL}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bbs),
    });

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_085
   * @화면 : 시스템 관리 > 게시판 관리
   * @기능 : 게시판 삭제
   * @param bbsId 게시판 아이디
   * @return 게시판 삭제 결과
   */
  public async deleteBbsForAdmin(
    bbsId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_BBS_BASE_URL}/${bbsId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }

  /**
   * @기능 : 게시판 댓글 리스트 조회
   * @param bbsCommentReqDto 댓글 검색 조건 DTO
   * @param page 페이지 번호
   * @param size 페이지 크기
   * @return 게시판 댓글 리스트 조회 결과
   */
  public async findAllBbsCommentForAdmin(
    bbsCommentReqDto: BbsCommentReqDto,
    pageable: Pageable = { page: 0, size: 100 }
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: pageable.page.toString(),
      size: pageable.size.toString(),
      ...Object.fromEntries(
        Object.entries(bbsCommentReqDto).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      ),
    });

    const url = `${this.ADMIN_BBS_BASE_URL}/comment/search?${params}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  }
}
