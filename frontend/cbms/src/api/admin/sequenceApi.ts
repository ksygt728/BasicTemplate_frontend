import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { ChaebunReqDto } from "@/types/requestDto/ChaebunReqDto";
import { ChaebunResDto } from "@/types/responseDto/ChaebunResDto";

/**
 * @파일명 : sequenceApi.ts
 * @설명 : 시퀀스(일련번호) 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.07.23
 * @변경이력 :
 *       2025.07.23 김승연 최초 생성
 */
export class SequenceApi {
  private static instance: SequenceApi;

  private constructor() {}

  public static getInstance(): SequenceApi {
    if (!SequenceApi.instance) {
      SequenceApi.instance = new SequenceApi();
    }
    return SequenceApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  private ADMIN_SEQUENCE_BASE_URL = `${this.API_BASE_URL}/admin/sequence`;

  /**
   * @REQ_ID : REQ_ADM_081
   * @화면 : 시스템 관리 > 채번관리
   * @기능 : 채번 리스트 조회
   * @param chaebun 채번 검색 조건 DTO
   * @returns 채번 리스트 조회 결과
   */
  public async findAllSequenceForAdmin(
    chaebun: ChaebunReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    let url = `${this.ADMIN_SEQUENCE_BASE_URL}`;
    const params = new URLSearchParams();

    Object.keys(chaebun).forEach((key) => {
      const value = (chaebun as any)[key];
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_082
   * @화면 : 시스템 관리 > 채번관리
   * @기능 : 채번 상세 조회
   * @param chaebunId 채번 아이디
   * @returns 채번 상세 조회 결과
   */
  public async findBySequenceForAdmin(
    chaebunId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_SEQUENCE_BASE_URL}/${chaebunId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_083
   * @화면 : 시스템 관리 > 채번관리
   * @기능 : 채번 추가
   * @param chaebun 채번 정보 DTO
   * @returns 채번 추가 결과
   */
  public async insertSequenceForAdmin(
    chaebun: ChaebunReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_SEQUENCE_BASE_URL}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chaebun),
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_084
   * @화면 : 시스템 관리 > 채번관리
   * @기능 : 채번 수정
   * @param chaebun 채번 정보 DTO
   * @returns 채번 수정 결과
   */
  public async updateSequenceForAdmin(
    chaebun: ChaebunReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_SEQUENCE_BASE_URL}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chaebun),
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_085
   * @화면 : 시스템 관리 > 채번관리
   * @기능 : 채번 삭제
   * @param chaebunId 채번 아이디
   * @returns 채번 삭제 결과
   */
  public async deleteSequenceForAdmin(
    chaebunId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_SEQUENCE_BASE_URL}/${chaebunId}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }
}
