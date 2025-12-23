import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { BbsReqDto } from "@/types/requestDto/BbsReqDto";
import { BbsResDto } from "@/types/responseDto/BbsResDto";
import { BbsCommentReqDto } from "@/types/requestDto/BbsCommentReqDto";
import { BbsCommentResDto } from "@/types/responseDto/BbsCommentResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { authGet, authPost, authPut, authDelete } from "@/utils/authFetch";

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
    const params: any = {
      page: pageable.page.toString(),
      size: pageable.size.toString(),
    };

    // sort 파라미터 추가 - 백엔드 형식: sort[fieldName]=direction
    if (pageable.sort && pageable.direction) {
      params[`sort[${pageable.sort}]`] = pageable.direction;
    } else {
      params["sort[writeDate]"] = "DESC";
    }

    // 검색 조건 추가
    Object.entries(bbsReqDto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params[key] = value;
      }
    });

    const searchParams = new URLSearchParams(params);
    const url = `${this.ADMIN_BBS_BASE_URL}/search?${searchParams}`;
    return authGet(url).then((res) => res.json());
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
    return authGet(url).then((res) => res.json());
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
    return authPost(url, bbs).then((res) => res.json());
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
    return authPut(url, bbs).then((res) => res.json());
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
    return authDelete(url).then((res) => res.json());
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
    });

    // bbsId는 Path Variable로 전달
    const url = `${this.ADMIN_BBS_BASE_URL}/comment/search/${bbsCommentReqDto.bbsId}?${params}`;
    return authGet(url).then((res) => res.json());
  }

  /**
   * @기능 : 게시판 댓글 추가
   * @param bbsComment 댓글 정보 DTO
   * @return 게시판 댓글 추가 결과
   */
  public async insertBbsCommentForAdmin(
    bbsComment: BbsCommentReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_BBS_BASE_URL}/comment`;
    return authPost(url, bbsComment).then((res) => res.json());
  }

  /**
   * @기능 : 게시판 댓글 수정
   * @param bbsComment 댓글 정보 DTO
   * @return 게시판 댓글 수정 결과
   */
  public async updateBbsCommentForAdmin(
    bbsComment: BbsCommentReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_BBS_BASE_URL}/comment`;
    return authPut(url, bbsComment).then((res) => res.json());
  }

  /**
   * @기능 : 게시판 댓글 삭제
   * @param commentId 댓글 아이디
   * @return 게시판 댓글 삭제 결과
   */
  public async deleteBbsCommentForAdmin(
    commentId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_BBS_BASE_URL}/comment/${commentId}`;
    return authDelete(url).then((res) => res.json());
  }
}
