"use client";

import { useEffect, useState, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useAlert } from "@/contexts/AlertContext";
import { useRouter } from "next/navigation";
import { initAuthFetch, authGet } from "@/utils/authFetch";
import { login } from "@/store/slices/authSlice";
import Cookies from "js-cookie";

/**
 * @파일명 : AuthProvider.tsx
 * @설명 : authFetch 초기화 및 세션 복원을 위한 Provider
 * @작성자 : 김승연
 * @작성일 : 2025.12.03
 * @변경이력 :
 *       2025.12.03 김승연 최초 생성
 *       2025.12.04 김승연 세션 복원 로직 추가
 */

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { showAlert } = useAlert();
  const router = useRouter();
  const [isRestoring, setIsRestoring] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }
    isInitialized.current = true;

    initAuthFetch(dispatch, showAlert, router);

    const restoreSession = async () => {
      try {
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");

        if (accessToken || refreshToken) {
          try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
            const apiUrl = `${apiBaseUrl}/api/auth/me`;

            const response = await authGet(apiUrl);
            const result = await response.json();

            if (result.success && result.data && accessToken) {
              const userInfo = result.data.data || result.data;

              dispatch(
                login({
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
                  token: accessToken,
                })
              );
            } else if (!result.success) {
              Cookies.remove("accessToken");
              Cookies.remove("refreshToken");
            }
          } catch (apiError) {
            console.error("세션 복원 API 호출 오류:", apiError);
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
          }
        }
      } catch (error) {
        console.error("세션 복원 오류:", error);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      } finally {
        setIsRestoring(false);
      }
    };

    restoreSession();
  }, []);

  if (isRestoring) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 dark">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
