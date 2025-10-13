"use client";

import { useState, useEffect, useCallback } from "react";
import { CodeApi } from "@/api/admin/codeApi";
import { CodeSearchFormReqDto } from "@/types/requestDto/specialDto/CodeSearchFormReqDto";
import { ResponseApi } from "@/types/commonDto/ResponseApi";

/**
 * @파일명 : useCodeApi.ts
 * @설명 : 코드 관리 API 호출을 위한 커스텀 훅
 * @작성자 : 김승연
 * @작성일 : 2025.10.13
 */

interface ComCodeInfo {
  dtlCd: string | null;
  codeAttributes: Array<{
    attrCd: string | null;
    attrNm: string | null;
    dtlNm: string | null;
  }>;
  useYn: string | null;
  dtlOrderNum: number;
}

interface CodeData {
  grpCdType: string;
  grpCd: string;
  grpNm: string;
  comCodeInfo: ComCodeInfo[];
}

interface ApiResponse {
  content: CodeData[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const useCodeApi = () => {
  const [codeData, setCodeData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const codeApi = CodeApi.getInstance();

  const fetchCodeData = useCallback(
    async (
      searchForm: CodeSearchFormReqDto = {},
      page: number = 0,
      size: number = 2000
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response: ResponseApi<Map<string, object>> =
          await codeApi.findAllCodeMWithConditions(searchForm, page, size);

        if (response.success && response.data) {
          // API 응답 구조에 맞게 데이터 추출
          const dataMap = response.data as any;

          // 실제 API 응답 구조에 맞게 데이터 설정
          if (dataMap.data) {
            setCodeData(dataMap.data);
          } else {
            setCodeData(dataMap);
          }
        } else {
          setError(response.message || "데이터 조회에 실패했습니다.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    },
    [codeApi]
  );

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    // API 호출 시도, 실패하면 목 데이터 사용
    fetchCodeData().catch(() => {
      ("API 호출 실패, 목 데이터 사용");
      const mockData: ApiResponse = {
        content: [
          {
            grpCdType: "선박",
            grpCd: "SHIP",
            grpNm: "선박코드",
            comCodeInfo: [
              {
                dtlCd: "SHIP001",
                codeAttributes: [
                  {
                    attrCd: "SHIP_TYPE",
                    attrNm: "선박타입",
                    dtlNm: "Container",
                  },
                  { attrCd: "SHIP_SIZE", attrNm: "선박크기", dtlNm: "Large" },
                ],
                useYn: "Y",
                dtlOrderNum: 1,
              },
            ],
          },
          {
            grpCdType: "화물",
            grpCd: "CARGO",
            grpNm: "화물코드",
            comCodeInfo: [
              {
                dtlCd: "CARGO001",
                codeAttributes: [
                  {
                    attrCd: "CARGO_TYPE",
                    attrNm: "화물타입",
                    dtlNm: "General",
                  },
                  { attrCd: "DANGEROUS", attrNm: "위험물여부", dtlNm: "N" },
                ],
                useYn: "Y",
                dtlOrderNum: 1,
              },
            ],
          },
        ],
        page: 0,
        size: 2,
        totalElements: 2,
        totalPages: 1,
        first: true,
        last: true,
      };
      setCodeData(mockData);
      setLoading(false);
    });
  }, [fetchCodeData]);

  return {
    codeData,
    loading,
    error,
    refetch: fetchCodeData,
  };
};
