import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { UserReqDto } from "@/types/requestDto/UserReqDto";
import { UserResDto } from "@/types/responseDto/UserResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { authGet, authPost, authPut, authDelete } from "@/utils/authFetch";

/**
 * @파일명 : userApi.ts
 * @설명 : 사용자 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.07.23
 * @변경이력 :
 *       2025.07.23 김승연 최초 생성
 *       2025.12.10 김승연 authFetch 적용
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
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private ADMIN_USER_BASE_URL = `${this.API_BASE_URL}/admin/user`;

  /**
   * @REQ_ID : REQ_ADM_001
   * @화면 : 조직 관리 > 사용자 관리
   * @기능 : 사용자 정보 조회
   * @param userReqDto 사용자 검색 조건 DTO
   * @param pageable 페이지 정보
   * @returns 사용자 정보 목록
   */
  public async findAllUserForAdmin(
    userReqDto?: UserReqDto,
    pageable: Pageable = {
      page: 0,
      size: 2000,
      sort: "userId",
      direction: "ASC",
    }
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: pageable.page.toString(),
      size: pageable.size.toString(),
      sort: pageable.sort || "userId",
    });

    if (pageable.direction) {
      params.append("direction", pageable.direction);
    }

    if (userReqDto) {
      Object.entries(userReqDto).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    const url = `${this.ADMIN_USER_BASE_URL}/search?${params}`;
    return authGet(url).then((res) => res.json());
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
    return authGet(url).then((res) => res.json());
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
    return authPut(url, user).then((res) => res.json());
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
    return authDelete(url).then((res) => res.json());
  }
}
