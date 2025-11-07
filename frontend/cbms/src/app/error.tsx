"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="text-8xl mb-4">⚠️</div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white">Error</h1>
          <h2 className="text-2xl font-semibold text-gray-300">
            예상치 못한 오류가 발생했습니다
          </h2>
          <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">
            시스템에 문제가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시
            시도해주세요.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              다시 시도
            </button>

            <button
              onClick={() => router.push("/main")}
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              홈으로 가기
            </button>
          </div>

          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg text-gray-400 hover:text-gray-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-slate-800 transition-colors duration-200"
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

        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
              에러 상세 정보 (개발 모드)
            </summary>
            <pre className="mt-2 p-3 bg-slate-900/50 text-red-300 text-xs rounded overflow-auto max-h-32 whitespace-pre-wrap">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="text-xs text-gray-500">
          문제가 지속되면 관리자에게 문의해주세요.
        </div>
      </div>
    </div>
  );
}
