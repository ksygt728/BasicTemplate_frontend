"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card } from "@/components/common/themed";
import { useAuthApi } from "@/hooks/useAuthApi";
import { useAlert } from "@/contexts/AlertContext";

/**
 * @파일명 : page.tsx
 * @설명 : 로그인 페이지 (Themed)
 * @작성자 : 김승연
 * @작성일 : 2025.12.01
 * @변경이력 :
 *       2025.12.01 김승연 최초 생성
 *       2025.12.07 김승연 테마 컴포넌트 적용
 */
export default function SignInPage() {
  const [userId, setUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/main";
  const {
    loading,
    handleSignIn,
    handleKakaoSignIn,
    handleGoogleSignIn,
    handleNaverSignIn,
  } = useAuthApi();
  const { showAlert } = useAlert();

  /**
   * 로그인 폼 제출 핸들러
   * @param e - 폼 이벤트
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력값 검증
    if (!userId || !password) {
      showAlert({
        type: "warning",
        title: "입력 오류",
        message: "아이디와 비밀번호를 입력해주세요.",
      });
      return;
    }

    // 로그인 처리 (redirect URL 전달)
    const result = await handleSignIn({ userId, password }, redirectUrl);

    if (result.success) {
      showAlert({
        type: "success",
        title: "로그인 성공",
        message: "환영합니다!",
        autoClose: 1500,
      });
    } else {
      showAlert({
        type: "error",
        title: "로그인 실패",
        message: result.message || "아이디 또는 비밀번호를 확인해주세요.",
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background-default)",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Card>
          <form onSubmit={handleSubmit}>
            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <Link
                href="/main"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                <h1
                  style={{
                    fontSize: "32px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                  }}
                >
                  CBMS
                </h1>
              </Link>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                }}
              >
                로그인하여 계속하세요
              </p>
            </div>

            {/* User ID Input */}
            <div style={{ marginBottom: "16px" }}>
              <Input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="아이디"
                disabled={loading}
                fullWidth
              />
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: "24px" }}>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                disabled={loading}
                fullWidth
              />
            </div>

            {/* Sign In Button */}
            <div style={{ marginBottom: "16px" }}>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>
            </div>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "var(--border-default)",
                }}
              />
              <span
                style={{
                  padding: "0 16px",
                  fontSize: "14px",
                  color: "var(--text-tertiary)",
                }}
              >
                또는
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "var(--border-default)",
                }}
              />
            </div>

            {/* Social Login Buttons */}
            <div style={{ marginBottom: "12px" }}>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={handleNaverSignIn}
                disabled={loading}
              >
                <svg
                  style={{ width: "20px", height: "20px", marginRight: "8px" }}
                  viewBox="0 0 24 24"
                >
                  <rect width="24" height="24" rx="4" fill="#03C75A" />
                  <g transform="scale(-1,1) translate(-24,0)">
                    <path
                      d="M17 17h-3v-5.5l-4 5.5H7V7h3v5.5l4-5.5h3v10z"
                      fill="#fff"
                    />
                  </g>
                </svg>
                Naver로 로그인
              </Button>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={handleKakaoSignIn}
                disabled={loading}
              >
                <svg
                  style={{ width: "20px", height: "20px", marginRight: "8px" }}
                  viewBox="0 0 24 24"
                >
                  <ellipse cx="12" cy="12" rx="12" ry="12" fill="#FEE500" />
                  <path
                    d="M12 7c-3.314 0-6 1.79-6 4 0 1.657 1.343 3.09 3.312 3.74L8 17l3.03-2.03c.32.03.65.03.97.03 3.314 0 6-1.79 6-4s-2.686-4-6-4z"
                    fill="#381E1F"
                  />
                </svg>
                Kakao로 로그인
              </Button>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg
                  style={{ width: "20px", height: "20px", marginRight: "8px" }}
                  viewBox="0 0 40 40"
                >
                  <path
                    d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                    fill="#FFC107"
                  />
                  <path
                    d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                    fill="#FF3D00"
                  />
                  <path
                    d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                    fill="#4CAF50"
                  />
                  <path
                    d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                    fill="#1976D2"
                  />
                </svg>
                Google로 로그인
              </Button>
            </div>

            {/* Sign Up Link */}
            <div style={{ textAlign: "center" }}>
              <Link
                href="/signUp"
                style={{
                  fontSize: "14px",
                  color: "var(--primary-default)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                계정이 없으신가요? 회원가입
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
