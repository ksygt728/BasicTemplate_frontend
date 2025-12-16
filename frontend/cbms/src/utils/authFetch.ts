import Cookies from "js-cookie";
import { ResponseApi } from "@/types/commonDto/ResponseApi";
import {
  logout as logoutAction,
  login as loginAction,
} from "@/store/slices/authSlice";
import type { AppDispatch } from "@/store/store";

/**
 * @파일명 : authFetch.ts (리팩토링 버전)
 * @설명 : JWT 인증이 포함된 공통 fetch wrapper
 * @작성자 : 김승연
 * @작성일 : 2025.12.03
 * @변경이력 :
 *       2025.12.03 김승연 최초 생성
 *       2025.12.05 김승연 가독성 개선 (중복 제거, 함수 분리)
 *
 * @절차 설명:
 *
 * ■ Case 1: 정상 요청 (AT 있음)
 *   1. 쿠키에서 AccessToken(AT) 가져오기
 *   2. AT를 헤더에 추가하여 API 요청
 *   3. 성공 시 응답 반환
 *
 * ■ Case 2: AT 없고 RT만 있음 (사전 갱신)
 *   1. 쿠키에 AT 없음, RefreshToken(RT)만 있음 감지
 *   2. RT로 토큰 갱신 API 호출
 *   3. 새 AT/RT를 쿠키에 저장
 *   4. 새 AT로 원래 API 요청 진행
 *
 * ■ Case 3: AT 만료 (1006 에러)
 *   1. AT로 API 요청
 *   2. 서버에서 1006 에러 응답 (AT 만료)
 *   3. RT로 토큰 갱신 API 호출
 *   4. 새 AT/RT를 쿠키에 저장
 *   5. 새 AT로 원래 API 재호출
 *   6. 재호출 응답 반환
 *
 * ■ Case 4: RT 만료 (1007, 1008, 1009 에러)
 *   1. RT로 토큰 갱신 시도
 *   2. RT도 만료되어 갱신 실패
 *   3. 쿠키 삭제 및 로그아웃 처리
 *   4. 로그인 페이지로 리다이렉트
 *
 * ■ Case 5: 토큰 없음 (1001 에러 또는 AT/RT 모두 없음)
 *   1. 쿠키에 AT, RT 모두 없음
 *   2. 로그인 페이지로 리다이렉트
 *
 * ■ Case 6: 권한 없음 (1003 에러)
 *   1. 인증은 성공했으나 권한 부족
 *   2. 현재 페이지 유지 (리다이렉트 없음)
 */

/**
 * 인증 에러 코드 정의
 */
export const AUTH_ERROR_CODES = {
  LOGIN_REQUIRED: "1001", // 로그인 안됨
  ACCESS_DENIED: "1003", // 접근 권한 없음
  JWT_ISSUE_ACCESS_TOKEN_EXPIRED: "1006", // AccessToken 만료
  JWT_ISSUE_REFRESH_TOKEN_EXPIRED: "1007", // RefreshToken 만료
  JWT_ISSUE_ACCESS_TOKEN_NOT_VERIFIED: "1008", // AccessToken 인증 불가
  JWT_ISSUE_REFRESH_TOKEN_NOT_VERIFIED: "1009", // RefreshToken 인증 불가
  JWT_ISSUE_ATRT_EXSIT: "1010", // 잘못된 요청
} as const;

/**
 * authFetch 옵션 인터페이스
 */
interface AuthFetchOptions extends RequestInit {
  skipAuth?: boolean; // 인증 헤더를 건너뛸지 여부
}

/**
 * Redux dispatch 및 showAlert 함수를 저장할 전역 변수
 */
let globalDispatch: AppDispatch | null = null;
let globalShowAlert: ((options: any) => void) | null = null;
let globalRouter: any = null;

/**
 * authFetch 초기화 함수
 * @param dispatch Redux dispatch 함수
 * @param showAlert Alert 표시 함수
 * @param router Next.js router 객체
 */
export const initAuthFetch = (
  dispatch: AppDispatch,
  showAlert: (options: any) => void,
  router: any
) => {
  globalDispatch = dispatch;
  globalShowAlert = showAlert;
  globalRouter = router;
};

/**
 * 토큰 가져오기
 */
const getTokens = () => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  return { accessToken, refreshToken };
};

/**
 * 토큰 저장하기
 */
const saveTokens = (accessToken: string, refreshToken: string) => {
  const accessTokenExpireMinutes = parseInt(
    process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRE_MINUTES || "30"
  );
  const refreshTokenExpireMinutes = parseInt(
    process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRE_MINUTES || "129600" // 90일
  );

  const accessTokenExpireDate = new Date(
    Date.now() + accessTokenExpireMinutes * 60 * 1000
  );
  const refreshTokenExpireDate = new Date(
    Date.now() + refreshTokenExpireMinutes * 60 * 1000
  );

  Cookies.set("accessToken", accessToken, {
    expires: accessTokenExpireDate,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  Cookies.set("refreshToken", refreshToken, {
    expires: refreshTokenExpireDate,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

/**
 * 토큰 삭제하기
 */
const clearTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

/**
 * 로그인 페이지로 리다이렉트 (SSR/CSR 호환)
 */
const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/signIn";
  } else if (globalRouter) {
    globalRouter.push("/signIn");
  }
};

/**
 * 로그아웃 처리
 */
const handleLogout = () => {
  clearTokens();
  if (globalDispatch) {
    globalDispatch(logoutAction());
  }
  redirectToLogin();
};

/**
 * Headers에 AccessToken 설정
 */
const setAuthHeader = (headers: Headers, accessToken: string) => {
  const headerName =
    process.env.NEXT_PUBLIC_ACCESS_TOKEN_HEADER ||
    "Authorization-Accesstoken-Dev";
  headers.set(headerName, accessToken);
};

/**
 * 응답을 안전하게 JSON 파싱 (Content-Type 체크 포함)
 */
const safeParseResponse = async (
  response: Response
): Promise<ResponseApi | null> => {
  const contentType = response.headers.get("content-type");

  // JSON이 아니면 body만 소비하고 null 반환
  if (!contentType?.includes("application/json")) {
    await response.text();
    return null;
  }

  // JSON인 경우 파싱 시도
  try {
    const text = await response.text();
    return text?.trim() ? JSON.parse(text) : null;
  } catch {
    return null;
  }
};

/**
 * RefreshToken으로 토큰 갱신 시도
 */
const refreshAccessToken = async (
  url: string,
  options: AuthFetchOptions
): Promise<Response | null> => {
  const { refreshToken } = getTokens();

  if (!refreshToken) {
    handleLogout();
    return null;
  }

  /* Case 2-2, Case 3-3: RT로 토큰 갱신 API 호출 */
  const refreshHeaders = new Headers();
  refreshHeaders.set("Content-Type", "application/json");
  const refreshTokenHeader =
    process.env.NEXT_PUBLIC_REFRESH_TOKEN_HEADER ||
    "Authorization-Refreshtoken-Dev";
  refreshHeaders.set(refreshTokenHeader, refreshToken);

  try {
    const response = await fetch(url, {
      ...options,
      headers: refreshHeaders,
    });

    // 응답 헤더에서 새 토큰 추출
    const newAccessToken = response.headers.get(
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_HEADER ||
        "Authorization-Accesstoken-Dev"
    );
    const newRefreshToken = response.headers.get(
      process.env.NEXT_PUBLIC_REFRESH_TOKEN_HEADER ||
        "Authorization-Refreshtoken-Dev"
    );

    /* Case 4-2: RT도 만료되어 갱신 실패 */
    if (!newAccessToken || !newRefreshToken) {
      handleLogout();
      return null;
    }

    /* Case 2-3, Case 3-4: 새 AT/RT를 쿠키에 저장 */
    saveTokens(newAccessToken, newRefreshToken);

    // 토큰 갱신 응답 body 소비
    await safeParseResponse(response);

    // 토큰 갱신 후 자동으로 사용자 정보 조회 및 Redux 업데이트
    if (globalDispatch) {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const userInfoUrl = `${apiBaseUrl}/api/auth/me`;

        const userHeaders = new Headers();
        userHeaders.set("Content-Type", "application/json");
        setAuthHeader(userHeaders, newAccessToken);

        const userResponse = await fetch(userInfoUrl, {
          method: "GET",
          headers: userHeaders,
        });

        const userResult = await userResponse.json();

        if (userResult.success && userResult.data) {
          const userInfo = userResult.data.data || userResult.data;
          globalDispatch(
            loginAction({
              user: {
                userId: userInfo.userId || "",
                name: userInfo.name || "",
                email: userInfo.email || "",
                role: userInfo.role || "",
                phoneNum: userInfo.phoneNum || "",
                userType: userInfo.userType || "",
                gender: userInfo.gender || "",
                department: userInfo.department || {},
              },
              token: newAccessToken,
            })
          );
        }
      } catch (userError) {
        // 사용자 정보 조회 실패해도 토큰 갱신은 성공으로 처리
        console.error("토큰 갱신 후 사용자 정보 조회 실패:", userError);
      }
    }

    return response;
  } catch (error) {
    return null;
  }
};

/**
 * 토큰 갱신 후 원래 API 재시도
 */
const retryWithNewToken = async (
  url: string,
  options: AuthFetchOptions
): Promise<Response | null> => {
  /* Case 3-3: RT로 토큰 갱신 API 호출 */
  /* Case 3-4: 새 AT/RT를 쿠키에 저장 */
  const refreshed = await refreshAccessToken(url, options);
  if (!refreshed) return null;

  const newAccessToken = Cookies.get("accessToken");
  if (!newAccessToken) return null;

  /* Case 3-5: 새 AT로 원래 API 재호출 */
  const newHeaders = new Headers(options.headers);
  setAuthHeader(newHeaders, newAccessToken);

  /* Case 3-6: 재호출 응답 반환 */
  return await fetch(url, {
    ...options,
    headers: newHeaders,
  });
};

/**
 * 에러 코드별 처리
 */
const handleErrorCode = async (
  errorCode: string,
  message: string,
  url: string,
  options: AuthFetchOptions
): Promise<Response | null> => {
  switch (errorCode) {
    case AUTH_ERROR_CODES.JWT_ISSUE_ATRT_EXSIT:
      // 1010: 잘못된 요청
      if (globalShowAlert) {
        globalShowAlert({
          type: "error",
          title: "잘못된 요청",
          message: message,
        });
      }
      return null;

    case AUTH_ERROR_CODES.JWT_ISSUE_ACCESS_TOKEN_EXPIRED:
      // 1006: AccessToken 만료 -> 토큰 갱신 후 재시도
      return await retryWithNewToken(url, options);

    case AUTH_ERROR_CODES.JWT_ISSUE_ACCESS_TOKEN_NOT_VERIFIED:
    case AUTH_ERROR_CODES.JWT_ISSUE_REFRESH_TOKEN_EXPIRED:
    case AUTH_ERROR_CODES.JWT_ISSUE_REFRESH_TOKEN_NOT_VERIFIED:
      /* Case 4-3: 쿠키 삭제 및 로그아웃 처리 */
      /* Case 4-4: 로그인 페이지로 리다이렉트 */
      handleLogout();
      return null;

    case AUTH_ERROR_CODES.LOGIN_REQUIRED:
      /* Case 5-2: 로그인 페이지로 리다이렉트 */
      redirectToLogin();
      return null;

    case AUTH_ERROR_CODES.ACCESS_DENIED:
      /* Case 6-2: 현재 페이지 유지 (리다이렉트 없음) */
      return null;

    default:
      return null;
  }
};

/**
 * JWT 인증이 포함된 공통 fetch 함수
 * @param url 요청 URL
 * @param options fetch 옵션
 * @returns Promise<Response>
 */
export const authFetch = async (
  url: string,
  options: AuthFetchOptions = {}
): Promise<Response> => {
  const { skipAuth = false, ...fetchOptions } = options;

  // 헤더 설정
  const headers = new Headers(fetchOptions.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // JWT 토큰 추가 (skipAuth가 false일 때만)
  if (!skipAuth) {
    /* Case 1-1: 쿠키에서 AccessToken(AT) 가져오기 */
    /* Case 2-1: 쿠키에 AT 없음, RefreshToken(RT)만 있음 감지 */
    /* Case 5-1: 쿠키에 AT, RT 모두 없음 */
    let { accessToken, refreshToken } = getTokens();

    /* Case 2-2~2-4: RT로 토큰 갱신 API 호출 → 새 AT/RT를 쿠키에 저장 → 새 AT로 원래 API 요청 진행 */
    if (!accessToken && refreshToken) {
      const refreshed = await refreshAccessToken(url, {
        ...fetchOptions,
        headers,
      });

      if (refreshed) {
        accessToken = getTokens().accessToken;
      } else {
        /* Case 5-2: 로그인 페이지로 리다이렉트 */
        redirectToLogin();
        // throw new Error("토큰 갱신 실패 - 로그인이 필요합니다");
      }
    }

    /* Case 1-2: AT를 헤더에 추가하여 API 요청 */
    if (accessToken) {
      setAuthHeader(headers, accessToken);
    } else {
      /* Case 5-2: 로그인 페이지로 리다이렉트 */
      redirectToLogin();
      // throw new Error("인증 토큰이 없습니다");
    }
  }

  /* Case 1-2: AT를 헤더에 추가하여 API 요청 */
  /* Case 3-1: AT로 API 요청 */
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // 응답 파싱
    const clonedResponse = response.clone();
    const result: ResponseApi = await clonedResponse.json();

    /* Case 3-2: 서버에서 1006 에러 응답 (AT 만료) */
    /* Case 3-3~3-6: RT로 토큰 갱신 API 호출 → 새 AT/RT를 쿠키에 저장 → 새 AT로 원래 API 재호출 → 재호출 응답 반환 */
    if (!result.success && result.errorCode) {
      const retryResponse = await handleErrorCode(
        result.errorCode,
        result.message,
        url,
        { ...fetchOptions, headers }
      );

      if (retryResponse) {
        return retryResponse;
      }
    }

    /* Case 1-3: 성공 시 응답 반환 */
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * authFetch를 사용한 GET 요청
 */
export const authGet = (url: string, options?: AuthFetchOptions) => {
  return authFetch(url, { ...options, method: "GET" });
};

/**
 * authFetch를 사용한 POST 요청
 */
export const authPost = (
  url: string,
  body?: any,
  options?: AuthFetchOptions
) => {
  return authFetch(url, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
};

/**
 * authFetch를 사용한 PUT 요청
 */
export const authPut = (
  url: string,
  body?: any,
  options?: AuthFetchOptions
) => {
  return authFetch(url, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
};

/**
 * authFetch를 사용한 DELETE 요청
 */
export const authDelete = (
  url: string,
  body?: any,
  options?: AuthFetchOptions
) => {
  return authFetch(url, {
    ...options,
    method: "DELETE",
    body: body ? JSON.stringify(body) : undefined,
  });
};
