/**
 * @파일명 : CodeTransformer.ts
 * @설명 : 코드 관리 도메인의 UI 데이터 변환 트랜스포머
 * @작성자 : 김승연
 * @작성일 : 2025.12.01
 * @변경이력 :
 *       2025.12.01 김승연 최초 생성
 */

// ============================================================================
// API Response → 테이블 데이터 변환
// ============================================================================

/**
 * @function transformGroupData
 * @description API 응답 데이터를 그룹코드 테이블 데이터로 변환
 * @param {any} codeData - API 응답 데이터
 * @returns {Array} 그룹코드 테이블 데이터 배열
 */
export const transformGroupData = (codeData: any) => {
  if (!codeData?.content) return [];

  // 중복 제거를 위해 Map 사용
  const groupMap = new Map();
  codeData.content.forEach((item: any) => {
    const key = item.grpCd;
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        id: key,
        grpCdType: item.grpCdType,
        grpCd: item.grpCd,
        grpNm: item.grpNm,
      });
    }
  });

  return Array.from(groupMap.values());
};

/**
 * @function transformAttributeData
 * @description API 응답 데이터를 속성코드 테이블 데이터로 변환
 * @param {any} codeData - API 응답 데이터
 * @param {string | null} selectedGroupCd - 현재 선택된 그룹코드
 * @returns {Array} 속성코드 테이블 데이터 배열
 */
export const transformAttributeData = (
  codeData: any,
  selectedGroupCd: string | null
) => {
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
            id: `${selectedGroupCd}_attr_${attr.attrCd}`,
            attrCd: attr.attrCd,
            attrNm: attr.attrNm,
            orderNum: attr.attrOrderNum || 1,
          });
        }
      });
    }
  });

  return Array.from(attributesMap.values());
};

/**
 * @function transformDetailData
 * @description API 응답 데이터를 상세코드 테이블 데이터로 변환 (동적 속성 컬럼 포함)
 * @param {any} codeData - API 응답 데이터
 * @param {string | null} selectedGroupCd - 현재 선택된 그룹코드
 * @returns {Array} 상세코드 테이블 데이터 배열
 */
export const transformDetailData = (
  codeData: any,
  selectedGroupCd: string | null
) => {
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
        id: `${selectedGroupCd}_detail_${index}`,
        dtlCd: codeInfo.dtlCd,
        dtlNm: "",
        useYn: codeInfo.useYn || "",
        dtlOrderNum: codeInfo.dtlOrderNum || 0,
      };

      // codeAttributes를 동적 컬럼으로 추가
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
};
