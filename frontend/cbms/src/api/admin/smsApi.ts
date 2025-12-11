import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { SmsMReqDto } from "@/types/requestDto/SmsMReqDto";
import { SmsMResDto } from "@/types/responseDto/SmsMResDto";
import { SmsHResDto } from "@/types/responseDto/SmsHResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { authGet, authPost, authPut, authDelete } from "@/utils/authFetch";

/**
 * @파일명 : smsApi.ts
 * @설명 : SMS 템플릿 및 발송 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.07.23
 * @변경이력 :
 *       2025.07.23 김승연 최초 생성
 */
export class SmsApi {
  private static instance: SmsApi;

  private constructor() {}

  public static getInstance(): SmsApi {
    if (!SmsApi.instance) {
      SmsApi.instance = new SmsApi();
    }
    return SmsApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private ADMIN_SMS_BASE_URL = `${this.API_BASE_URL}/admin/sms`;

  /**
   * @REQ_ID : REQ_ADM_086
   * @화면 : 시스템 관리 > SMS 템플릿 관리
   * @기능 : SMS 템플릿 리스트 조회
   * @param smsM SMS 검색 조건 DTO
   * @returns SMS 템플릿 리스트 조회 결과
   */
  public async findAllSmsForAdmin(
    smsM: SmsMReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    let url = `${this.ADMIN_SMS_BASE_URL}`;
    const params = new URLSearchParams();

    Object.keys(smsM).forEach((key) => {
      const value = (smsM as any)[key];
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return authGet(url).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_087
   * @화면 : 시스템 관리 > SMS 템플릿 관리
   * @기능 : SMS 템플릿 상세 조회
   * @param smsId SMS 아이디
   * @returns SMS 템플릿 상세 조회 결과
   */
  public async findBySmsForAdmin(
    smsId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_SMS_BASE_URL}/${smsId}`;
    return authGet(url).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_088
   * @화면 : 시스템 관리 > SMS 템플릿 관리
   * @기능 : SMS 템플릿 추가
   * @param smsM SMS 정보 DTO
   * @returns SMS 템플릿 추가 결과
   */
  public async insertSmsForAdmin(
    smsM: SmsMReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_SMS_BASE_URL}`;
    return authPost(url, smsM).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_089
   * @화면 : 시스템 관리 > SMS 템플릿 관리
   * @기능 : SMS 템플릿 수정
   * @param smsM SMS 정보 DTO
   * @returns SMS 템플릿 수정 결과
   */
  public async updateSmsForAdmin(
    smsM: SmsMReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_SMS_BASE_URL}`;
    return authPut(url, smsM).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_090
   * @화면 : 시스템 관리 > SMS 템플릿 관리
   * @기능 : SMS 템플릿 삭제
   * @param smsId SMS 아이디
   * @returns SMS 템플릿 삭제 결과
   */
  public async deleteSmsForAdmin(
    smsId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_SMS_BASE_URL}/${smsId}`;
    return authDelete(url).then((res) => res.json());
  }

  /**
   * @REQ_ID : REQ_ADM_091
   * @화면 : 시스템 관리 > SMS 발송 이력
   * @기능 : SMS 발송 이력 조회
   * @param smsId SMS 아이디
   * @param page 페이지 번호 (기본값: 0)
   * @param size 페이지 크기 (기본값: 200)
   * @param sort 정렬 기준 (기본값: sendDate)
   * @returns SMS 발송 이력 목록
   */
  public async findBySmsHistoryForAdmin(
    smsId: string,
    pageable: Pageable = {
      page: 0,
      size: 200,
      sort: "sendDate",
      direction: "ASC",
    }
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = new URL(`${this.ADMIN_SMS_BASE_URL}/history/${smsId}`);

    url.searchParams.append("page", pageable.page.toString());
    url.searchParams.append("size", pageable.size.toString());
    url.searchParams.append("sort", pageable.sort || "sendDate");
    if (pageable.direction) {
      url.searchParams.append("direction", pageable.direction);
    }

    return authGet(url.toString()).then((res) => res.json());
  }
}
