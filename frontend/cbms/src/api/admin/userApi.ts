import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { UserReqDto } from "@/types/requestDto/UserReqDto";
import { UserResDto } from "@/types/responseDto/UserResDto";

/**
 * @파일명 : userApi.ts
 * @설명 : 사용자 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.07.23
 * @변경이력 :
 *       2025.07.23 김승연 최초 생성
 */
export class UserApi {
  private static instance: UserApi;

  private constructor() {}

  public static getInstance(): UserApi {
    if (!UserApi.instance) {
      UserApi.instance = new UserApi();
    }
    return UserApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  private ADMIN_USER_BASE_URL = `${this.API_BASE_URL}/admin/user`;

  /**
   * @REQ_ID : REQ_ADM_001
   * @화면 : 조직 관리 > 사용자 관리
   * @기능 : 사용자 정보 조회
   * @param userReqDto 사용자 검색 조건 DTO
   * @param page 페이지 번호 (기본값: 0)
   * @param size 페이지 크기 (기본값: 2000)
   * @param sort 정렬 기준 (기본값: userId)
   * @returns 사용자 정보 목록
   */
  public async findAllUserForAdmin(
    userReqDto?: UserReqDto,
    page: number = 0,
    size: number = 2000,
    sort: string = "userId"
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = new URL(`${this.ADMIN_USER_BASE_URL}/search`);

    if (userReqDto) {
      Object.keys(userReqDto).forEach((key) => {
        const value = (userReqDto as any)[key];
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    url.searchParams.append("page", page.toString());
    url.searchParams.append("size", size.toString());
    url.searchParams.append("sort", sort);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_002
   * @화면 : 조직 관리 > 사용자 관리
   * @기능 : 사용자 정보 상세조회
   * @param userId 사용자 아이디
   * @returns 사용자 상세 정보
   */
  public async findByUserForAdmin(
    userId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_USER_BASE_URL}/${userId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_003
   * @화면 : 조직 관리 > 사용자 관리
   * @기능 : 사용자 정보 수정
   * @param user 사용자 정보 수정 요청
   * @returns 사용자 정보 수정 결과
   */
  public async updateUserForAdmin(
    user: UserReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_USER_BASE_URL}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_004
   * @화면 : 조직 관리 > 사용자 관리
   * @기능 : 사용자 정보 삭제
   * @param userId 사용자 아이디
   * @returns 사용자 정보 삭제 결과
   */
  public async deleteUserForAdmin(
    userId: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_USER_BASE_URL}/${userId}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }
}
