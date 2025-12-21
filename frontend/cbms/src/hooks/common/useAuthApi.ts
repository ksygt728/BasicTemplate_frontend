import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AuthApi } from "@/api/common/authApi";
import { AuthReqDto } from "@/types/requestDto/specialDto/AuthReqDto";
import { UserReqDto } from "@/types/requestDto/UserReqDto";
import { AuthResDto } from "@/types/responseDto/specialDto/AuthResDto";
import { useCommonApi } from "@/hooks/common/useCommonApiFormat";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";

/**
 * @파일명 : useAuthApi.ts
 * @설명 : 인증 관련 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.12.01
 * @변경이력 :
 *       2025.12.01 김승연 최초 생성
 */

/**
 * 인증 관련 API 호출을 위한 커스텀 훅
 * @returns {Object} 인증 관련 상태와 함수들을 반환
 * @returns {boolean} loading - 로딩 상태
 * @returns {string | null} error - 에러 메시지
 * @returns {Function} handleSignIn - 로그인 함수
 */
export const useAuthApi = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authApi = AuthApi.getInstance();
  const { loading, error, handleApiCall } = useCommonApi();

  /**
   * @기능 현재 로그인한 사용자 정보 조회
   * @returns {Promise<{success: boolean, data?: any, message?: string}>} 사용자 정보
   */
  const getCurrentUser = useCallback(async (): Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }> => {
    try {
      const response = await authApi.getCurrentUser();
      if (response.success && response.data?.data) {
        return { success: true, data: response.data.data };
      }
      return {
        success: false,
        message: response.message || "사용자 정보를 가져올 수 없습니다.",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "사용자 정보 조회 중 오류가 발생했습니다.",
      };
    }
  }, [authApi]);

  /**
   * @기능 로그인 함수
   * @REQ_ID REQ_CMN_004
   * @param {AuthReqDto} authReqDto - 로그인 요청 정보 (userId, password)
   * @param {string} redirectUrl - 로그인 성공 후 이동할 경로 (기본값: /main)
   * @returns {Promise<{success: boolean, message?: string}>} 로그인 결과 및 에러 메시지
   */
  const handleSignIn = useCallback(
    async (
      authReqDto: AuthReqDto,
      redirectUrl: string = "/main"
    ): Promise<{ success: boolean; message?: string }> => {
      try {
        // API 호출 (Response 객체를 직접 받아야 함)
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/signIn`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(authReqDto),
        });

        // 1. Header에서 토큰 추출 및 쿠키에 저장

        const accessToken = response.headers.get(
          process.env.NEXT_PUBLIC_ACCESS_TOKEN_HEADER ||
            "Authorization-Accesstoken-Dev"
        );
        const refreshToken = response.headers.get(
          process.env.NEXT_PUBLIC_REFRESH_TOKEN_HEADER ||
            "Authorization-Refreshtoken-Dev"
        );

        // 환경변수에서 만료시간(분) 가져오기
        const accessTokenExpireMinutes = parseInt(
          process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRE_MINUTES || "10"
        );
        const refreshTokenExpireMinutes = parseInt(
          process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRE_MINUTES || "60"
        );

        // 절대 만료 시간 계산 (현재 시간 + 만료 분수)
        const accessTokenExpireDate = new Date(
          Date.now() + accessTokenExpireMinutes * 60 * 1000
        );
        const refreshTokenExpireDate = new Date(
          Date.now() + refreshTokenExpireMinutes * 60 * 1000
        );

        if (accessToken) {
          Cookies.set("accessToken", accessToken, {
            expires: accessTokenExpireDate,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        }

        if (refreshToken) {
          Cookies.set("refreshToken", refreshToken, {
            expires: refreshTokenExpireDate,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        }

        // 2. Body에서 사용자 정보 추출
        const result = await response.json();

        // ResponseApi 타입 체크
        if (!result.success) {
          const errorMessage = result.message || "로그인에 실패했습니다.";
          return { success: false, message: errorMessage };
        }

        // 3. Redux에 사용자 정보 저장
        // API 응답 구조: result.data에 사용자 정보가 있음
        const userData = result.data.data as any; // API 응답 구조 확인을 위해 any 사용

        // // 디버깅: API 응답 데이터 확인
        // console.log("API 응답 전체:", result);
        // console.log("사용자 데이터:", userData);
        // console.log("사용자 이름:", userData?.name);
        // console.log("userId:", userData?.userId);

        dispatch(
          login({
            user: {
              userId: userData?.userId || "",
              name: userData?.name || "",
              email: userData?.email || "",
              role: userData?.role || "",
              phoneNum: userData?.phoneNum || "",
              userType: userData?.userType || "",
              gender: userData?.gender || "",
              department: userData?.department || {},
            },
            token: accessToken || "",
          })
        );

        // 4. redirect URL로 이동 (보안 검증 포함)
        const isValidRedirect =
          redirectUrl.startsWith("/") && !redirectUrl.startsWith("//");
        router.push(isValidRedirect ? redirectUrl : "/main");

        return { success: true };
      } catch (err) {
        console.error("로그인 오류:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "알 수 없는 오류가 발생했습니다.";
        return { success: false, message: errorMessage };
      }
    },
    [dispatch, router]
  );

  /**
   * @기능 카카오 소셜 로그인 함수
   * @returns {void} 카카오 로그인 페이지로 리다이렉트
   */
  const handleKakaoSignIn = useCallback(() => {
    const kakaoLoginUrl = process.env.NEXT_PUBLIC_KAKAO_LOGIN_URL;

    // 리다이렉트 URL을 state에 저장
    const stateParam = encodeURIComponent(
      JSON.stringify({ redirectUrl: "/main" })
    );
    const separator = kakaoLoginUrl?.includes("?") ? "&" : "?";
    const loginUrlWithState = `${kakaoLoginUrl}${separator}state=${stateParam}`;

    // 카카오 OAuth 페이지로 이동 (window.location.href 사용)
    // 백엔드에서 OAuth 처리 후 /auth/callback으로 리다이렉트됨
    window.location.href = loginUrlWithState;
  }, []);

  /**
   * @기능 구글 소셜 로그인 함수
   * @returns {void} 구글 로그인 페이지로 리다이렉트
   */
  const handleGoogleSignIn = useCallback(() => {
    const googleLoginUrl = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_URL;

    // 리다이렉트 URL을 state에 저장
    const stateParam = encodeURIComponent(
      JSON.stringify({ redirectUrl: "/main" })
    );
    const separator = googleLoginUrl?.includes("?") ? "&" : "?";
    const loginUrlWithState = `${googleLoginUrl}${separator}state=${stateParam}`;

    // 구글 OAuth 페이지로 이동
    window.location.href = loginUrlWithState;
  }, []);

  /**
   * @기능 네이버 소셜 로그인 함수
   * @returns {void} 네이버 로그인 페이지로 리다이렉트
   */
  const handleNaverSignIn = useCallback(() => {
    const naverLoginUrl = process.env.NEXT_PUBLIC_NAVER_LOGIN_URL;

    // 리다이렉트 URL을 state에 저장
    const stateParam = encodeURIComponent(
      JSON.stringify({ redirectUrl: "/main" })
    );
    const separator = naverLoginUrl?.includes("?") ? "&" : "?";
    const loginUrlWithState = `${naverLoginUrl}${separator}state=${stateParam}`;

    // 네이버 OAuth 페이지로 이동
    window.location.href = loginUrlWithState;
  }, []);

  /**
   * @기능 회원가입 함수
   * @REQ_ID REQ_CMN_003
   * @param {UserReqDto} userReqDto - 회원가입 요청 정보
   * @returns {Promise<{success: boolean, message?: string}>} 회원가입 결과 및 메시지
   */
  const handleSignUp = useCallback(
    async (
      userReqDto: UserReqDto
    ): Promise<{ success: boolean; message?: string }> => {
      try {
        const result = await authApi.signUp(userReqDto);

        if (!result.success) {
          const errorMessage = result.message || "회원가입에 실패했습니다.";
          return { success: false, message: errorMessage };
        }

        return {
          success: true,
          message: "회원가입이 완료되었습니다.",
        };
      } catch (err) {
        console.error("회원가입 오류:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "알 수 없는 오류가 발생했습니다.";
        return { success: false, message: errorMessage };
      }
    },
    []
  );

  /**
   * @기능 회원가입 제출 처리 (검증 + API 호출 + 리다이렉트)
   * @param {any} formData - 폼 데이터
   * @param {any} validations - 현재 검증 상태
   * @param {Function} handleSignUpSubmit - Service의 검증 함수
   * @returns {Promise<{success: boolean, validationResults?: any, message?: string}>}
   */
  const handleSignUpWithValidation = useCallback(
    async (
      formData: any,
      validations: any,
      handleSignUpSubmit: (formData: any, validations: any) => any
    ): Promise<{
      success: boolean;
      validationResults?: any;
      message?: string;
    }> => {
      // Service에서 검증 + DTO 변환
      const submitResult = handleSignUpSubmit(formData, validations);

      // 검증 실패
      if (!submitResult.isValid) {
        return {
          success: false,
          validationResults: submitResult.validationResults,
          message: "입력 정보를 확인해주세요.",
        };
      }

      // API 호출
      const result = await handleSignUp(submitResult.userReqDto!);

      if (result.success) {
        // 성공 시 로그인 페이지로 리다이렉트
        router.push("/signIn");
      }

      return result;
    },
    [handleSignUp, router]
  );

  return {
    loading,
    error,
    handleSignIn,
    handleKakaoSignIn,
    handleGoogleSignIn,
    handleNaverSignIn,
    handleSignUp,
    handleSignUpWithValidation,
    getCurrentUser,
  };
};
