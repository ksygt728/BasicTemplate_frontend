# 공통코드 관리 시스템 사용 가이드

## 📋 개요

React Query + Redux 하이브리드 방식을 사용한 공통코드 관리 시스템입니다.

### 주요 기능

- ✅ 자동 캐싱 (30분)
- ✅ Redux 전역 상태 관리
- ✅ Select 옵션 자동 변환
- ✅ 재사용 가능한 Custom Hook
- ✅ 타입 안정성

---

## 🚀 빠른 시작

### 1. 기본 사용법

```typescript
import { useCommonCode } from "@/hooks/useCommonCode";

export default function MyPage() {
  const { getCodeOptions, isLoading } = useCommonCode();

  if (isLoading) return <div>로딩중...</div>;

  return (
    <Select
      options={getCodeOptions("APPROVAL_STATUS")}
      placeholder="승인 상태 선택"
    />
  );
}
```

---

## 📚 API 레퍼런스

### useCommonCode Hook

#### 반환값

| 이름        | 타입                     | 설명                 |
| ----------- | ------------------------ | -------------------- |
| `codes`     | `CommonCodeData \| null` | 전체 공통코드 데이터 |
| `isLoading` | `boolean`                | 로딩 상태            |
| `isLoaded`  | `boolean`                | 로드 완료 여부       |
| `error`     | `string \| null`         | 에러 메시지          |

#### 주요 함수

##### 1. getCodeOptions(grpCd, includeInactive?)

특정 그룹의 상세코드를 Select 옵션으로 반환

```typescript
const options = getCodeOptions("APPROVAL_STATUS");
// 결과: [{ value: '001', label: '승인대기' }, ...]

const allOptions = getCodeOptions("APPROVAL_STATUS", true); // 비활성 코드 포함
```

##### 2. getCustomCodeOptions(grpCd, valueField, labelField, includeInactive?)

커스텀 필드로 Select 옵션 생성

```typescript
const options = getCustomCodeOptions(
  "USER_TYPE",
  "userTypeCd", // value로 사용할 필드
  "userTypeNm", // label로 사용할 필드
  false
);
```

##### 3. getCodeLabel(grpCd, codeValue)

코드값으로 코드명 찾기

```typescript
const label = getCodeLabel("APPROVAL_STATUS", "001");
// 결과: "승인대기"
```

##### 4. getCodes(grpCd, includeInactive?)

특정 그룹의 모든 상세코드 가져오기

```typescript
const codes = getCodes("APPROVAL_STATUS");
// 결과: [{ dtlCd: '001', dtlNm: '승인대기', useYn: 'Y', ... }, ...]
```

##### 5. getMultipleCodes(grpCds)

여러 그룹의 상세코드를 한 번에 가져오기

```typescript
const multiCodes = getMultipleCodes([
  "APPROVAL_STATUS",
  "USER_TYPE",
  "DEPT_TYPE",
]);
// 결과: {
//   'APPROVAL_STATUS': [...],
//   'USER_TYPE': [...],
//   'DEPT_TYPE': [...]
// }
```

##### 6. refresh()

공통코드 전체 재조회

```typescript
const handleRefresh = async () => {
  await refresh();
  console.log("공통코드 갱신 완료");
};
```

---

## 💡 사용 예시

### 예시 1: 검색 폼에서 사용

```typescript
import { useCommonCode } from "@/hooks/useCommonCode";
import { SearchForm } from "@/components/common/themed/SearchForm";

export default function SearchPage() {
  const { getCodeOptions } = useCommonCode();

  const searchFields = [
    {
      name: "status",
      label: "승인 상태",
      type: "select" as const,
      options: getCodeOptions("APPROVAL_STATUS"),
    },
    {
      name: "userType",
      label: "사용자 유형",
      type: "select" as const,
      options: getCodeOptions("USER_TYPE"),
    },
  ];

  return <SearchForm fields={searchFields} onSearch={handleSearch} />;
}
```

### 예시 2: 테이블에서 코드명 표시

```typescript
import { useCommonCode } from "@/hooks/useCommonCode";

export default function UserTable() {
  const { getCodeLabel } = useCommonCode();

  const columns = [
    {
      key: "userName",
      label: "사용자명",
    },
    {
      key: "statusCd",
      label: "상태",
      render: (value: string) => getCodeLabel("APPROVAL_STATUS", value),
    },
  ];

  return <AdvancedTable columns={columns} data={users} />;
}
```

### 예시 3: 여러 그룹 코드 동시 사용

```typescript
import { useCommonCode } from "@/hooks/useCommonCode";

export default function ComplexForm() {
  const { getMultipleCodes, isLoading } = useCommonCode();

  // 한 번에 여러 그룹 코드 가져오기
  const codes = getMultipleCodes([
    "APPROVAL_STATUS",
    "USER_TYPE",
    "DEPT_TYPE",
    "ROLE_TYPE",
  ]);

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div>
      <Select options={codes.APPROVAL_STATUS} />
      <Select options={codes.USER_TYPE} />
      <Select options={codes.DEPT_TYPE} />
      <Select options={codes.ROLE_TYPE} />
    </div>
  );
}
```

### 예시 4: 조건부 필터링

```typescript
import { useCommonCode } from "@/hooks/useCommonCode";

export default function FilteredSelect() {
  const { getCodes } = useCommonCode();

  // 모든 코드 가져와서 커스텀 필터링
  const allCodes = getCodes("APPROVAL_STATUS", true); // 비활성 포함
  const activeCodes = allCodes.filter((code) => code.useYn === "Y");
  const priorityCodes = allCodes.filter((code) => code.priority === "HIGH");

  return (
    <div>
      <h3>활성 코드만</h3>
      <Select
        options={activeCodes.map((c) => ({ value: c.dtlCd, label: c.dtlNm }))}
      />

      <h3>우선순위 높은 코드만</h3>
      <Select
        options={priorityCodes.map((c) => ({ value: c.dtlCd, label: c.dtlNm }))}
      />
    </div>
  );
}
```

---

## 🏗️ 시스템 구조

```
src/
├── types/
│   └── code.types.ts              # 공통코드 타입 정의
├── store/
│   ├── slices/
│   │   └── commonCodeSlice.ts     # Redux Slice
│   └── providers/
│       └── QueryProvider.tsx      # React Query Provider
├── utils/
│   └── codeUtils.ts               # 변환 유틸리티
├── hooks/
│   └── useCommonCode.ts           # Custom Hook (핵심)
└── api/
    └── admin/
        └── codeApi.ts             # API 호출
```

---

## 🔧 고급 활용

### 캐시 설정 변경

`src/store/providers/QueryProvider.tsx`에서 설정 변경 가능:

```typescript
staleTime: 1000 * 60 * 5,    // 데이터 신선도 시간 (기본 5분)
gcTime: 1000 * 60 * 30,      // 캐시 유지 시간 (기본 30분)
```

### Redux DevTools로 상태 확인

Redux DevTools 확장프로그램에서 `commonCode` 상태 확인 가능

---

## 🎯 성능 최적화

1. **자동 캐싱**: 30분간 동일한 데이터 재사용
2. **중복 요청 방지**: Redux에 데이터가 있으면 API 호출 안 함
3. **선택적 로딩**: `enabled` 옵션으로 필요할 때만 로드

---

## 🧪 테스트 페이지

`/test-common-code` 경로로 이동하여 테스트 가능

---

## ⚠️ 주의사항

1. **"use client" 필수**: 공통코드를 사용하는 컴포넌트는 Client Component여야 함
2. **Provider 순서**: `QueryProvider`는 `ReduxProvider` 안쪽에 있어야 함
3. **초기 로딩**: 첫 페이지 접근 시 공통코드 로딩 시간 발생

---

## 📝 FAQ

**Q: 공통코드가 업데이트되었는데 반영이 안 됩니다.**
A: `refresh()` 함수를 호출하거나 브라우저를 새로고침하세요.

**Q: 특정 그룹코드만 조회할 수 있나요?**
A: 현재는 전체 조회 후 필터링 방식입니다. 필요시 API 수정 가능합니다.

**Q: SSR에서 사용할 수 있나요?**
A: React Query는 Client Side 전용입니다. SSR이 필요하면 별도 처리가 필요합니다.

---

## 🔄 마이그레이션 가이드

### 기존 코드에서 변경하기

**Before:**

```typescript
const [codes, setCodes] = useState([]);

useEffect(() => {
  codeApi.findAllCodeMWithConditions(...).then(res => {
    setCodes(res.data);
  });
}, []);
```

**After:**

```typescript
const { getCodeOptions } = useCommonCode();
// 자동으로 로딩되고 캐싱됨
```

---

## 📞 문의

문제가 있거나 개선사항이 있으면 개발팀에 문의하세요.
