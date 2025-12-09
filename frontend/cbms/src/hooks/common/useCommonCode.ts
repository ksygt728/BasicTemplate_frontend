/**
 * @파일명 : useCommonCode.ts
 * @설명 : 공통코드 조회 및 관리를 위한 React Query + Redux 하이브리드 Hook
 * @작성자 : 김승연
 * @작성일 : 2025.12.09
 * @수정일 : 2025.12.09
 * @사용법 :
 *   const { getGrpCode, getAttrCode, getDtlCode, getSelectOptions } = useCommonCode();
 *   1. getGrpCode() // 전체 그룹명 리스트
 *   2. getGrpCode("APPROVAL_STATUS") // "승인상태"
 *   3. getAttrCode("APPROVAL_STATUS") // ["결재상태", "팀장급결재여부"]
 *   4. getAttrCode("APPROVAL_STATUS", "001") // "결재상태"
 *   5. getDtlCode("APPROVAL_STATUS", "001") // [상세코드 리스트] (useYn='Y'만)
 *   6. getDtlCode("APPROVAL_STATUS", "001", "AGREE") // "협의"
 *   7. getSelectOptions("APPROVAL_STATUS", "001") // Select용 옵션 배열
 */

"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { setCommonCodes, setError } from "@/store/slices/commonCodeSlice";
import { CodeApi } from "@/api/admin/codeApi";
import { transformCodeApiResponse } from "@/utils/codeUtils";
import type { CodeOption, CodeDetailWithAttributes } from "@/types/code.types";

const codeApi = CodeApi.getInstance();

/**
 * 공통코드 조회 함수 (React Query에서 사용)
 */
const fetchCommonCodes = async () => {
  try {
    const response = await codeApi.findAllCodeMWithConditions(
      {
        grpCdType: "",
        grpCd: "",
        grpNm: "",
      },
      0,
      2000
    );

    console.log("=== API 응답 전체 ===", response);
    console.log("response.success:", response.success);
    console.log("response.data:", response.data);
    console.log("response.data 타입:", typeof response.data);

    if (response.success && response.data) {
      return transformCodeApiResponse(response.data);
    }
    throw new Error(response.message || "공통코드 조회 실패");
  } catch (error) {
    console.error("공통코드 조회 에러:", error);
    throw error;
  }
};

/**
 * 공통코드 관리 Hook
 */
export const useCommonCode = () => {
  const dispatch = useDispatch();
  const commonCodeState = useSelector((state: RootState) => state.commonCode);

  // React Query로 데이터 조회 (Redux에 이미 로드되어 있으면 API 호출 안 함)
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["commonCodes"],
    queryFn: fetchCommonCodes,
    enabled: !commonCodeState.isLoaded, // Redux에 데이터가 없을 때만 실행
    staleTime: 1000 * 60 * 30, // 30분 (데이터가 신선한 상태로 유지되는 시간)
    gcTime: 1000 * 60 * 60, // 1시간 (캐시 유지 시간)
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재조회 안 함
    refetchOnMount: false, // 마운트 시 재조회 안 함
  });

  // React Query 데이터를 Redux에 동기화 (useEffect로 감싸서 렌더링 중 setState 방지)
  useEffect(() => {
    if (data && !commonCodeState.isLoaded) {
      dispatch(setCommonCodes(data));
    }
  }, [data, commonCodeState.isLoaded, dispatch]);

  // 에러를 Redux에 동기화 (useEffect로 감싸서 렌더링 중 setState 방지)
  useEffect(() => {
    if (error && !commonCodeState.error) {
      dispatch(setError(error.message));
    }
  }, [error, commonCodeState.error, dispatch]);

  // Redux의 데이터를 우선 사용
  const codes = commonCodeState.data || data;

  /**
   * 1️⃣ 그룹코드 조회
   * @param grpCd (선택) 그룹코드 - 없으면 전체 리스트, 있으면 해당 그룹명만
   * @returns 그룹명 또는 그룹명 배열
   * @example
   * getGrpCode() // ["승인상태", "자산상태", "부서유형", ...]
   * getGrpCode("APPROVAL_STATUS") // "승인상태"
   */
  const getGrpCode = (grpCd?: string): string | string[] => {
    if (!codes || !codes.groups || !Array.isArray(codes.groups)) {
      return grpCd ? "" : [];
    }

    // 특정 그룹코드의 그룹명 조회
    if (grpCd) {
      const group = codes.groups.find((g) => g.grpCd === grpCd);
      return group?.grpNm || "";
    }

    // 전체 그룹명 리스트 조회
    return codes.groups.map((g) => g.grpNm);
  };

  /**
   * 2️⃣ 속성코드 조회
   * @param grpCd 그룹코드 (필수)
   * @param attrCd (선택) 속성코드 - 없으면 전체 리스트, 있으면 해당 속성명만
   * @returns 속성명 또는 속성명 배열
   * @example
   * getAttrCode("APPROVAL_STATUS") // ["결재상태", "팀장급결재여부"]
   * getAttrCode("APPROVAL_STATUS", "001") // "결재상태"
   */
  const getAttrCode = (grpCd: string, attrCd?: string): string | string[] => {
    if (!codes) return attrCd ? "" : [];

    const attributes = codes.attributesByGroup[grpCd];
    if (!attributes || !Array.isArray(attributes)) return attrCd ? "" : [];

    // 특정 속성코드의 속성명 조회
    if (attrCd) {
      const attr = attributes.find((a) => a.attrCd === attrCd);
      return attr?.attrNm || "";
    }

    // 전체 속성명 리스트 조회 (정렬)
    return [...attributes]
      .sort((a, b) => (a.orderNum || 0) - (b.orderNum || 0))
      .map((a) => a.attrNm);
  };

  /**
   * 3️⃣ 상세코드 조회
   * @param grpCd 그룹코드 (필수)
   * @param attrCd 속성코드 (필수)
   * @param dtlCd (선택) 상세코드 - 없으면 해당 속성의 전체 리스트, 있으면 특정 상세명만
   * @returns 상세코드 객체 배열 또는 특정 상세명
   * @example
   * getDtlCode("APPROVAL_STATUS", "001") // [{dtlCd: "AGREE", dtlNm: "협의", ...}, ...]
   * getDtlCode("APPROVAL_STATUS", "001", "AGREE") // "협의"
   */
  const getDtlCode = (
    grpCd: string,
    attrCd: string,
    dtlCd?: string
  ): CodeDetailWithAttributes[] | string => {
    if (!codes) return dtlCd ? "" : [];

    const details = codes.detailsByGroup[grpCd];
    if (!details || !Array.isArray(details)) return dtlCd ? "" : [];

    // 특정 상세코드의 상세명 조회
    if (dtlCd) {
      const detail = details.find((d) => d.dtlCd === dtlCd);
      return detail?.[attrCd] || "";
    }

    // 해당 속성코드의 전체 상세코드 리스트 조회
    return [...details]
      .filter((d) => d.useYn === "Y" && d[attrCd]) // 사용중이고 해당 속성값이 있는 것만
      .sort((a, b) => (a.orderNum || 0) - (b.orderNum || 0))
      .map((d) => ({
        ...d,
        dtlNm: d[attrCd] || d.dtlNm, // 해당 속성코드의 값을 dtlNm으로 사용
      }));
  };

  /**
   * 📌 Select 컴포넌트 전용 - 상세코드를 옵션 배열로 변환
   * @param grpCd 그룹코드
   * @param attrCd 속성코드
   * @returns Select 컴포넌트용 옵션 배열 { value, label, disabled }
   * @example
   * getSelectOptions("APPROVAL_STATUS", "001") // [{value: "AGREE", label: "협의", disabled: false}, ...]
   */
  const getSelectOptions = (grpCd: string, attrCd: string): CodeOption[] => {
    const dtlCodes = getDtlCode(grpCd, attrCd);

    // getDtlCode는 useYn='Y'인 것만 반환하므로 추가 필터링 불필요
    if (!Array.isArray(dtlCodes)) return [];

    return dtlCodes.map((d) => ({
      value: d.dtlCd,
      label: d.dtlNm,
      disabled: false,
    }));
  };

  /**
   * 공통코드 전체 재조회
   */
  const refresh = () => {
    return refetch();
  };

  return {
    // 데이터 및 상태
    codes,
    isLoading: isLoading || !commonCodeState.isLoaded,
    error: error?.message || commonCodeState.error,
    isLoaded: commonCodeState.isLoaded,

    // ✅ 새로운 3대 핵심 함수
    getGrpCode, // 1️⃣ 그룹코드/그룹명 조회
    getAttrCode, // 2️⃣ 속성코드/속성명 조회
    getDtlCode, // 3️⃣ 상세코드/상세명 조회

    // 📌 Select 컴포넌트 전용 함수
    getSelectOptions,

    // 유틸리티
    refresh,
  };
};
