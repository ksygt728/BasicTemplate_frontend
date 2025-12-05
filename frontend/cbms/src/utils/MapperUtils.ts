/**
 * @파일명 : UtilsMapper.tsx
 * @설명 : 제네릭 기반 Mapper 유틸리티, 모든 도메인에서 재사용 가능한 DTO 변환 함수
 * @작성자 : 김승연
 * @작성일 : 2025.10.18
 * @변경이력 :
 *       2025.10.18 김승연 최초 생성 및 JavaDoc 주석 추가
 */

/**
 * 필드 매핑 설정 타입
 *
 * @template TRow 소스 데이터 타입
 * @template TDto 변환 대상 DTO 타입
 * @template K DTO의 키 타입
 */
export type FieldMapping<TRow, TDto, K extends keyof TDto> = {
  /** 소스 필드명 또는 값 추출 함수 */
  source: keyof TRow | ((row: TRow) => any);
  /** 기본값 (source가 null/undefined일 때 사용) */
  defaultValue?: TDto[K];
  /** 값 변환 함수 */
  transform?: (value: any, row?: TRow) => TDto[K];
};

/**
 * 전체 필드 매핑 설정 타입
 *
 * @template TRow 소스 데이터 타입
 * @template TDto 변환 대상 DTO 타입
 */
export type FieldMappings<TRow, TDto> = {
  [K in keyof TDto]: FieldMapping<TRow, TDto, K>;
};

/**
 * 테이블 row 데이터를 DTO로 변환하는 제네릭 매퍼 생성
 *
 * @template TRow 소스 데이터 타입 (기본값: any)
 * @template TDto 변환 대상 DTO 타입 (기본값: any)
 * @param {FieldMappings<TRow, TDto>} fieldMappings 필드 매핑 설정 객체
 * @returns {(row: TRow) => TDto} row를 DTO로 변환하는 함수
 *
 * @example
 * const toUserDto = createRowMapper<any, UserReqDto>({
 *   userId: { source: "userId", defaultValue: "" },
 *   userName: { source: "userName", defaultValue: "" },
 *   age: { source: "age", defaultValue: 0, transform: (val) => Number(val) || 0 }
 * });
 *
 * const userDto = toUserDto({ userId: "U001", userName: "John", age: "25" });
 * // Result: { userId: "U001", userName: "John", age: 25 }
 */
export const createRowMapper = <TRow = any, TDto = any>(
  fieldMappings: FieldMappings<TRow, TDto>
) => {
  return (row: TRow): TDto => {
    const result = {} as TDto;

    for (const [dtoKey, mapping] of Object.entries(fieldMappings) as Array<
      [keyof TDto, FieldMapping<TRow, TDto, keyof TDto>]
    >) {
      let value: any;

      // source가 함수면 함수 실행, 아니면 필드값 가져오기
      if (typeof mapping.source === "function") {
        value = mapping.source(row);
      } else {
        value = row[mapping.source as keyof TRow];
      }

      // 값이 없으면 기본값 사용
      if (value === undefined || value === null) {
        value = mapping.defaultValue;
      }

      // transform 함수가 있으면 적용
      if (mapping.transform) {
        value = mapping.transform(value, row);
      }

      result[dtoKey] = value;
    }

    return result;
  };
};

/**
 * 여러 row를 일괄 변환하는 헬퍼
 *
 * @template TRow 소스 데이터 타입 (기본값: any)
 * @template TDto 변환 대상 DTO 타입 (기본값: any)
 * @param {(row: TRow) => TDto} rowMapper 단일 row 변환 함수
 * @returns {(rows: TRow[]) => TDto[]} row 배열을 DTO 배열로 변환하는 함수
 *
 * @example
 * const toUserDto = createRowMapper(...);
 * const batchMapper = createBatchMapper(toUserDto);
 * const userDtos = batchMapper([user1, user2, user3]);
 */
export const createBatchMapper = <TRow = any, TDto = any>(
  rowMapper: (row: TRow) => TDto
) => {
  return (rows: TRow[]): TDto[] => {
    return rows.map(rowMapper);
  };
};

/**
 * 조건부 매핑 헬퍼
 *
 * @template TRow 소스 데이터 타입 (기본값: any)
 * @template TDto 변환 대상 DTO 타입 (기본값: any)
 * @param {(row: TRow) => boolean} condition 조건 판단 함수
 * @param {(row: TRow) => TDto} trueMapper 조건이 true일 때 사용할 매퍼
 * @param {(row: TRow) => TDto} falseMapper 조건이 false일 때 사용할 매퍼
 * @returns {(row: TRow) => TDto} 조건에 따라 다른 매핑을 수행하는 함수
 *
 * @example
 * const mapper = createConditionalMapper(
 *   (row) => row.type === "admin",
 *   toAdminDto,
 *   toUserDto
 * );
 */
export const createConditionalMapper = <TRow = any, TDto = any>(
  condition: (row: TRow) => boolean,
  trueMapper: (row: TRow) => TDto,
  falseMapper: (row: TRow) => TDto
) => {
  return (row: TRow): TDto => {
    return condition(row) ? trueMapper(row) : falseMapper(row);
  };
};
