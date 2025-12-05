"use client";

import BasicTableView from "@/components/common/table/BasicTableView";
import SearchForm, {
  SearchOption,
} from "@/components/common/searchForm/SearchForm";
import BasicFrame from "@/components/layout/frame/BasicFrame";
import TripleSplitFrame from "@/components/layout/frame/TripleSplitFrame";
import { useCodeApi } from "@/hooks/useCodeApi";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useAlert } from "@/contexts/AlertContext";

/**
 * @파일명 : page.tsx
 * @설명 : 공통 코드 관리 페이지 - 그룹코드, 속성코드, 상세코드를 관리하는 삼중 패널 구조
 * @작성자 : 김승연
 * @작성일 : 2025.10.18
 * @변경이력 :
 *       2025.10.18 김승연 최초 생성 및 JavaDoc 주석 추가
 */
export default function Home() {
  /**
   * @기능 Alert 훅 사용
   * @설명 전역 알림창 관리를 위한 훅
   */
  const { showAlert } = useAlert();

  /**
   * @기능 코드 관리 API 훅 사용
   * @설명 그룹코드, 속성코드, 상세코드 CRUD 작업을 위한 API 함수들과 상태 관리
   */
  const {
    codeData, // 전체 코드 데이터
    loading, // 로딩 상태
    error, // 에러 상태
    fetchCodeData, // 검색 API 함수
    refetch, // 데이터 새로고침 함수
    insertGroupCode, // 그룹코드 추가
    updateGroupCode, // 그룹코드 수정
    deleteGroupCode, // 그룹코드 삭제
    insertAttrCode, // 속성코드 추가
    updateAttrCode, // 속성코드 수정
    deleteAttrCode, // 속성코드 삭제
    insertDetailCode, // 상세코드 추가
    updateDetailCode, // 상세코드 수정
    deleteDetailCode, // 상세코드 삭제
  } = useCodeApi();

  /**
   * @상태 현재 선택된 그룹 코드
   * @설명 좌측 테이블에서 선택된 그룹 코드로, 우측 두 테이블의 데이터를 필터링하는 기준
   */
  const [selectedGroupCd, setSelectedGroupCd] = useState<string | null>(null);

  /**
   * @상태 검색 조건
   * @설명 SearchForm에서 입력받은 검색 조건들
   */
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});

  /**
   * @상태 SearchForm 데이터
   * @설명 SearchForm의 상태를 외부에서 관리하여 리렌더링 문제 해결
   */
  const [searchFormData, setSearchFormData] = useState<Record<string, any>>({});

  /**
   * @설정 검색 폼 옵션들
   * @설명 SearchForm 컴포넌트에서 사용할 검색 조건 옵션 정의
   */
  const searchOptions: SearchOption[] = useMemo(
    () => [
      {
        label: "그룹코드타입",
        value: "grpCdType",
        type: "text",
        placeholder: "그룹코드타입을 입력하세요",
      },
      {
        label: "그룹코드",
        value: "grpCd",
        type: "text",
        placeholder: "그룹코드를 입력하세요",
      },
      {
        label: "그룹명",
        value: "grpNm",
        type: "text",
        placeholder: "그룹명을 입력하세요",
      },
    ],
    []
  );

  /**
   * @기능 컴포넌트 초기화
   * @설명 컴포넌트 마운트 시 전체 코드 데이터를 로딩
   */
  useEffect(() => {
    refetch();
  }, [refetch]);

  /**
   * @기능 검색 처리 함수
   * @설명 SearchForm에서 전달받은 검색 조건으로 데이터를 조회
   * @param {Record<string, any>} searchData - 검색 조건 데이터
   */
  const handleSearch = async (searchData: Record<string, any>) => {
    console.log("검색 조건:", searchData);

    // 검색 조건 상태 저장
    setSearchParams(searchData);

    // 실제 검색 API 호출
    try {
      // SearchForm 데이터를 CodeSearchFormReqDto로 변환
      const searchForm: any = {};

      // 그룹코드타입
      if (searchData.grpCdType && searchData.grpCdType.trim() !== "") {
        searchForm.grpCdType = searchData.grpCdType;
      }

      // 그룹코드
      if (searchData.grpCd && searchData.grpCd.trim() !== "") {
        searchForm.grpCd = searchData.grpCd;
      }

      // 그룹명
      if (searchData.grpNm && searchData.grpNm.trim() !== "") {
        searchForm.grpNm = searchData.grpNm;
      }

      // 사용여부
      if (searchData.useYn && searchData.useYn.trim() !== "") {
        searchForm.useYn = searchData.useYn;
      }

      // 날짜 범위 처리
      if (searchData.regDate_start && searchData.regDate_end) {
        searchForm.startDate = searchData.regDate_start;
        searchForm.endDate = searchData.regDate_end;
      }

      console.log("변환된 검색 조건:", searchForm);

      // 실제 API 호출
      await fetchCodeData(searchForm, 0, 2000);

      // 검색 완료 알림 제거 - 불필요한 알림
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      showAlert({
        type: "error",
        title: "검색 실패",
        message: "검색 중 오류가 발생했습니다.",
      });
    }
  };

  /**
   * @기능 좌측 테이블 데이터 변환
   * @설명 API에서 가져온 원본 데이터를 그룹별로 중복 제거하여 좌측 테이블용 데이터로 변환
   * @returns {Array} 그룹코드별 고유 데이터 배열 (grpCdType, grpCd, grpNm)
   */
  const leftTableData = useMemo(() => {
    if (!codeData?.content) return [];

    // 중복 제거를 위해 Map 사용 - 같은 grpCd를 가진 항목들을 하나로 합침
    const groupMap = new Map();
    codeData.content.forEach((item: any) => {
      const key = item.grpCd;
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          id: key, // 테이블 행의 고유 식별자
          grpCdType: item.grpCdType, // 그룹코드 타입
          grpCd: item.grpCd, // 그룹코드 (Primary Key)
          grpNm: item.grpNm, // 그룹명
        });
      }
    });

    // API 검색 결과를 그대로 사용 (클라이언트 측 필터링 제거)
    return Array.from(groupMap.values());
  }, [codeData]);

  /**
   * @기능 우측 상단 테이블 데이터 변환 (속성 코드)
   * @설명 선택된 그룹의 comCodeInfo에서 codeAttributes를 추출하여 속성코드 테이블 데이터 생성
   * @param {string} selectedGroupCd - 현재 선택된 그룹코드
   * @returns {Array} 속성코드 데이터 배열 (attrCd, attrNm, orderNum)
   */
  const rightTopTableData = useMemo(() => {
    if (!selectedGroupCd || !codeData?.content) return [];

    // 선택된 그룹 찾기
    const selectedGroup = codeData.content.find(
      (item: any) => item.grpCd === selectedGroupCd
    );
    if (!selectedGroup?.comCodeInfo?.length) return [];

    // 모든 codeAttributes를 수집하여 중복 제거
    const attributesMap = new Map();

    selectedGroup.comCodeInfo.forEach((codeInfo: any) => {
      if (codeInfo.codeAttributes) {
        codeInfo.codeAttributes.forEach((attr: any) => {
          if (attr.attrCd && !attributesMap.has(attr.attrCd)) {
            attributesMap.set(attr.attrCd, {
              id: `${selectedGroupCd}_attr_${attr.attrCd}`, // 고유 식별자
              attrCd: attr.attrCd, // 속성코드 (Primary Key)
              attrNm: attr.attrNm, // 속성명
              orderNum: attr.attrOrderNum || 1, // 백엔드에서 추가된 attrOrderNum 사용
            });
          }
        });
      }
    });

    return Array.from(attributesMap.values());
  }, [selectedGroupCd, codeData]);

  /**
   * @기능 우측 하단 테이블 데이터 변환 (상세 코드)
   * @설명 선택된 그룹의 comCodeInfo에서 dtlCd가 있는 항목들을 상세코드 테이블 데이터로 변환
   * @param {string} selectedGroupCd - 현재 선택된 그룹코드
   * @returns {Array} 상세코드 데이터 배열 (dtlCd, dtlNm, useYn, dtlOrderNum + 동적 속성 컬럼들)
   */
  const rightBottomTableData = useMemo(() => {
    if (!selectedGroupCd || !codeData?.content) return [];

    // 선택된 그룹 찾기
    const selectedGroup = codeData.content.find(
      (item: any) => item.grpCd === selectedGroupCd
    );
    if (!selectedGroup?.comCodeInfo) return [];

    // dtlCd가 있는 데이터만 필터링하여 상세코드 테이블 데이터 생성
    return selectedGroup.comCodeInfo
      .filter((codeInfo: any) => codeInfo.dtlCd && codeInfo.dtlCd.trim() !== "")
      .map((codeInfo: any, index: number) => {
        const row: any = {
          id: `${selectedGroupCd}_detail_${index}`, // 고유 식별자
          dtlCd: codeInfo.dtlCd, // 상세코드 (Primary Key)
          dtlNm: "", // 상세명 (codeAttributes에서 추출)
          useYn: codeInfo.useYn || "", // 사용여부
          dtlOrderNum: codeInfo.dtlOrderNum || 0, // 정렬순서
        };

        // codeAttributes를 동적 컬럼으로 추가
        // 각 속성의 dtlNm 값을 해당 속성 컬럼의 값으로 사용
        if (codeInfo.codeAttributes) {
          codeInfo.codeAttributes.forEach((attr: any) => {
            if (attr.attrCd) {
              row[attr.attrCd] = attr.dtlNm || "";
              // 첫 번째 속성의 dtlNm을 전체 dtlNm으로 사용
              if (!row.dtlNm && attr.dtlNm) {
                row.dtlNm = attr.dtlNm;
              }
            }
          });
        }

        return row;
      });
  }, [selectedGroupCd, codeData]);

  /**
   * @컬럼정의 좌측 테이블 컬럼 정의 (그룹코드)
   * @설명 그룹코드 관리 테이블의 컬럼 구조 정의
   * - grpCdType: 그룹코드타입 (편집 가능, 필수)
   * - grpCd: 그룹코드 (편집 불가 - Primary Key, 필수)
   * - grpNm: 그룹명 (편집 가능, 선택)
   */
  const leftTableColumns = [
    {
      key: "grpCdType",
      label: "그룹코드타입",
      width: 100,
      sortable: true,
      editable: true, // 편집 가능
      type: "text",
      required: true, // 필수 입력 필드
    },
    {
      key: "grpCd",
      label: "그룹코드",
      width: 120,
      sortable: true,
      editable: false, // 편집 불가 (Primary Key)
      type: "text",
      required: true, // 필수 입력 필드
    },
    {
      key: "grpNm",
      label: "그룹명",
      width: 150,
      sortable: true,
      editable: true, // 편집 가능
      type: "text",
      required: true, // 선택적 필드
    },
  ];

  /**
   * @컬럼정의 우측 상단 테이블 컬럼 정의 (속성코드)
   * @설명 속성코드 관리 테이블의 컬럼 구조 정의
   * - attrCd: 속성코드 (편집 불가 - Primary Key, 필수)
   * - attrNm: 속성명 (편집 가능, 선택)
   * - orderNum: 정렬순서 (편집 가능, 필수)
   */
  const rightTopTableColumns = [
    {
      key: "attrCd",
      label: "속성코드",
      width: 120,
      sortable: true,
      editable: false, // 편집 불가 (Primary Key)
      type: "text",
      required: true, // 필수 입력 필드
    },
    {
      key: "attrNm",
      label: "속성명",
      width: 200,
      sortable: true,
      editable: true, // 편집 가능
      type: "text",
      required: true, // 선택적 필드
    },
    {
      key: "orderNum",
      label: "정렬순서",
      width: 100,
      sortable: true,
      editable: true, // 편집 가능
      type: "number",
      required: true, // 필수 입력 필드
    },
  ];

  /**
   * @컬럼정의 우측 하단 테이블 컬럼 정의 (상세코드) - 동적 컬럼 생성
   * @설명 상세코드 관리 테이블의 컬럼 구조를 동적으로 생성
   * @구조 [고정 시작 컬럼] + [동적 속성 컬럼들] + [고정 끝 컬럼]
   * - 고정 시작: dtlCd(상세코드), dtlNm(상세명)
   * - 동적 속성: 선택된 그룹의 속성들을 컬럼으로 추가
   * - 고정 끝: useYn(사용여부), dtlOrderNum(정렬순서)
   */
  const rightBottomTableColumns = useMemo(() => {
    /**
     * @컬럼구조 1단계: 고정 시작 컬럼들 정의
     * @설명 테이블 좌측에 고정되는 기본 컬럼들
     */
    const fixedStartColumns = [
      {
        key: "dtlCd",
        label: "상세코드",
        width: 100,
        sortable: true,
        editable: false, // 편집 불가 (Primary Key)
        type: "text",
        required: true, // 필수 입력 필드
      },
      // {
      //   key: "dtlNm",
      //   label: "상세명",
      //   width: 150,
      //   sortable: true,
      //   editable: true, // 편집 가능
      //   type: "text",
      //   required: false, // 선택적 필드
      // },
    ];

    /**
     * @컬럼구조 2단계: 동적 속성 컬럼들 생성
     * @설명 선택된 그룹의 속성 정보를 기반으로 동적 컬럼 생성
     * @알고리즘
     *   1. 선택된 그룹의 comCodeInfo에서 codeAttributes 추출
     *   2. 중복 제거를 위해 Map 사용
     *   3. 각 속성을 편집 가능한 텍스트 컬럼으로 생성
     */
    let dynamicColumns: any[] = [];
    if (selectedGroupCd && codeData?.content) {
      const selectedGroup = codeData.content.find(
        (item: any) => item.grpCd === selectedGroupCd
      );

      if (selectedGroup?.comCodeInfo?.length) {
        const attributesMap = new Map();
        selectedGroup.comCodeInfo.forEach((codeInfo: any) => {
          if (codeInfo.codeAttributes) {
            codeInfo.codeAttributes.forEach((attr: any) => {
              if (attr.attrCd && !attributesMap.has(attr.attrCd)) {
                attributesMap.set(attr.attrCd, {
                  key: attr.attrCd,
                  label: attr.attrNm || attr.attrCd, // 속성명 또는 속성코드
                  width: 120,
                  sortable: true,
                  editable: true, // 편집 가능
                  type: "text",
                  required: false, // 선택적 필드
                  attrOrderNum: attr.attrOrderNum || 999, // 정렬순서 저장 (기본값 999)
                });
              }
            });
          }
        });

        // attrOrderNum으로 정렬하여 동적 컬럼 배열 생성
        dynamicColumns = Array.from(attributesMap.values()).sort(
          (a, b) => a.attrOrderNum - b.attrOrderNum
        );
      }
    }

    /**
     * @컬럼구조 3단계: 고정 끝 컬럼들 정의
     * @설명 테이블 우측에 고정되는 공통 관리 컬럼들
     */
    const fixedEndColumns = [
      {
        key: "useYn",
        label: "사용여부",
        width: 80,
        sortable: true,
        editable: true, // 편집 가능
        type: "select",
        options: ["Y", "N"], // 드롭다운 옵션
        required: true, // 필수 입력 필드
      },
      {
        key: "dtlOrderNum",
        label: "정렬순서",
        width: 80,
        sortable: true,
        editable: true, // 편집 가능
        type: "number",
        required: true, // 필수 입력 필드
      },
    ];

    /**
     * @최종결과 컬럼 배열 조합
     * @구조 [고정 시작] + [동적 속성] + [고정 끝]
     * @예시 [상세코드, 상세명] + [속성1, 속성2, ...] + [사용여부, 정렬순서]
     */
    return [...fixedStartColumns, ...dynamicColumns, ...fixedEndColumns];
  }, [selectedGroupCd, codeData]);

  // ============================================================================
  // 이벤트 핸들러 함수들
  // ============================================================================

  /**
   * @기능 좌측 테이블 행 클릭 핸들러
   * @설명 그룹코드 선택 시 우측 두 테이블의 데이터 필터링을 위한 상태 설정
   * @param {Object} row - 클릭된 행 데이터
   */
  const handleLeftTableRowClick = (row: any) => {
    setSelectedGroupCd(row.grpCd);
  };

  // ============================================================================
  // 그룹코드 CRUD API 래퍼 함수들
  // ============================================================================

  /**
   * @기능 그룹코드 추가 처리
   * @설명 사용자 입력 데이터를 ComCodeMReqDto 형태로 변환하여 API 호출
   * @param {Object} rowData - 테이블에서 입력받은 행 데이터
   * @returns {Promise<Object>} API 호출 결과
   */
  const handleInsertGroupCode = async (rowData: any) => {
    // 테이블 입력 데이터를 API 요청 DTO 형태로 변환
    const comCodeM = {
      grpCdType: rowData.grpCdType, // 그룹코드타입
      grpCd: rowData.grpCd, // 그룹코드
      grpNm: rowData.grpNm, // 그룹명
    };

    const result = await insertGroupCode(comCodeM);
    if (result?.success) {
      refetch(); // 성공 시 전체 데이터 새로고침
    }
    return result;
  };

  /**
   * @기능 그룹코드 수정 처리
   * @설명 수정된 데이터를 ComCodeMReqDto 형태로 변환하여 API 호출
   * @param {string|number} id - 수정할 행의 식별자
   * @param {Object} rowData - 수정된 행 데이터
   * @returns {Promise<Object>} API 호출 결과
   */
  const handleUpdateGroupCode = async (id: string | number, rowData: any) => {
    // 테이블 수정 데이터를 API 요청 DTO 형태로 변환
    const comCodeM = {
      grpCdType: rowData.grpCdType,
      grpCd: typeof id === "string" ? id : rowData.grpCd, // ID 또는 데이터에서 grpCd 사용
      grpNm: rowData.grpNm,
    };

    const result = await updateGroupCode(comCodeM);
    if (result?.success) {
      refetch(); // 성공 시 전체 데이터 새로고침
    }
    return result;
  };

  /**
   * @기능 그룹코드 삭제 처리
   * @설명 선택된 그룹코드를 삭제하고 연관 상태 초기화
   * @param {string|number} id - 삭제할 그룹코드
   * @returns {Promise<Object>} API 호출 결과
   */
  const handleDeleteGroupCode = async (id: string | number) => {
    const grpCd = typeof id === "string" ? id : String(id);

    const result = await deleteGroupCode(grpCd);
    if (result?.success) {
      refetch(); // 성공 시 전체 데이터 새로고침

      // 삭제된 그룹이 현재 선택된 그룹이면 선택 해제
      if (selectedGroupCd === grpCd) {
        setSelectedGroupCd(null);
      }
    }
    return result;
  };

  // ============================================================================
  // 그룹코드 Bulk 작업 함수들
  // ============================================================================

  /**
   * @기능 그룹코드 일괄 복사 처리
   * @설명 선택된 그룹코드들을 편집 가능한 새 행으로 복사 (저장하지 않음)
   * @param {any[]} selectedRows - 복사할 행 데이터 배열
   * @returns {Promise<Object>} 처리 결과
   */
  const handleBulkCopyGroupCode = async (selectedRows: any[]) => {
    // BasicTableView 컴포넌트의 기본 복사 기능을 사용하여 편집 가능한 새 행 생성
    // API 호출 없이 클라이언트에서만 복사본 생성
    return { success: true };
  };

  /**
   * @기능 그룹코드 일괄 삭제 처리
   * @설명 선택된 그룹코드들을 일괄 삭제
   * @param {any[]} selectedRows - 삭제할 행 데이터 배열
   * @returns {Promise<Object>} API 호출 결과
   */
  const handleBulkDeleteGroupCode = async (selectedRows: any[]) => {
    try {
      for (const row of selectedRows) {
        const result = await deleteGroupCode(row.grpCd);
        if (!result?.success) {
          throw new Error(`그룹코드 ${row.grpCd} 삭제 실패`);
        }

        // 삭제된 그룹이 현재 선택된 그룹이면 선택 해제
        if (selectedGroupCd === row.grpCd) {
          setSelectedGroupCd(null);
        }
      }
      refetch(); // 성공 시 전체 데이터 새로고침
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  // ============================================================================
  // 속성코드 CRUD API 래퍼 함수들
  // ============================================================================

  /**
   * @기능 속성코드 추가 처리
   * @설명 사용자 입력 데이터를 ComCodeTReqDto 형태로 변환하여 API 호출
   * @param {Object} rowData - 테이블에서 입력받은 행 데이터
   * @returns {Promise<Object>} API 호출 결과
   * @전제조건 selectedGroupCd가 null이 아니어야 함
   */
  const handleInsertAttributeCode = async (rowData: any) => {
    // 그룹코드 선택 여부 확인
    if (!selectedGroupCd) {
      throw new Error("그룹 코드가 선택되지 않았습니다.");
    }

    // 테이블 입력 데이터를 API 요청 DTO 형태로 변환
    const comCodeT = {
      grpCd: selectedGroupCd, // 현재 선택된 그룹코드
      attrCd: rowData.attrCd, // 속성코드
      attrNm: rowData.attrNm || "", // 속성명
      orderNum: rowData.orderNum || 1, // 정렬순서 (기본값: 1)
    };

    const result = await insertAttrCode(comCodeT);
    if (result?.success) {
      refetch(); // 성공 시 전체 데이터 새로고침
    }
    return result;
  };

  /**
   * @기능 속성코드 수정 처리
   * @설명 수정된 데이터를 ComCodeTReqDto 형태로 변환하여 API 호출
   * @param {string|number} id - 수정할 행의 식별자
   * @param {Object} rowData - 수정된 행 데이터
   * @returns {Promise<Object>} API 호출 결과
   * @전제조건 selectedGroupCd가 null이 아니어야 함
   */
  const handleUpdateAttributeCode = async (
    id: string | number,
    rowData: any
  ) => {
    // 그룹코드 선택 여부 확인
    if (!selectedGroupCd) {
      throw new Error("그룹 코드가 선택되지 않았습니다.");
    }

    // 테이블 수정 데이터를 API 요청 DTO 형태로 변환
    const comCodeT = {
      grpCd: selectedGroupCd,
      attrCd: rowData.attrCd,
      attrNm: rowData.attrNm || "",
      orderNum: rowData.orderNum || 1,
    };

    const result = await updateAttrCode(comCodeT);
    if (result?.success) {
      refetch(); // 성공 시 전체 데이터 새로고침
    }
    return result;
  };

  /**
   * @기능 속성코드 삭제 처리
   * @설명 선택된 속성코드를 삭제
   * @param {string|number} id - 삭제할 행의 식별자
   * @returns {Promise<Object>} API 호출 결과
   * @전제조건 selectedGroupCd가 null이 아니어야 함
   */
  const handleDeleteAttributeCode = async (id: string | number) => {
    // 그룹코드 선택 여부 확인
    if (!selectedGroupCd) {
      throw new Error("그룹 코드가 선택되지 않았습니다.");
    }

    // 테이블 데이터에서 해당 ID의 속성코드 찾기
    const targetRow = rightTopTableData.find((row) => row.id === id);
    if (!targetRow?.attrCd) {
      throw new Error("삭제할 속성 코드를 찾을 수 없습니다.");
    }

    const result = await deleteAttrCode(selectedGroupCd, targetRow.attrCd);
    if (result?.success) {
      refetch(); // 성공 시 전체 데이터 새로고침
    }
    return result;
  };

  // ============================================================================
  // 속성코드 Bulk 작업 함수들
  // ============================================================================

  /**
   * @기능 속성코드 일괄 복사 처리
   * @설명 선택된 속성코드들을 편집 가능한 새 행으로 복사 (저장하지 않음)
   * @param {any[]} selectedRows - 복사할 행 데이터 배열
   * @returns {Promise<Object>} 처리 결과
   */
  const handleBulkCopyAttributeCode = async (selectedRows: any[]) => {
    if (!selectedGroupCd) {
      throw new Error("그룹 코드가 선택되지 않았습니다.");
    }

    // BasicTableView 컴포넌트의 기본 복사 기능을 사용하여 편집 가능한 새 행 생성
    // API 호출 없이 클라이언트에서만 복사본 생성
    return { success: true };
  };

  /**
   * @기능 속성코드 일괄 삭제 처리
   * @설명 선택된 속성코드들을 일괄 삭제
   * @param {any[]} selectedRows - 삭제할 행 데이터 배열
   * @returns {Promise<Object>} API 호출 결과
   */
  const handleBulkDeleteAttributeCode = async (selectedRows: any[]) => {
    if (!selectedGroupCd) {
      throw new Error("그룹 코드가 선택되지 않았습니다.");
    }

    try {
      for (const row of selectedRows) {
        const result = await deleteAttrCode(selectedGroupCd, row.attrCd);
        if (!result?.success) {
          throw new Error(`속성코드 ${row.attrCd} 삭제 실패`);
        }
      }
      refetch(); // 성공 시 전체 데이터 새로고침
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  // ============================================================================
  // 상세코드 CRUD API 래퍼 함수들
  // ============================================================================

  /**
   * @기능 상세코드 추가 처리
   * @설명 사용자 입력 데이터를 여러 개의 ComCodeDReqDto 배열로 변환하여 API 호출
   * @param {Object} rowData - 테이블에서 입력받은 행 데이터
   * @returns {Promise<Object>} API 호출 결과
   * @전제조건 selectedGroupCd가 null이 아니어야 함
   * @알고리즘 값이 있는 모든 동적 속성 컬럼에 대해 각각 API 호출
   */
  const handleInsertDetailCode = async (rowData: any) => {
    // 그룹코드 선택 여부 확인
    if (!selectedGroupCd) {
      throw new Error("그룹 코드가 선택되지 않았습니다.");
    }

    // 값이 있는 모든 동적 속성 컬럼 수집
    const validAttributes: Array<{ attrCd: string; dtlNm: string }> = [];

    if (rightTopTableData.length > 0) {
      rightTopTableData.forEach((attr) => {
        if (rowData[attr.attrCd] && rowData[attr.attrCd].trim() !== "") {
          validAttributes.push({
            attrCd: attr.attrCd,
            dtlNm: rowData[attr.attrCd],
          });
        }
      });
    }

    // 값이 있는 속성이 없으면 빈값으로 처리
    if (validAttributes.length === 0) {
      // 모든 속성에 대해 빈값으로 처리
      if (rightTopTableData.length > 0) {
        rightTopTableData.forEach((attr) => {
          validAttributes.push({
            attrCd: attr.attrCd,
            dtlNm: "", // 빈값으로 처리
          });
        });
      } else {
        // 속성이 없으면 기본 속성으로 빈값 처리
        validAttributes.push({
          attrCd: "DEFAULT",
          dtlNm: "",
        });
      }
    }

    // 각 속성에 대해 개별 API 호출
    const results = [];
    for (const attr of validAttributes) {
      const comCodeD = {
        grpCd: selectedGroupCd, // 현재 선택된 그룹코드
        attrCd: attr.attrCd, // 해당 속성코드
        dtlCd: rowData.dtlCd, // 상세코드
        dtlNm: attr.dtlNm, // 해당 속성의 상세명
        useYn: rowData.useYn || "Y", // 사용여부 (기본값: Y)
        orderNum: rowData.dtlOrderNum || 1, // 정렬순서 (기본값: 1)
      };

      const result = await insertDetailCode(comCodeD);
      results.push(result);
    }

    // 모든 API 호출이 성공했을 때만 refetch
    const allSuccess = results.every((result) => result?.success);
    if (allSuccess) {
      refetch(); // 성공 시 전체 데이터 새로고침
    }

    return { success: allSuccess, results };
  };

  /**
   * @기능 상세코드 수정 처리
   * @설명 수정된 데이터를 여러 개의 ComCodeDReqDto로 변환하여 API 호출
   * @param {string|number} id - 수정할 행의 식별자
   * @param {Object} rowData - 수정된 행 데이터
   * @returns {Promise<Object>} API 호출 결과
   * @전제조건 selectedGroupCd가 null이 아니어야 함
   * @알고리즘 값이 있는 모든 동적 속성 컬럼에 대해 각각 API 호출
   */
  const handleUpdateDetailCode = async (id: string | number, rowData: any) => {
    // 그룹코드 선택 여부 확인
    if (!selectedGroupCd) {
      await showAlert({
        type: "warning",
        title: "그룹 선택 필요",
        message:
          "그룹 코드가 선택되지 않았습니다. 먼저 좌측에서 그룹을 선택해주세요.",
      });
      return;
    }

    // 값이 있는 모든 동적 속성 컬럼 수집
    const validAttributes: Array<{ attrCd: string; dtlNm: string }> = [];

    if (rightTopTableData.length > 0) {
      rightTopTableData.forEach((attr) => {
        if (rowData[attr.attrCd] && rowData[attr.attrCd].trim() !== "") {
          validAttributes.push({
            attrCd: attr.attrCd,
            dtlNm: rowData[attr.attrCd],
          });
        }
      });
    }

    // 값이 있는 속성이 없으면 빈값으로 처리
    if (validAttributes.length === 0) {
      // 모든 속성에 대해 빈값으로 처리
      if (rightTopTableData.length > 0) {
        rightTopTableData.forEach((attr) => {
          validAttributes.push({
            attrCd: attr.attrCd,
            dtlNm: "", // 빈값으로 처리
          });
        });
      } else {
        // 속성이 없으면 기본 속성으로 빈값 처리
        validAttributes.push({
          attrCd: "DEFAULT",
          dtlNm: "",
        });
      }
    }

    // 각 속성에 대해 개별 API 호출
    const results = [];
    for (const attr of validAttributes) {
      const comCodeD = {
        grpCd: selectedGroupCd as string,
        attrCd: attr.attrCd, // 해당 속성코드
        dtlCd: rowData.dtlCd,
        dtlNm: attr.dtlNm, // 해당 속성의 상세명
        useYn: rowData.useYn || "Y",
        orderNum: rowData.dtlOrderNum || 1,
      };

      const result = await updateDetailCode(comCodeD);
      results.push(result);
    }

    // 모든 API 호출이 성공했을 때만 refetch
    const allSuccess = results.every((result) => result?.success);
    if (allSuccess) {
      refetch(); // 성공 시 전체 데이터 새로고침
    }

    return { success: allSuccess, results };
  };

  /**
   * @기능 상세코드 삭제 처리
   * @설명 선택된 상세코드를 삭제하기 위해 원본 데이터에서 속성코드를 찾아 API 호출
   * @param {string|number} id - 삭제할 행의 식별자
   * @returns {Promise<Object>} API 호출 결과
   * @전제조건 selectedGroupCd가 null이 아니어야 함
   * @알고리즘
   *   1. 테이블에서 삭제할 상세코드 찾기
   *   2. 원본 데이터에서 해당 상세코드의 속성정보 찾기
   *   3. 첫 번째 속성의 attrCd 추출
   *   4. API 호출 (grpCd, attrCd, dtlCd)
   */
  const handleDeleteDetailCode = async (id: string | number) => {
    // 그룹코드 선택 여부 확인
    if (!selectedGroupCd) {
      throw new Error("그룹 코드가 선택되지 않았습니다.");
    }

    // 1. 테이블 데이터에서 삭제할 상세코드 찾기
    const targetRow = rightBottomTableData.find((row) => row.id === id);
    if (!targetRow?.dtlCd) {
      throw new Error("삭제할 상세 코드를 찾을 수 없습니다.");
    }

    // 2. 원본 데이터에서 선택된 그룹 찾기
    const selectedGroup = codeData?.content?.find(
      (item: any) => item.grpCd === selectedGroupCd
    );
    if (!selectedGroup?.comCodeInfo) {
      throw new Error("그룹 데이터를 찾을 수 없습니다.");
    }

    // 3. 해당 상세코드의 속성 정보 찾기
    const targetCodeInfo = selectedGroup.comCodeInfo.find(
      (codeInfo: any) => codeInfo.dtlCd === targetRow.dtlCd
    );
    if (!targetCodeInfo?.codeAttributes?.length) {
      throw new Error("해당 상세 코드의 속성 정보를 찾을 수 없습니다.");
    }

    // 4. 첫 번째 속성의 attrCd 추출 (일반적으로 상세코드는 하나의 속성에 속함)
    const attrCd = targetCodeInfo.codeAttributes[0].attrCd;
    if (!attrCd) {
      throw new Error("속성 코드를 찾을 수 없습니다.");
    }

    // 5. API 호출: 상세코드 삭제
    const result = await deleteDetailCode(
      selectedGroupCd, // 그룹코드
      attrCd, // 속성코드
      targetRow.dtlCd // 상세코드
    );
    if (result?.success) {
      refetch(); // 성공 시 전체 데이터 새로고침
    }
    return result;
  };

  // ============================================================================
  // 상세코드 Bulk 작업 함수들
  // ============================================================================

  /**
   * @기능 상세코드 일괄 복사 처리
   * @설명 선택된 상세코드들을 편집 가능한 새 행으로 복사 (저장하지 않음)
   * @param {any[]} selectedRows - 복사할 행 데이터 배열
   * @returns {Promise<Object>} 처리 결과
   */
  const handleBulkCopyDetailCode = async (selectedRows: any[]) => {
    if (!selectedGroupCd) {
      throw new Error("그룹 코드가 선택되지 않았습니다.");
    }

    // BasicTableView 컴포넌트의 기본 복사 기능을 사용하여 편집 가능한 새 행 생성
    // API 호출 없이 클라이언트에서만 복사본 생성
    return { success: true };
  };

  /**
   * @기능 상세코드 일괄 삭제 처리
   * @설명 선택된 상세코드들을 일괄 삭제
   * @param {any[]} selectedRows - 삭제할 행 데이터 배열
   * @returns {Promise<Object>} API 호출 결과
   */
  const handleBulkDeleteDetailCode = async (selectedRows: any[]) => {
    if (!selectedGroupCd) {
      throw new Error("그룹 코드가 선택되지 않았습니다.");
    }

    try {
      for (const row of selectedRows) {
        // 원본 데이터에서 선택된 그룹 찾기
        const selectedGroup = codeData?.content?.find(
          (item: any) => item.grpCd === selectedGroupCd
        );

        if (selectedGroup?.comCodeInfo) {
          const targetCodeInfo = selectedGroup.comCodeInfo.find(
            (codeInfo: any) => codeInfo.dtlCd === row.dtlCd
          );

          if (targetCodeInfo?.codeAttributes?.length) {
            // 첫 번째 속성의 attrCd 추출
            const attrCd = targetCodeInfo.codeAttributes[0].attrCd;

            if (attrCd) {
              // null 체크 추가
              const result = await deleteDetailCode(
                selectedGroupCd,
                attrCd,
                row.dtlCd
              );
              if (!result?.success) {
                throw new Error(`상세코드 ${row.dtlCd} 삭제 실패`);
              }
            }
          }
        }
      }
      refetch(); // 성공 시 전체 데이터 새로고침
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  // ============================================================================
  // 조건부 렌더링 처리
  // ============================================================================

  // /**
  //  * @화면처리 로딩 상태 UI
  //  * @설명 API 호출 중일 때 표시되는 로딩 화면
  //  */
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-full">로딩 중...</div>
  //   );
  // }

  // /**
  //  * @화면처리 에러 상태 UI
  //  * @설명 API 호출 실패 시 표시되는 에러 화면 및 재시도 버튼
  //  */
  // if (error) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-full gap-4">
  //       <div className="text-red-500">에러: {error}</div>
  //       <button
  //         onClick={() => refetch()}
  //         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  //       >
  //         다시 시도
  //       </button>
  //     </div>
  //   );
  // }

  // ============================================================================
  // 메인 UI 렌더링
  // ============================================================================

  /**
   * @화면구조 삼중 패널 레이아웃
   * @설명
   *   - 좌측: 그룹코드 관리 테이블
   *   - 우측 상단: 속성코드 관리 테이블 (선택된 그룹의 속성들)
   *   - 우측 하단: 상세코드 관리 테이블 (선택된 그룹의 상세코드들 + 동적 속성 컬럼들)
   * @데이터흐름 좌측 그룹 선택 → 우측 두 테이블 필터링
   */
  // 좌측 패널: 검색폼 + 그룹코드 관리 테이블 컴포넌트
  const leftPanelContent = (
    <div className="space-y-4">
      {/* 검색 폼 */}
      <SearchForm
        key="code-search-form"
        searchOptions={searchOptions}
        onSearch={handleSearch}
        loading={loading}
        className="mb-4"
        searchData={searchFormData}
        onSearchDataChange={setSearchFormData}
      />

      {/* 그룹코드 관리 테이블 */}
      <BasicTableView
        columns={leftTableColumns}
        data={leftTableData}
        title="코드 그룹 관리"
        subTitle="그룹코드"
        description="시스템에서 사용하는 공통 코드 그룹 목록입니다."
        onRowClick={handleLeftTableRowClick}
        onInsert={handleInsertGroupCode}
        onUpdate={handleUpdateGroupCode}
        onDelete={handleDeleteGroupCode}
        onBulkCopy={handleBulkCopyGroupCode}
        onBulkDelete={handleBulkDeleteGroupCode}
      />
    </div>
  );

  // 우측 상단 패널: 속성코드 관리 테이블 컴포넌트
  const rightTopPanelContent = (
    <BasicTableView
      columns={rightTopTableColumns}
      data={rightTopTableData}
      title={selectedGroupCd ? `${selectedGroupCd} - 속성 정보` : "속성 정보"}
      subTitle="속성 코드"
      description={
        selectedGroupCd
          ? `${selectedGroupCd} 그룹의 속성 정보입니다.`
          : "좌측에서 그룹을 선택하면 속성 정보가 표시됩니다."
      }
      onInsert={selectedGroupCd ? handleInsertAttributeCode : undefined}
      onUpdate={selectedGroupCd ? handleUpdateAttributeCode : undefined}
      onDelete={selectedGroupCd ? handleDeleteAttributeCode : undefined}
      onBulkCopy={selectedGroupCd ? handleBulkCopyAttributeCode : undefined}
      onBulkDelete={selectedGroupCd ? handleBulkDeleteAttributeCode : undefined}
    />
  );

  // 우측 하단 패널: 상세코드 관리 테이블 컴포넌트
  const rightBottomPanelContent = (
    <BasicTableView
      columns={rightBottomTableColumns}
      data={rightBottomTableData}
      title={selectedGroupCd ? `${selectedGroupCd} - 상세 코드` : "상세 코드"}
      subTitle="상세 코드"
      description={
        selectedGroupCd
          ? `${selectedGroupCd} 그룹의 상세 코드 목록입니다.`
          : "좌측에서 그룹을 선택하면 상세 코드가 표시됩니다."
      }
      onInsert={selectedGroupCd ? handleInsertDetailCode : undefined}
      onUpdate={selectedGroupCd ? handleUpdateDetailCode : undefined}
      onDelete={selectedGroupCd ? handleDeleteDetailCode : undefined}
      onBulkCopy={selectedGroupCd ? handleBulkCopyDetailCode : undefined}
      onBulkDelete={selectedGroupCd ? handleBulkDeleteDetailCode : undefined}
    />
  );

  return (
    <TripleSplitFrame
      leftContent={leftPanelContent}
      rightTopContent={rightTopPanelContent}
      rightBottomContent={rightBottomPanelContent}
    />
  );
}
