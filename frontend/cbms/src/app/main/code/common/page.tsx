"use client";

import BasicTableView from "@/components/common/table/BasicTableView";
import BasicFrame from "@/components/layout/frame/BasicFrame";
import TripleSplitFrame from "@/components/layout/frame/TripleSplitFrame";
import { useCodeApi } from "@/hooks/useCodeApi";
import { useState, useMemo } from "react";
import Image from "next/image";

export default function Home() {
  const { codeData, loading, error, refetch } = useCodeApi();
  const [selectedGroupCd, setSelectedGroupCd] = useState<string | null>(null);

  // 좌측 테이블 데이터 (API에서 가져온 데이터를 그룹별로 변환)
  const leftTableData = useMemo(() => {
    if (!codeData?.content) return [];

    // 중복 제거를 위해 Map 사용
    const groupMap = new Map();
    codeData.content.forEach((item: any) => {
      const key = item.grpCd;
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          id: key, // 고유 ID로 사용
          grpCdType: item.grpCdType,
          grpCd: item.grpCd,
          grpNm: item.grpNm,
        });
      }
    });

    return Array.from(groupMap.values());
  }, [codeData]);

  // 선택된 그룹의 속성 데이터 (comCodeInfo의 codeAttributes에서 추출)
  const rightTopTableData = useMemo(() => {
    if (!selectedGroupCd || !codeData?.content) return [];

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
              id: `${selectedGroupCd}_attr_${attr.attrCd}`,
              attrCd: attr.attrCd,
              attrNm: attr.attrNm,
            });
          }
        });
      }
    });

    return Array.from(attributesMap.values());
  }, [selectedGroupCd, codeData]);

  // 선택된 그룹의 상세 코드 데이터
  const rightBottomTableData = useMemo(() => {
    if (!selectedGroupCd || !codeData?.content) return [];

    const selectedGroup = codeData.content.find(
      (item: any) => item.grpCd === selectedGroupCd
    );
    if (!selectedGroup?.comCodeInfo) return [];

    // dtlCd가 있는 데이터만 필터링
    return selectedGroup.comCodeInfo
      .filter((codeInfo: any) => codeInfo.dtlCd && codeInfo.dtlCd.trim() !== "")
      .map((codeInfo: any, index: number) => {
        const row: any = {
          id: `${selectedGroupCd}_detail_${index}`,
          dtlCd: codeInfo.dtlCd,
          useYn: codeInfo.useYn || "",
          dtlOrderNum: codeInfo.dtlOrderNum || 0,
        };

        // codeAttributes를 컬럼으로 추가 (dtlNm 값을 각 속성 컬럼의 값으로 사용)
        if (codeInfo.codeAttributes) {
          codeInfo.codeAttributes.forEach((attr: any) => {
            if (attr.attrCd) {
              row[attr.attrCd] = attr.dtlNm || "";
            }
          });
        }

        return row;
      });
  }, [selectedGroupCd, codeData]);

  // 좌측 테이블 컬럼 정의
  const leftTableColumns = [
    { key: "grpCdType", label: "그룹코드타입", width: 100, sortable: true },
    { key: "grpCd", label: "그룹코드", width: 120, sortable: true },
    { key: "grpNm", label: "그룹명", width: 150, sortable: true },
  ];

  // 우측 상단 테이블 컬럼 정의 (codeAttributes)
  const rightTopTableColumns = [
    { key: "attrCd", label: "속성코드", width: 120, sortable: true },
    { key: "attrNm", label: "속성명", width: 200, sortable: true },
  ];

  // 우측 하단 테이블 컬럼 정의 (상세코드 → 속성정보들 → 사용여부 → 정렬순서)
  const rightBottomTableColumns = useMemo(() => {
    // 1. 상세코드 컬럼 (고정)
    const fixedStartColumns = [
      { key: "dtlCd", label: "상세코드", width: 100, sortable: true },
    ];

    // 2. 동적 속성 컬럼들 (우측 상단에서 정의한 속성들)
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
                  label: attr.attrNm || attr.attrCd,
                  width: 120,
                  sortable: true,
                });
              }
            });
          }
        });

        dynamicColumns = Array.from(attributesMap.values());
      }
    }

    // 3. 고정 끝 컬럼들 (사용여부, 정렬순서)
    const fixedEndColumns = [
      { key: "useYn", label: "사용여부", width: 80, sortable: true },
      { key: "dtlOrderNum", label: "정렬순서", width: 80, sortable: true },
    ];

    // 최종 컬럼 순서: 상세코드 → 속성정보들 → 사용여부 → 정렬순서
    return [...fixedStartColumns, ...dynamicColumns, ...fixedEndColumns];
  }, [selectedGroupCd, codeData]);

  // 행 클릭 핸들러
  const handleLeftTableRowClick = (row: any) => {
    setSelectedGroupCd(row.grpCd);
  };

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">로딩 중...</div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-red-500">에러: {error}</div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <TripleSplitFrame
      leftContent={
        <BasicTableView
          columns={leftTableColumns}
          data={leftTableData}
          title="코드 그룹 관리"
          subTitle="그뤂코드"
          description="시스템에서 사용하는 공통 코드 그룹 목록입니다."
          onRowClick={handleLeftTableRowClick}
        />
      }
      rightTopContent={
        <BasicTableView
          columns={rightTopTableColumns}
          data={rightTopTableData}
          title={
            selectedGroupCd ? `${selectedGroupCd} - 속성 정보` : "속성 정보"
          }
          subTitle="속성 코드"
          description={
            selectedGroupCd
              ? `${selectedGroupCd} 그룹의 속성 정보입니다.`
              : "좌측에서 그룹을 선택하면 속성 정보가 표시됩니다."
          }
        />
      }
      rightBottomContent={
        <BasicTableView
          columns={rightBottomTableColumns}
          data={rightBottomTableData}
          title={
            selectedGroupCd ? `${selectedGroupCd} - 상세 코드` : "상세 코드"
          }
          subTitle="상세 코드"
          description={
            selectedGroupCd
              ? `${selectedGroupCd} 그룹의 상세 코드 목록입니다.`
              : "좌측에서 그룹을 선택하면 상세 코드가 표시됩니다."
          }
        />
      }
    />
  );
}
