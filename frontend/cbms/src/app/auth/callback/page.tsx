"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";
import { Loading } from "@/components/common/themed";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // URL 파라미터에서 데이터 추출
        const success = searchParams.get("success");
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        const userDataEncoded = searchParams.get("userData");

        if (
          success === "true" &&
          accessToken &&
          refreshToken &&
          userDataEncoded
        ) {
          // URL 디코딩 후 JSON 파싱
          const userDataJson = decodeURIComponent(userDataEncoded);
          const result = JSON.parse(userDataJson);

          if (result.success && result.data) {
            // 데이터 구조: result<AuthResDto>에서 실제 사용자 데이터 추출
            // result.data가 AuthResDto이고, 그 안의 data가 실제 사용자 정보
            const userData = result.data.data || result.data;

            // 환경변수에서 만료시간(분) 가져오기
            const accessTokenExpireMinutes = parseInt(
              process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRE_MINUTES || "10"
            );
            const refreshTokenExpireMinutes = parseInt(
              process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRE_MINUTES || "60"
            );

            // 절대 만료 시간 계산
            const accessTokenExpireDate = new Date(
              Date.now() + accessTokenExpireMinutes * 60 * 1000
            );
            const refreshTokenExpireDate = new Date(
              Date.now() + refreshTokenExpireMinutes * 60 * 1000
            );

            // 쿠키에 토큰 저장
            Cookies.set("accessToken", accessToken, {
              expires: accessTokenExpireDate,
              sameSite: "strict",
            });

            Cookies.set("refreshToken", refreshToken, {
              expires: refreshTokenExpireDate,
              sameSite: "strict",
            });

            // Redux에 사용자 정보 저장
            dispatch(
              login({
                user: {
                  userId: userData.userId || "",
                  name: userData.name || "",
                  email: userData.email || "",
                  role: userData.role || "",
                  phoneNum: userData.phoneNum || "",
                  userType: userData.userType || "",
                  gender: userData.gender || "",
                  department: userData.department || {},
                },
                token: accessToken,
              })
            );

            // 최종 페이지로 리다이렉트 (강제 새로고침)
            window.location.href = "/main";
          } else {
            console.error("사용자 데이터 파싱 실패:", result);
            router.push("/signIn?error=invalid_data");
          }
        } else {
          console.error("URL 파라미터가 없거나 실패:", {
            success,
            accessToken,
            refreshToken,
            userDataEncoded,
          });
          router.push("/signIn?error=oauth_failed");
        }
      } catch (error) {
        console.error("OAuth callback processing failed:", error);
        router.push("/signIn?error=oauth_failed");
      }
    };

    processCallback();
  }, [searchParams, dispatch, router]);

  return <Loading message="소셜 로그인 처리 중..." />;
}
