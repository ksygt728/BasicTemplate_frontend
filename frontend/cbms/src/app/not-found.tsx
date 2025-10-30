"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * @파일명 : not-found.tsx
 * @설명 : 404 Not Found 페이지
 * @작성자 : 김승연
 * @작성일 : 2025.10.30
 */

export default function NotFound() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* 404 아이콘 */}
        <div className="flex justify-center">
          <div className="text-8xl mb-4">⚠️</div>
        </div>

        {/* 404 정보 */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-gray-300">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            <br />
            URL을 다시 확인해주세요.
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-4">
          {/* 주요 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => isClient && router.push("/main")}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-slate-800 bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-800 transition-colors duration-200"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              홈으로 가기
            </button>

            <button
              onClick={() => isClient && router.back()}
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-gray-300 bg-slate-700 hover:bg-slate-600 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-800 transition-colors duration-200"
            >
              <svg
                className="mr-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              뒤로 가기
            </button>
          </div>
        </div>

        {/* 도움말 텍스트 */}
        <div className="text-xs text-gray-500">
          페이지 주소를 확인하시거나 관리자에게 문의해주세요.
        </div>
      </div>
    </div>
  );
}
