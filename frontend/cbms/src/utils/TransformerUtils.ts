/**
 * @파일명 : UtilsMapper.tsx
 * @설명 : 제네릭 기반 Transformer 유틸리티
           API 응답 데이터를 UI 표시용으로 변환하는 공통 함수
 * @작성자 : 김승연
 * @작성일 : 2025.10.18
 * @변경이력 :
 *       2025.10.18 김승연 최초 생성 및 JavaDoc 주석 추가
 */

/**
 * 배열 데이터 변환 옵션
 *
 * @template TInput 입력 데이터 타입
 * @template TOutput 출력 데이터 타입
 */
export interface TransformOptions<TInput, TOutput> {
  /** 필터링 조건 */
  filter?: (item: TInput) => boolean;
  /** 중복 제거 여부 */
  deduplicate?: boolean;
  /** 중복 제거 시 사용할 키 */
  deduplicateKey?: keyof TOutput;
  /** 정렬 함수 */
  sort?: (a: TOutput, b: TOutput) => number;
}

/**
 * 배열 데이터를 변환하는 제네릭 Transformer 생성
 *
 * @template TInput 입력 데이터 타입
 * @template TOutput 출력 데이터 타입
 * @param {(item: TInput, index?: number, array?: TInput[]) => TOutput} transformFn 개별 항목 변환 함수
 * @param {TransformOptions<TInput, TOutput>} options 변환 옵션 (필터링, 중복제거, 정렬)
 * @returns {(data: TInput[]) => TOutput[]} 배열 변환 함수
 *
 * @example
 * const transformUsers = createArrayTransformer(
 *   (user: UserResDto) => ({
 *     id: user.userId,
 *     name: user.userName,
 *     email: user.email || ""
 *   }),
 *   {
 *     filter: (user) => user.status === "ACTIVE",
 *     deduplicate: true,
 *     deduplicateKey: "id"
 *   }
 * );
 */
export const createArrayTransformer = <TInput, TOutput>(
  transformFn: (item: TInput, index?: number, array?: TInput[]) => TOutput,
  options?: TransformOptions<TInput, TOutput>
) => {
  return (data: TInput[]): TOutput[] => {
    if (!data || !Array.isArray(data)) return [];

    let result = data;

    // 1. 필터링
    if (options?.filter) {
      result = result.filter(options.filter);
    }

    // 2. 변환
    const transformed = result.map(transformFn);

    // 3. 중복 제거
    let deduplicated = transformed;
    if (options?.deduplicate && options?.deduplicateKey) {
      const seen = new Set();
      deduplicated = transformed.filter((item) => {
        const key = item[options.deduplicateKey!];
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // 4. 정렬
    if (options?.sort) {
      return deduplicated.sort(options.sort);
    }

    return deduplicated;
  };
};

/**
 * 객체 데이터 변환
 *
 * @template TInput 입력 데이터 타입
 * @template TOutput 출력 데이터 타입
 * @param {(data: TInput) => TOutput} transformFn 변환 함수
 * @returns {(data: TInput | null | undefined) => TOutput | null} 안전한 변환 함수 (null 처리 포함)
 *
 * @example
 * const transformUser = createObjectTransformer(
 *   (user: UserResDto) => ({ id: user.userId, name: user.userName })
 * );
 */
export const createObjectTransformer = <TInput, TOutput>(
  transformFn: (data: TInput) => TOutput
) => {
  return (data: TInput | null | undefined): TOutput | null => {
    if (!data) return null;
    return transformFn(data);
  };
};

/**
 * 중첩된 배열 평탄화 및 변환
 *
 * @template TInput 부모 데이터 타입
 * @template TOutput 출력 데이터 타입
 * @param {(item: TInput) => any[]} extractArrayFn 중첩 배열 추출 함수
 * @param {(item: any, parent: TInput) => TOutput} transformFn 개별 항목 변환 함수
 * @param {TransformOptions<any, TOutput>} options 변환 옵션
 * @returns {(data: TInput[]) => TOutput[]} 평탄화된 배열 변환 함수
 *
 * @example
 * const transformer = createNestedArrayTransformer(
 *   (dept) => dept.employees,
 *   (emp, dept) => ({ empId: emp.id, deptName: dept.name }),
 *   { filter: (emp) => emp.status === "ACTIVE" }
 * );
 */
export const createNestedArrayTransformer = <TInput, TOutput>(
  extractArrayFn: (item: TInput) => any[],
  transformFn: (item: any, parent: TInput) => TOutput,
  options?: TransformOptions<any, TOutput>
) => {
  return (data: TInput[]): TOutput[] => {
    if (!data || !Array.isArray(data)) return [];

    // 중첩 배열 평탄화
    const flattened: TOutput[] = [];
    data.forEach((parent) => {
      const childArray = extractArrayFn(parent);
      if (childArray && Array.isArray(childArray)) {
        childArray.forEach((child) => {
          flattened.push(transformFn(child, parent));
        });
      }
    });

    // 필터링
    let result = flattened;
    if (options?.filter) {
      result = result.filter(options.filter as any);
    }

    // 중복 제거
    if (options?.deduplicate && options?.deduplicateKey) {
      const seen = new Set();
      result = result.filter((item) => {
        const key = item[options.deduplicateKey!];
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // 정렬
    if (options?.sort) {
      return result.sort(options.sort);
    }

    return result;
  };
};

/**
 * Map 기반 중복 제거 및 병합 Transformer
 *
 * @template TInput 입력 데이터 타입
 * @template TOutput 출력 데이터 타입
 * @template TKey 키 타입 (기본값: string)
 * @param {(item: TInput) => TOutput} transformFn 개별 항목 변환 함수
 * @param {(item: TInput) => TKey} getKeyFn 키 추출 함수
 * @param {(existing: TOutput, newItem: TOutput) => TOutput} mergeFn 중복 시 병합 함수 (선택)
 * @returns {(data: TInput[]) => TOutput[]} Map 기반 변환 함수
 *
 * @example
 * const transformer = createMapBasedTransformer(
 *   (user) => ({ id: user.userId, name: user.userName }),
 *   (user) => user.userId,
 *   (existing, newItem) => ({ ...existing, ...newItem }) // 중복 시 병합
 * );
 */
export const createMapBasedTransformer = <TInput, TOutput, TKey = string>(
  transformFn: (item: TInput) => TOutput,
  getKeyFn: (item: TInput) => TKey,
  mergeFn?: (existing: TOutput, newItem: TOutput) => TOutput
) => {
  return (data: TInput[]): TOutput[] => {
    if (!data || !Array.isArray(data)) return [];

    const map = new Map<TKey, TOutput>();

    data.forEach((item) => {
      const key = getKeyFn(item);
      const transformed = transformFn(item);

      if (map.has(key) && mergeFn) {
        // 이미 존재하면 병합
        const existing = map.get(key)!;
        map.set(key, mergeFn(existing, transformed));
      } else {
        // 없으면 추가
        map.set(key, transformed);
      }
    });

    return Array.from(map.values());
  };
};
