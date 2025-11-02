import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { MailMReqDto } from "@/types/requestDto/MailMReqDto";
import { MailMResDto } from "@/types/responseDto/MailMResDto";
import { MailHResDto } from "@/types/responseDto/MailHResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";

/**
 * @파일명 : mailApi.ts
 * @설명 : 메일 템플릿 및 발송 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.10.07
 * @변경이력 :
 *       2025.10.07 김승연 최초 생성
 */
export class MailApi {
  private static instance: MailApi;

  private constructor() {}

  public static getInstance(): MailApi {
    if (!MailApi.instance) {
      MailApi.instance = new MailApi();
    }
    return MailApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private ADMIN_MAIL_BASE_URL = `${this.API_BASE_URL}/admin/mail`;
  /**
   * @REQ_ID : REQ_ADM_057
   * @화면 : 시스템 관리 > 메일 관리
   * @기능 : 메일 리스트 조회
   * @param mailMReqDto 메일 검색 조건 DTO
   * @param pageable 페이지네이션 정보
   * @return 메일 리스트 조회 결과
   */
  public async findAllMailForAdmin(
    mailMReqDto: MailMReqDto,
    pageable: Pageable = {
      page: 0,
      size: 2000,
      sort: "mailId",
      direction: "ASC",
    }
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: pageable.page.toString(),
      size: pageable.size.toString(),
      sort: pageable.sort ?? "mailId",
      direction: pageable.direction ?? "ASC",
      ...Object.fromEntries(
        Object.entries(mailMReqDto).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      ),
    });

    const url = `${this.ADMIN_MAIL_BASE_URL}/search?${params}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });


    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_057_2
   * @화면 : 시스템 관리 > 메일 관리
   * @기능 : 메일 상세 조회
   * @param mailId 메일 아이디
   * @return 메일 상세 조회 결과
   */
  public async findByMailForAdmin(
    mailId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MAIL_BASE_URL}/${mailId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });


    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_058
   * @화면 : 시스템 관리 > 메일 관리
   * @기능 : 메일 발송 이력 조회
   * @param mailId 메일 아이디
   * @param pageable 페이지네이션 정보
   * @return 메일 발송 이력 조회 결과
   */
  public async findByMailHistoryForAdmin(
    mailId: string,
    pageable: Pageable = {
      page: 0,
      size: 2000,
      sort: "sendDt",
      direction: "DESC",
    }
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: pageable.page.toString(),
      size: pageable.size.toString(),
      sort: pageable.sort ?? "sendDt",
      direction: pageable.direction ?? "DESC",
    });

    const url = `${this.ADMIN_MAIL_BASE_URL}/history/${mailId}?${params}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });


    return response.json();
  }
  /**
   * @REQ_ID : REQ_ADM_059
   * @화면 : 시스템 관리 > 메일 관리
   * @기능 : 메일 추가
   * @param mailMReqDto 메일 정보 DTO
   * @return 메일 추가 결과
   */
  public async insertMailForAdmin(
    mailMReqDto: MailMReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MAIL_BASE_URL}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mailMReqDto),
    });


    return response.json();
  }
  /**
   * @REQ_ID : REQ_ADM_062
   * @화면 : 시스템 관리 > 메일 관리
   * @기능 : 메일 수정
   * @param mailM 메일 정보 DTO
   * @return 메일 수정 결과
   */
  public async updateMailForAdmin(
    mailM: MailMReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MAIL_BASE_URL}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mailM),
    });


    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_063
   * @화면 : 시스템 관리 > 메일 관리
   * @기능 : 메일 삭제
   * @param mailId 메일 아이디
   * @return 메일 삭제 결과
   */
  public async deleteMailForAdmin(
    mailId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MAIL_BASE_URL}/${mailId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });


    return response.json();
  }

  /**
   * @기능 : 메일 발송
   * @param mailId 메일 아이디
   * @param recipients 수신자 목록
   * @return 메일 발송 결과
   */
  public async sendMailForAdmin(
    mailId: string,
    recipients: string[]
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_MAIL_BASE_URL}/send/${mailId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipients }),
    });


    return response.json();
  }
}
