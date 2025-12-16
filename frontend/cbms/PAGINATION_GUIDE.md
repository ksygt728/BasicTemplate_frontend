# 페이지네이션 가이드

## 개요

본 프로젝트에서는 백엔드 페이지네이션을 활용한 재사용 가능한 Pagination 컴포넌트를 제공합니다.

## Pagination 컴포넌트

### 위치

- `/src/components/common/themed/Pagination.tsx`

### 특징

- 백엔드의 Pageable 객체와 완벽하게 호환
- 백엔드 응답의 `first`, `last` 플래그를 활용한 버튼 상태 제어
- 페이지 크기 선택 기능 (10, 25, 50, 100)
- 0-based 페이지 인덱스 사용 (백엔드와 동일)

### Props

| Prop             | Type                   | Required | Description                      |
| ---------------- | ---------------------- | -------- | -------------------------------- |
| currentPage      | number                 | Yes      | 현재 페이지 번호 (0-based)       |
| pageSize         | number                 | Yes      | 페이지당 항목 수                 |
| totalElements    | number                 | Yes      | 전체 항목 수                     |
| totalPages       | number                 | Yes      | 전체 페이지 수                   |
| first            | boolean                | Yes      | 첫 페이지 여부 (백엔드 제공)     |
| last             | boolean                | Yes      | 마지막 페이지 여부 (백엔드 제공) |
| onPageChange     | (page: number) => void | Yes      | 페이지 변경 콜백                 |
| onPageSizeChange | (size: number) => void | Yes      | 페이지 크기 변경 콜백            |

## 백엔드 페이지네이션 구현 가이드

### 1. API Hook 구현

```typescript
// hooks/admin/useYourApi.ts
export const useYourApi = () => {
  const fetchData = useCallback(
    async (searchDto: YourSearchReqDto, pageable: Pageable) => {
      return api.fetchData(searchDto, pageable);
    },
    []
  );

  return {
    data,
    loading,
    error,
    fetchData,
    // ...
  };
};
```

### 2. Service Layer 구현

```typescript
// service/YourService.ts
export const useYourService = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(100);

  // 백엔드 페이지네이션 정보 추출
  const totalElements = useMemo(() => data?.totalElements || 0, [data]);
  const totalPages = useMemo(() => data?.totalPages || 0, [data]);
  const first = useMemo(() => data?.first ?? true, [data]);
  const last = useMemo(() => data?.last ?? true, [data]);

  // 검색 시 페이지 초기화
  const handleSearch = useCallback(
    async (searchData: SearchFormData) => {
      setCurrentPage(0);
      const pageable: Pageable = {
        page: 0,
        size: pageSize,
        sort: "yourSortField",
        direction: "DESC",
      };
      await fetchData(searchDto, pageable);
    },
    [fetchData, pageSize]
  );

  // 페이지 변경
  const handlePageChange = useCallback(
    async (page: number) => {
      setCurrentPage(page);
      const pageable: Pageable = {
        page: page,
        size: pageSize,
        sort: "yourSortField",
        direction: "DESC",
      };
      await fetchData(searchDto, pageable);
    },
    [searchFormData, pageSize, fetchData]
  );

  // 페이지 크기 변경
  const handlePageSizeChange = useCallback(
    async (size: number) => {
      setPageSize(size);
      setCurrentPage(0);
      const pageable: Pageable = {
        page: 0,
        size: size,
        sort: "yourSortField",
        direction: "DESC",
      };
      await fetchData(searchDto, pageable);
    },
    [searchFormData, fetchData]
  );

  return {
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    first,
    last,
    handlePageChange,
    handlePageSizeChange,
    // ...
  };
};
```

### 3. Page 컴포넌트 구현

```tsx
// app/your-page/page.tsx
import { Pagination } from "@/components/common/themed/Pagination";

export default function YourPage() {
  const {
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    first,
    last,
    handlePageChange,
    handlePageSizeChange,
    // ...
  } = useYourService();

  return (
    <Card title="데이터 목록">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Table
          columns={columns}
          data={listData}
          // Table 자체 페이지네이션은 제거
        />

        {/* Pagination 컴포넌트 추가 */}
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalElements={totalElements}
          totalPages={totalPages}
          first={first}
          last={last}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </Card>
  );
}
```

## 백엔드 API 규격

### Request - Pageable 객체

```typescript
interface Pageable {
  page: number; // 페이지 번호 (0-based)
  size: number; // 페이지당 항목 수 (최대 100)
  sort: string; // 정렬 필드
  direction: "ASC" | "DESC"; // 정렬 방향
}
```

### Response - Page 객체

```typescript
interface PageResponse<T> {
  content: T[]; // 현재 페이지의 데이터 배열
  page: number; // 현재 페이지 번호 (0-based)
  size: number; // 페이지당 항목 수
  totalElements: number; // 전체 항목 수
  totalPages: number; // 전체 페이지 수
  first: boolean; // 첫 페이지 여부
  last: boolean; // 마지막 페이지 여부
}
```

## 적용된 페이지

### 1. 접속 로그 관리 (/main/admin/system/access)

- **파일**:
  - `/src/hooks/admin/useLogApi.ts`
  - `/src/service/LogApiService.ts`
  - `/src/app/main/admin/system/access/page.tsx`
- **페이지 크기**: 100
- **정렬**: endDate DESC
- **특징**:
  - 검색 조건: userId, logId, requestUri, httpMethod, ipAddr, startDate, endDate
  - 복사 기능: 기본 정보, Request Body, Response Body
  - 날짜 범위 검색: `~` 구분자 사용

## 성능 고려사항

### 백엔드 페이지네이션을 사용해야 하는 경우

- 데이터가 1,000건 이상인 경우
- 데이터가 지속적으로 증가하는 경우
- 검색 조건이 복잡한 경우
- 초기 로딩 속도가 중요한 경우

### 클라이언트 페이지네이션을 사용해도 되는 경우

- 데이터가 500건 이하인 경우
- 데이터가 거의 변하지 않는 경우
- 실시간 필터링이 필요한 경우

## 마이그레이션 체크리스트

백엔드 페이지네이션으로 전환 시:

- [ ] API Hook에 Pageable 파라미터 추가
- [ ] Service Layer에서 페이지네이션 상태 관리
- [ ] 검색/페이지 변경/크기 변경 핸들러 구현
- [ ] Page 컴포넌트에 Pagination 컴포넌트 추가
- [ ] Table 컴포넌트의 page/pageSize props 제거
- [ ] 백엔드 응답의 first/last 플래그 활용

## 참고 사항

- **페이지 인덱스**: 백엔드와 동일하게 0-based 사용
- **최대 페이지 크기**: 100 (백엔드 제한)
- **기본 페이지 크기**: 100
- **버튼 비활성화**: 백엔드의 `first`, `last` 플래그 활용
