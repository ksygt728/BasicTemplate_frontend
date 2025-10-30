"use client";

import React from "react";
import { useCodeApi } from "@/hooks/useCodeApi";

/**
 * API 에러 테스트 페이지
 * 로딩 상태가 제대로 해제되는지 확인
 */
export default function ApiTestPage() {
  const { loading, error, fetchCodeData } = useCodeApi();

  const handleTestApiError = async () => {
    // 잘못된 검색 조건으로 API 호출하여 에러 발생시키기
    await fetchCodeData({
      grpCd: "INVALID_CODE_TO_TRIGGER_ERROR",
      attrCd: "",
      dtlCd: "",
      grpNm: "",
      attrNm: "",
      dtlNm: "",
      useYn: "",
    });
  };

  const handleTestValidApi = async () => {
    // 정상적인 API 호출
    await fetchCodeData({
      grpCd: "",
      attrCd: "",
      dtlCd: "",
      grpNm: "",
      attrNm: "",
      dtlNm: "",
      useYn: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        API 에러 테스트
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          현재 상태
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              로딩 상태
            </h3>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                loading
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              }`}
            >
              {loading ? "로딩 중..." : "대기"}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              에러 상태
            </h3>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                error
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
              }`}
            >
              {error || "에러 없음"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          테스트 버튼
        </h2>

        <div className="space-y-4">
          <button
            onClick={handleTestApiError}
            disabled={loading}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition duration-200"
          >
            {loading ? "요청 중..." : "API 에러 테스트 (잘못된 요청)"}
          </button>

          <button
            onClick={handleTestValidApi}
            disabled={loading}
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition duration-200"
          >
            {loading ? "요청 중..." : "정상 API 테스트"}
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          테스트 방법
        </h3>
        <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
          <li>현재 로딩 상태가 "대기"인지 확인</li>
          <li>"API 에러 테스트" 버튼을 클릭</li>
          <li>로딩 상태가 "로딩 중..."으로 변경되는지 확인</li>
          <li>Alert가 표시되는지 확인</li>
          <li>Alert 확인 후 로딩 상태가 다시 "대기"로 돌아오는지 확인</li>
          <li>
            만약 로딩 상태가 계속 "로딩 중..."으로 남아있다면 버그가 있는 것
          </li>
        </ol>
      </div>

      {/* 디버깅 정보 */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          디버깅 정보
        </h3>
        <pre className="text-sm text-gray-600 dark:text-gray-300">
          {JSON.stringify({ loading, error: error || null }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
