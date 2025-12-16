import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { LogApiReqDto } from "@/types/requestDto/LogApiReqDto";
import { LogErrorReqDto } from "@/types/requestDto/LogErrorReqDto";
import { LogApiResDto } from "@/types/responseDto/LogApiResDto";
import { LogErrorResDto } from "@/types/responseDto/LogErrorResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { authGet, authPost, authPut, authDelete } from "@/utils/authFetch";

/**
 * @파일명 : logApi.ts
 * @설명 : 시스템 로그(접속, 오류 등) 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.10.07
 * @변경이력 :
 *       2025.10.07 김승연 최초 생성
 */
export class LogApi {
  private static instance: LogApi;

  private constructor() {}

  public static getInstance(): LogApi {
    if (!LogApi.instance) {
      LogApi.instance = new LogApi();
    }
    return LogApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private ADMIN_LOG_BASE_URL = `${this.API_BASE_URL}/admin/log`;
  /**
   * @REQ_ID : REQ_ADM_064
   * @화면 : 시스템 관리 > 로그 관리
   * @기능 : 사용자 접속로그 리스트 조회
   * @param logApiReqDto 로그 검색 조건 DTO
   * @param pageable 페이지네이션 정보
   * @return 사용자 접속로그 리스트 조회 결과
   */
  public async findAllAccessLogForAdmin(
    logApiReqDto: LogApiReqDto,
    pageable: Pageable = {
      page: 0,
      size: 100,
      sort: "endDate",
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
      params["sort[endDate]"] = "DESC";
    }

    // 검색 조건 추가
    Object.entries(logApiReqDto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params[key] = value;
      }
    });

    const queryString = new URLSearchParams(params).toString();
    const url = `${this.ADMIN_LOG_BASE_URL}/api-log/search?${queryString}`;
    return authGet(url).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_064_2
   * @화면 : 시스템 관리 > 로그 관리
   * @기능 : 사용자 접속로그 조회
   * @param logId 로그 아이디
   * @return 사용자 접속로그 상세 조회 결과
   */
  public async findByAccessLogForAdmin(
    logId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_LOG_BASE_URL}/api-log/${logId}`;
    return authGet(url).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_065
   * @화면 : 시스템 관리 > 로그 관리
   * @기능 : 에러 리스트 조회
   * @param logErrorReqDto 에러 로그 검색 조건 DTO
   * @param pageable 페이지네이션 정보
   * @return 에러 리스트 조회 결과
   */
  public async findAllErrorLogForAdmin(
    logErrorReqDto: LogErrorReqDto,
    pageable: Pageable = {
      page: 0,
      size: 100,
      sort: "createDate",
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
      params["sort[createDate]"] = "DESC";
    }

    // 검색 조건 추가
    Object.entries(logErrorReqDto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params[key] = value;
      }
    });

    const queryString = new URLSearchParams(params).toString();
    const url = `${this.ADMIN_LOG_BASE_URL}/error-log/search?${queryString}`;
    return authGet(url).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_066
   * @화면 : 시스템 관리 > 로그 관리
   * @기능 : 에러 상세정보 조회
   * @param errId 에러 아이디
   * @return 에러 상세정보 조회 결과
   */
  public async findByErrorLogForAdmin(
    errId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_LOG_BASE_URL}/error-log/${errId}`;
    return authGet(url).then((res) => res.json());
  }
}
