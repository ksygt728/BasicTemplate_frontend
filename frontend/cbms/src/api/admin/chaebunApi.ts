import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { ChaebunReqDto } from "@/types/requestDto/ChaebunReqDto";
import { ChaebunResDto } from "@/types/responseDto/ChaebunResDto";

/**
 * @파일명 : chaebunApi.ts
 * @설명 : 채번 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.10.07
 * @변경이력 :
 *       2025.10.07 김승연 최초 생성
 */
export class ChaebunApi {
  private static instance: ChaebunApi;

  private constructor() {}

  public static getInstance(): ChaebunApi {
    if (!ChaebunApi.instance) {
      ChaebunApi.instance = new ChaebunApi();
    }
    return ChaebunApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  private ADMIN_CHAEBUN_BASE_URL = `${this.API_BASE_URL}/admin/chaebun`;

  /**
   * @REQ_ID : REQ_ADM_053
   * @화면 : 시스템 관리 > 채번관리
   * @기능 : 채번 리스트 조회
   * @param chaebunReqDto 채번 검색 조건 DTO
   * @param page 페이지 번호
   * @param size 페이지 크기
   * @param sort 정렬 필드
   * @param direction 정렬 방향
   * @return 채번 리스트 조회 결과
   */
  public async findAllChaebunForAdmin(
    chaebunReqDto: ChaebunReqDto,
    page: number = 0,
    size: number = 2000,
    sort: string = "seqId",
    direction: "ASC" | "DESC" = "ASC"
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: sort,
      direction: direction,
      ...Object.fromEntries(
        Object.entries(chaebunReqDto).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      ),
    });

    const url = `${this.ADMIN_CHAEBUN_BASE_URL}/search?${params}`;
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
   * @REQ_ID : REQ_ADM_053_2
   * @화면 : 시스템 관리 > 채번관리
   * @기능 : 채번 조회
   * @param seqId 채번 아이디
   * @return 채번 상세 정보
   */
  public async findByChaebunForAdmin(
    seqId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CHAEBUN_BASE_URL}/${seqId}`;
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
   * @REQ_ID : REQ_ADM_054
   * @화면 : 시스템 관리 > 채번관리
   * @기능 : 채번 추가
   * @param chaebunReqDto 채번 정보 DTO
   * @return 채번 추가 결과
   */
  public async insertChaebunForAdmin(
    chaebunReqDto: ChaebunReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CHAEBUN_BASE_URL}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chaebunReqDto),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_055
   * @화면 : 시스템 관리 > 채번관리
   * @기능 : 채번 수정
   * @param chaebunReqDto 채번 정보 DTO
   * @return 채번 수정 결과
   */
  public async updateChaebunForAdmin(
    chaebunReqDto: ChaebunReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CHAEBUN_BASE_URL}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chaebunReqDto),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_056
   * @화면 : 시스템 관리 > 채번관리
   * @기능 : 채번 삭제
   * @param seqId 채번 아이디
   * @return 채번 삭제 결과
   */
  public async deleteChaebunForAdmin(
    seqId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_CHAEBUN_BASE_URL}/${seqId}`;
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
   * @REQ_ID : REQ_ADM_056
   * @화면 : 시스템 관리 > 채번관리
   * @기능 : 채번 생성
   * @param seqId 채번 아이디
   * @return 채번 생성 결과
   */
  public async generateSeq(
    seqId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({ seqId });
    const url = `${this.ADMIN_CHAEBUN_BASE_URL}/generateSeq?${params}`;
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
}
