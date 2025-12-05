import { useState } from "react";
import { useAlert } from "@/contexts/AlertContext";
import { authFetch } from "@/utils/authFetch";

/**
 * @파일명 : useCommonApi.ts
 * @설명 : 공통 API 호출 처리를 위한 커스텀 훅 (JWT 인증 포함)
 * @작성자 : 김승연
 * @작성일 : 2025.12.01
 * @변경이력 :
 *       2025.12.01 김승연 최초 생성
 *       2025.12.03 김승연 JWT 인증 로직 추가
 *       2025.12.05 김승연 인증 에러 코드 Alert 제외 처리 추가
 */

/**
 * @constant SILENT_ERROR_CODES
 * @description Alert를 표시하지 않을 에러 코드 목록
 * @description authFetch에서 자동으로 처리하는 인증 관련 에러들은 사용자에게 Alert를 표시하지 않음
 * @description 1001: 로그인 필요 (자동 리다이렉트)
 * @description 1003: 접근 권한 없음 (페이지 유지)
 * @description 1006: AccessToken 만료 (자동 갱신 후 재시도)
 * @description 1007: RefreshToken 만료 (자동 로그아웃 처리)
 * @description 1008: AccessToken 인증 불가 (자동 로그아웃 처리)
 * @description 1009: RefreshToken 인증 불가 (자동 로그아웃 처리)
 * @description 1010: 잘못된 요청 (예외적으로 Alert 표시 필요)
 * @note 새로운 에러 코드를 추가하려면 이 배열에 에러 코드를 추가하면 됨 (확장성)
 */
const SILENT_ERROR_CODES = ["1001", "1003", "1006", "1007", "1008", "1009"];

/**
 * @function shouldShowAlert
 * @description 에러 코드가 Alert를 표시해야 하는지 확인
 * @param {string} errorCode - 확인할 에러 코드
 * @returns {boolean} Alert를 표시해야 하면 true, 아니면 false
 */
const shouldShowAlert = (errorCode: string): boolean => {
  return !SILENT_ERROR_CODES.includes(errorCode);
};

/**
 * @interface UseCommonApiReturn
 * @description 공통 API 훅의 반환 타입
 * @property {boolean} loading - 로딩 상태
 * @property {string | null} error - 에러 메시지
 * @property {Function} handleApiCall - 공통 API 호출 처리 함수
 */
interface UseCommonApiReturn {
  loading: boolean;
  error: string | null;
  handleApiCall: <T>(
    apiCall: () => Promise<T>,
    successCallback?: (data: T) => void
  ) => Promise<T | null>;
}

/**
 * @function useCommonApi
 * @description 공통 API 호출을 처리하는 커스텀 훅
 * @returns {UseCommonApiReturn} 로딩 상태, 에러, API 호출 함수
 *
 * @example
 * const { loading, error, handleApiCall } = useCommonApi();
 *
 * const fetchData = async () => {
 *   await handleApiCall(
 *     () => api.getData(),
 *     (response) => {
 *       if (response.success) {
 *         setData(response.data);
 *       }
 *     }
 *   );
 * };
 */
export const useCommonApi = (): UseCommonApiReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();

  /**
   * @function handleApiCall
   * @description 공통 API 호출 처리 함수
   * @template T - API 응답 타입
   * @param {Function} apiCall - 실행할 API 호출 함수
   * @param {Function} [successCallback] - 성공 시 실행할 콜백 함수
   * @returns {Promise<T | null>} API 호출 결과 또는 null
   *
   * @description
   * - 로딩 상태를 자동으로 관리합니다
   * - API 응답의 success 필드를 확인하여 에러를 처리합니다
   * - 에러 발생 시 Alert를 표시합니다
   * - finally 블록에서 항상 로딩 상태를 false로 설정합니다
   */
  const handleApiCall = async <T>(
    apiCall: () => Promise<T>,
    successCallback?: (data: T) => void
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiCall();

      // ResponseApi 타입의 응답인지 확인하고 success 필드 체크
      if (result && typeof result === "object" && "success" in result) {
        const apiResponse = result as any;

        if (!apiResponse.success) {
          const errorMsg = apiResponse.message || "API 오류가 발생했습니다.";
          const errorCode = apiResponse.errorCode || "Unknown";
          
          setError(errorMsg);

          // 인증 에러 코드는 authFetch에서 자동 처리하므로 Alert 제외
          if (shouldShowAlert(errorCode)) {
            showAlert({
              type: "error",
              title: `[API] Error Code : ${errorCode}`,
              message: errorMsg,
            });
          } else {
            // 디버깅용 로그 (프론트엔드에서 처리하는 인증 에러)
            console.log(`[Auth Error ${errorCode}] ${errorMsg} - authFetch에서 자동 처리됨`);
          }

          return null;
        }
      }

      if (successCallback) {
        successCallback(result);
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "[Front End Error] 알 수 없는 오류가 발생했습니다.";

      setError(errorMessage);

      showAlert({
        type: "error",
        title: "네트워크 오류",
        message: errorMessage,
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleApiCall,
  };
};
