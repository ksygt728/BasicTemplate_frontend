import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { DepartmentReqDto } from "@/types/requestDto/DepartmentReqDto";
import { DepartmentResDto } from "@/types/responseDto/DepartmentResDto";
import { Pageable } from "@/types/requestDto/specialDto/Pageable";
import { authGet, authPost, authPut, authDelete } from "@/utils/authFetch";

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
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private ADMIN_DEPARTMENT_BASE_URL = `${this.API_BASE_URL}/admin/department`;
  /**
   * @REQ_ID : REQ_ADM_005
   * @화면 : 조직 관리 > 부서 관리
   * @기능 : 부서 정보 리스트 조회
   * @param departmentReqDto 부서 검색 조건 DTO
   * @param pageable 페이지네이션 정보
   * @return 부서 정보 리스트 조회 결과
   */
  public async findAllDepartmentForAdmin(
    departmentReqDto: DepartmentReqDto,
    pageable: Pageable = {
      page: 0,
      size: 2000,
      sort: "deptCode",
      direction: "ASC",
    }
  ): Promise<ResponseApi<Map<string, object>>> {
    const params = new URLSearchParams({
      page: pageable.page.toString(),
      size: pageable.size.toString(),
      sort: pageable.sort ?? "deptCode",
      direction: pageable.direction ?? "ASC",
      ...Object.fromEntries(
        Object.entries(departmentReqDto).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      ),
    });

    const url = `${this.ADMIN_DEPARTMENT_BASE_URL}/search?${params}`;
    return authGet(url).then((res) => res.json());
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
    return authGet(url).then((res) => res.json());
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
    return authPost(url, department).then((res) => res.json());
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
    return authPut(url, department).then((res) => res.json());
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
    return authDelete(url).then((res) => res.json());
  }
}
