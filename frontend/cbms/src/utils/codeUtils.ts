import type {
  CodeOption,
  CodeDetailWithAttributes,
  CommonCodeData,
} from "@/types/code.types";
import type { ComCodeMResDto } from "@/types/responseDto/ComCodeMResDto";

/**
 * @파일명 : codeUtils.ts
 * @설명 : 공통코드 변환 유틸리티 함수
 * @작성자 : 김승연
 * @작성일 : 2025.12.09
 */

/**
 * API 응답 데이터를 CommonCodeData 형식으로 변환
 * @param apiResponse API에서 받은 원본 데이터
 * @returns 변환된 CommonCodeData
 */
export const transformCodeApiResponse = (apiResponse: any): CommonCodeData => {
  console.log("=== transformCodeApiResponse 시작 ===");
  console.log("API 응답 원본:", apiResponse);

  const groups: ComCodeMResDto[] = [];
  const detailsByGroup: { [grpCd: string]: CodeDetailWithAttributes[] } = {};
  const attributesByGroup: { [grpCd: string]: any[] } = {};

  // API 응답 구조: response.data.data.content
  const content = apiResponse?.data?.content || apiResponse?.content;

  if (!content) {
    console.log("⚠️ content가 없습니다. apiResponse:", apiResponse);
    return { groups, detailsByGroup, attributesByGroup };
  }

  console.log("content 배열 길이:", content.length);

  // 각 그룹코드별로 처리
  content.forEach((group: any) => {
    console.log("처리 중인 그룹:", group.grpCd, group);
    const grpCd = group.grpCd;

    // 그룹 정보 추가
    groups.push({
      grpCd: group.grpCd,
      grpCdType: group.grpCdType,
      grpNm: group.grpNm,
      comCodeTs: group.comCodeInfo?.[0]?.codeAttributes || [],
    });

    // 속성 정보 추가
    if (group.comCodeInfo?.[0]?.codeAttributes) {
      attributesByGroup[grpCd] = group.comCodeInfo[0].codeAttributes;
    }

    // 상세코드 정보 변환 (기존 CodeTransformer와 동일한 로직)
    const details: CodeDetailWithAttributes[] = [];
    if (group.comCodeInfo) {
      console.log(`${grpCd} comCodeInfo:`, group.comCodeInfo);

      // dtlCd가 있는 데이터만 필터링
      group.comCodeInfo
        .filter(
          (codeInfo: any) => codeInfo.dtlCd && codeInfo.dtlCd.trim() !== ""
        )
        .forEach((codeInfo: any, index: number) => {
          console.log(`  [${index}] codeInfo:`, codeInfo);

          const detail: CodeDetailWithAttributes = {
            dtlCd: codeInfo.dtlCd,
            dtlNm: "",
            useYn: codeInfo.useYn || "Y",
            orderNum: codeInfo.dtlOrderNum || index,
          };

          // codeAttributes를 동적 컬럼으로 추가
          if (codeInfo.codeAttributes) {
            codeInfo.codeAttributes.forEach((attr: any) => {
              if (attr.attrCd) {
                detail[attr.attrCd] = attr.dtlNm || "";
                // 첫 번째 속성의 dtlNm을 전체 dtlNm으로 사용
                if (!detail.dtlNm && attr.dtlNm) {
                  detail.dtlNm = attr.dtlNm;
                }
              }
            });
          }

          details.push(detail);
          console.log(`  [${index}] 변환된 detail:`, detail);
        });
    }

    detailsByGroup[grpCd] = details;
  });

  console.log("=== 변환 완료 ===");
  console.log("총 그룹 수:", groups.length);
  console.log("groups:", groups);
  console.log("detailsByGroup:", detailsByGroup);

  return { groups, detailsByGroup, attributesByGroup };
};

/**
 * 상세코드를 Select 옵션으로 변환
 * @param codes 상세코드 배열
 * @param valueField value로 사용할 필드 (기본: dtlCd)
 * @param labelField label로 사용할 필드 (기본: dtlNm)
 * @param includeInactive 사용하지 않는 코드 포함 여부 (기본: false)
 * @returns Select 컴포넌트용 옵션 배열
 */
export const codesToOptions = (
  codes: CodeDetailWithAttributes[],
  valueField: string = "dtlCd",
  labelField: string = "dtlNm",
  includeInactive: boolean = false
): CodeOption[] => {
  if (!codes) return [];

  return codes
    .filter((code) => includeInactive || code.useYn === "Y")
    .sort((a, b) => (a.orderNum || 0) - (b.orderNum || 0))
    .map((code) => ({
      value: code[valueField] || code.dtlCd,
      label: code[labelField] || code.dtlNm,
      disabled: code.useYn === "N",
    }));
};

/**
 * 코드값으로 코드명 찾기
 * @param codes 상세코드 배열
 * @param codeValue 찾을 코드값
 * @param valueField 비교할 필드 (기본: dtlCd)
 * @returns 코드명 (없으면 빈 문자열)
 */
export const getCodeLabel = (
  codes: CodeDetailWithAttributes[],
  codeValue: string,
  valueField: string = "dtlCd"
): string => {
  if (!codes || !codeValue) return "";

  const code = codes.find((c) => c[valueField] === codeValue);
  return code?.dtlNm || "";
};

/**
 * 특정 그룹의 모든 상세코드를 가져오기
 * @param data 공통코드 전체 데이터
 * @param grpCd 그룹코드
 * @param includeInactive 사용하지 않는 코드 포함 여부
 * @returns 상세코드 배열
 */
export const getCodesByGroup = (
  data: CommonCodeData | null,
  grpCd: string,
  includeInactive: boolean = false
): CodeDetailWithAttributes[] => {
  if (!data?.detailsByGroup[grpCd]) return [];

  const codes = data.detailsByGroup[grpCd];
  if (includeInactive) return codes;

  return codes.filter((code) => code.useYn === "Y");
};

/**
 * 여러 그룹코드의 상세코드를 한 번에 가져오기
 * @param data 공통코드 전체 데이터
 * @param grpCds 그룹코드 배열
 * @returns 그룹코드별 상세코드 맵
 */
export const getMultipleCodesByGroups = (
  data: CommonCodeData | null,
  grpCds: string[]
): { [grpCd: string]: CodeDetailWithAttributes[] } => {
  const result: { [grpCd: string]: CodeDetailWithAttributes[] } = {};

  grpCds.forEach((grpCd) => {
    result[grpCd] = getCodesByGroup(data, grpCd);
  });

  return result;
};
