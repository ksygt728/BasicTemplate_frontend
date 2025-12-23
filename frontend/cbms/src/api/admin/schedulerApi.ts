import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { ScheMReqDto } from "@/types/requestDto/ScheMReqDto";
import { ScheMResDto } from "@/types/responseDto/ScheMResDto";
import { ScheHResDto } from "@/types/responseDto/ScheHResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { authGet, authPost, authPut, authDelete } from "@/utils/authFetch";

/**
 * @파일명 : schedulerApi.ts
 * @설명 : 스케줄러 작업 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.07.23
 * @변경이력 :
 *       2025.07.23 김승연 최초 생성
 */
export class SchedulerApi {
  private static instance: SchedulerApi;

  private constructor() {}

  public static getInstance(): SchedulerApi {
    if (!SchedulerApi.instance) {
      SchedulerApi.instance = new SchedulerApi();
    }
    return SchedulerApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private ADMIN_SCHEDULER_BASE_URL = `${this.API_BASE_URL}/admin/scheduler`;

  /**
   * @REQ_ID : REQ_ADM_074
   * @화면 : 시스템 관리 > 스케줄러 관리
   * @기능 : 스케줄러 리스트 조회
   * @param scheMReqDto 스케줄러 검색 조건 DTO
   * @param page 페이지 번호 (기본값: 0)
   * @param size 페이지 크기 (기본값: 200)
   * @param sort 정렬 기준 (기본값: scheId)
   * @returns 스케줄러 리스트 조회 결과
   */
  public async findAllSchedulerForAdmin(
    scheMReqDto?: ScheMReqDto,
    pageable: Pageable = {
      page: 0,
      size: 200,
      sort: "scheId",
      direction: "ASC",
    }
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = new URL(`${this.ADMIN_SCHEDULER_BASE_URL}/search`);

    if (scheMReqDto) {
      Object.keys(scheMReqDto).forEach((key) => {
        const value = (scheMReqDto as any)[key];
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    url.searchParams.append("page", pageable.page.toString());
    url.searchParams.append("size", pageable.size.toString());
    url.searchParams.append("sort", pageable.sort || "scheId");
    if (pageable.direction) {
      url.searchParams.append("direction", pageable.direction);
    }

    return authGet(url.toString()).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_074_2
   * @화면 : 시스템 관리 > 스케줄러 관리
   * @기능 : 스케줄러 조회
   * @param scheId 스케줄러 아이디
   * @returns 스케줄러 상세 조회 결과
   */
  public async findBySchedulerForAdmin(
    scheId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_SCHEDULER_BASE_URL}/${scheId}`;
    return authGet(url).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_075
   * @화면 : 시스템 관리 > 스케줄러 관리
   * @기능 : 스케줄러 이력 조회
   * @param scheId 스케줄러 아이디
   * @param page 페이지 번호 (기본값: 0)
   * @param size 페이지 크기 (기본값: 200)
   * @param sort 정렬 기준 (기본값: startDate)
   * @returns 스케줄러 이력 조회 결과
   */
  public async findBySchedulerHistoryForAdmin(
    scheId: string,
    pageable: Pageable = {
      page: 0,
      size: 200,
      sort: "endTime",
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
      params["sort[endTime]"] = "DESC";
    }

    const searchParams = new URLSearchParams(params);
    const url = `${this.ADMIN_SCHEDULER_BASE_URL}/history/${scheId}?${searchParams}`;
    return authGet(url).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_077
   * @화면 : 시스템 관리 > 스케줄러 관리
   * @기능 : 스케줄러 직접실행
   * @param scheId 스케줄러 아이디
   * @returns 스케줄러 직접실행 결과
   */
  public async executeSchedulerForAdmin(
    scheId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_SCHEDULER_BASE_URL}/execute/${scheId}`;
    return authPost(url, {}).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_078
   * @화면 : 시스템 관리 > 스케줄러 관리
   * @기능 : 스케줄러 추가
   * @param scheM 스케줄러 정보 DTO
   * @returns 스케줄러 추가 결과
   */
  public async insertSchedulerForAdmin(
    scheM: ScheMReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_SCHEDULER_BASE_URL}`;
    return authPost(url, scheM).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_079
   * @화면 : 시스템 관리 > 스케줄러 관리
   * @기능 : 스케줄러 수정
   * @param scheM 스케줄러 정보 DTO
   * @returns 스케줄러 수정 결과
   */
  public async updateSchedulerForAdmin(
    scheM: ScheMReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_SCHEDULER_BASE_URL}`;
    return authPut(url, scheM).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_080
   * @화면 : 시스템 관리 > 스케줄러 관리
   * @기능 : 스케줄러 삭제
   * @param scheId 스케줄러 아이디
   * @returns 스케줄러 삭제 결과
   */
  public async deleteSchedulerForAdmin(
    scheId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_SCHEDULER_BASE_URL}/${scheId}`;
    return authDelete(url).then((res) => res.json());
  }
}
