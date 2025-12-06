"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import MainLogo from "@/components/common/logo/MainLogo";
import { useAuthApi } from "@/hooks/useAuthApi";
import { useAlert } from "@/contexts/AlertContext";

/**
 * @파일명 : page.tsx
 * @설명 : 로그인 페이지
 * @작성자 : 김승연
 * @작성일 : 2025.12.01
 * @변경이력 :
 *       2025.12.01 김승연 최초 생성
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
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <MainLogo />

          <h1 className="mt-3 text-2xl font-semibold text-gray-800 capitalize sm:text-3xl dark:text-white">
            sign In
          </h1>

          <div className="relative flex items-center mt-8">
            <span className="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>

            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
              className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="ID"
            />
          </div>

          <div className="relative flex items-center mt-4">
            <span className="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Password"
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "로그인 중..." : "Sign in"}
            </button>
            <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
              or sign in with
            </p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNaverSignIn();
              }}
              className="flex items-center justify-center px-6 py-3 mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {/* Naver Icon */}
              <svg className="w-6 h-6 mx-2" viewBox="0 0 24 24">
                <rect width="24" height="24" rx="4" fill="#03C75A" />
                <g transform="scale(-1,1) translate(-24,0)">
                  <path
                    d="M17 17h-3v-5.5l-4 5.5H7V7h3v5.5l4-5.5h3v10z"
                    fill="#fff"
                  />
                </g>
              </svg>
              <span className="mx-2">Sign in with Naver</span>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleKakaoSignIn();
              }}
              className="flex items-center justify-center px-6 py-3 mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              {/* Kakao Icon */}
              <svg className="w-6 h-6 mx-2" viewBox="0 0 24 24">
                <ellipse cx="12" cy="12" rx="12" ry="12" fill="#FEE500" />
                <path
                  d="M12 7c-3.314 0-6 1.79-6 4 0 1.657 1.343 3.09 3.312 3.74L8 17l3.03-2.03c.32.03.65.03.97.03 3.314 0 6-1.79 6-4s-2.686-4-6-4z"
                  fill="#381E1F"
                />
              </svg>
              <span className="mx-2">Sign in with Kakao</span>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleGoogleSignIn();
              }}
              className="flex items-center justify-center px-6 py-3 mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <svg className="w-6 h-6 mx-2" viewBox="0 0 40 40">
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

              <span className="mx-2">Sign in with Google</span>
            </a>
            <div className="mt-6 text-center ">
              <a
                href="/signUp"
                className="text-sm text-blue-500 hover:underline dark:text-blue-400"
              >
                Don’t have an account yet? Sign up
              </a>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
