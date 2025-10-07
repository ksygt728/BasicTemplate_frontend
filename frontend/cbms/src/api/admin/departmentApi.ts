import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { DepartmentReqDto } from "@/types/requestDto/DepartmentReqDto";
import { DepartmentResDto } from "@/types/responseDto/DepartmentResDto";

/**
 * @파일명 : departmentApi.ts
 * @설명 : 부서 관리 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.10.07
 * @변경이력 :
 *       2025.10.07 김승연 최초 생성
 */
export class DepartmentApi {
  private static instance: DepartmentApi;

  private constructor() {}

  public static getInstance(): DepartmentApi {
    if (!DepartmentApi.instance) {
      DepartmentApi.instance = new DepartmentApi();
    }
    return DepartmentApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  private ADMIN_DEPARTMENT_BASE_URL = `${this.API_BASE_URL}/admin/department`;
  /**
   * @REQ_ID : REQ_ADM_005
   * @화면 : 조직 관리 > 부서 관리
   * @기능 : 부서 정보 리스트 조회
   * @param departmentReqDto 부서 검색 조건 DTO
   * @param page 페이지 번호
   * @param size 페이지 크기
   * @param sort 정렬 필드
   * @param direction 정렬 방향
   * @return 부서 정보 리스트 조회 결과
   */
  public async findAllDepartmentForAdmin(
    departmentReqDto: DepartmentReqDto,
    page: number = 0,
    size: number = 2000,
    sort: string = "deptCode",
    direction: "ASC" | "DESC" = "ASC"
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: sort,
      direction: direction,
      ...Object.fromEntries(
        Object.entries(departmentReqDto).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      ),
    });

    const url = `${this.ADMIN_DEPARTMENT_BASE_URL}/search?${params}`;
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
   * @REQ_ID : REQ_ADM_005_2
   * @화면 : 조직 관리 > 부서 관리
   * @기능 : 부서 정보 조회
   * @param deptCode 부서 코드
   * @return 부서 정보 상세 조회 결과
   */
  public async findByDepartmentForAdmin(
    deptCode: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_DEPARTMENT_BASE_URL}/${deptCode}`;
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
   * @REQ_ID : REQ_ADM_006
   * @화면 : 조직 관리 > 부서 관리
   * @기능 : 부서 정보 추가
   * @param department 부서 정보 DTO
   * @return 부서 정보 추가 결과
   */
  public async insertDepartmentForAdmin(
    department: DepartmentReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_DEPARTMENT_BASE_URL}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(department),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_007
   * @화면 : 조직 관리 > 부서 관리
   * @기능 : 부서 정보 수정
   * @param department 부서 정보 DTO
   * @return 부서 정보 수정 결과
   */
  public async updateDepartmentForAdmin(
    department: DepartmentReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_DEPARTMENT_BASE_URL}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(department),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * @REQ_ID : REQ_ADM_008
   * @화면 : 조직 관리 > 부서 관리
   * @기능 : 부서 정보 삭제
   * @param deptCode 부서 코드
   * @return 부서 정보 삭제 결과
   */
  public async deleteDepartmentForAdmin(
    deptCode: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.ADMIN_DEPARTMENT_BASE_URL}/${deptCode}`;
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
}
