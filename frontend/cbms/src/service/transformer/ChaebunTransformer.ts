/**
 * @파일명 : ChaebunTransformer.ts
 * @설명 : 채번 데이터 변환 로직 (UI용)
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

import { ChaebunResDto } from "@/types/responseDto/ChaebunResDto";

/**
 * @function transformChaebunListToTableData
 * @description 채번 리스트를 테이블 데이터로 변환
 * @param {ChaebunResDto[]} chaebunList - 채번 리스트
 * @returns {Array<Record<string, any>>} 테이블용 데이터 배열
 */
export const transformChaebunListToTableData = (
  chaebunList: ChaebunResDto[]
): Array<Record<string, any>> => {
  if (!chaebunList || chaebunList.length === 0) {
    return [];
  }

  return chaebunList.map((chaebun) => ({
    seqId: chaebun.seqId,
    seqName: chaebun.seqName,
    pattern: chaebun.pattern,
    prefix: chaebun.prefix,
    currentValue: chaebun.currentValue,
    step: chaebun.step,
    length: chaebun.length,
    dateformat: chaebun.dateformat || "-",
  }));
};

/**
 * @function getChaebunTableColumns
 * @description 채번 테이블 컬럼 정보 반환
 * @returns {Array<any>} 테이블 컬럼 배열
 */
export const getChaebunTableColumns = () => {
  return [
    {
      key: "seqId",
      label: "채번 ID",
      width: 150,
      sortable: true,
      filterable: true,
    },
    {
      key: "seqName",
      label: "채번명",
      width: 200,
      sortable: true,
      filterable: true,
    },
    {
      key: "pattern",
      label: "패턴",
      width: 200,
      sortable: true,
      filterable: true,
    },
    {
      key: "prefix",
      label: "접두어",
      width: 120,
      sortable: true,
      filterable: true,
    },
    {
      key: "currentValue",
      label: "현재값",
      width: 100,
      sortable: true,
      filterable: false,
    },
    {
      key: "step",
      label: "증가량",
      width: 100,
      sortable: true,
      filterable: false,
    },
    {
      key: "length",
      label: "길이",
      width: 100,
      sortable: true,
      filterable: false,
    },
    {
      key: "dateformat",
      label: "날짜 포맷",
      width: 150,
      sortable: true,
      filterable: true,
    },
  ];
};
