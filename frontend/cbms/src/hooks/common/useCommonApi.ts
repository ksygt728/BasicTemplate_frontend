import { useState } from "react";
import { useAlert } from "@/contexts/AlertContext";

/**
 * @파일명 : useCommonApi.ts
 * @설명 : 공통 API 호출 처리를 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.01
 * @변경이력 :
 *       2025.12.01 김승연 최초 생성
 */

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
          setError(errorMsg);

          showAlert({
            type: "error",
            title: "[API] Error Code : " + (apiResponse.errorCode || "Unknown"),
            message: errorMsg,
          });

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
