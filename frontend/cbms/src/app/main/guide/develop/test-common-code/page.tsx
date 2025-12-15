/**
 * @파일명 : page.tsx
 * @설명 : 공통코드 Hook 테스트 페이지 (6가지 기능 테스트)
 * @작성자 : 김승연
 * @작성일 : 2025.12.09
 * @수정일 : 2025.12.09
 */

"use client";

import { useCommonCode } from "@/hooks/common/useCommonCode";
import { Select } from "@/components/common/themed/Select";
import { Button } from "@/components/common/themed/Button";
import { CodeBlock } from "@/components/common/themed/CodeBlock";

export default function CommonCodeTestPage() {
  const {
    getGrpCode,
    getAttrCode,
    getDtlCode,
    getSelectOptions,
    isLoading,
    error,
    isLoaded,
    refresh,
    codes,
  } = useCommonCode();

  if (isLoading) {
    return (
      <div style={{ padding: "24px", color: "#fff" }}>
        공통코드를 로딩중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px", color: "#ff5c5c" }}>
        에러 발생: {error}
      </div>
    );
  }

  if (!codes || !isLoaded) {
    return (
      <div style={{ padding: "24px", color: "#fff" }}>
        공통코드를 준비중입니다...
      </div>
    );
  }

  // 테스트용 데이터 - 안전하게 호출
  const allGrpNames = getGrpCode();
  const approvalGrpName = getGrpCode("APPROVAL_STATUS");
  const allAttrNames = getAttrCode("APPROVAL_STATUS");
  const attrName001 = getAttrCode("APPROVAL_STATUS", "001");
  const dtlCodeList = getDtlCode("APPROVAL_STATUS", "001");
  const dtlName = getDtlCode("APPROVAL_STATUS", "001", "AGREE");

  return (
    <div
      style={{
        padding: "24px",
        color: "#fff",
        maxWidth: "100%",
        minHeight: "100vh",
        backgroundColor: "#121212",
        overflowY: "auto",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "24px", fontSize: "28px" }}>
          🧪 공통코드 Hook 테스트 페이지
        </h1>

        <div
          style={{
            marginBottom: "24px",
            padding: "16px",
            backgroundColor: "#1c1d1f",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ marginBottom: "8px" }}>📊 기본 상태</h3>
          <p>✅ 로드 완료: {isLoaded ? "예" : "아니오"}</p>
          <p>📦 전체 그룹 수: {codes?.groups?.length || 0}</p>
          <Button onClick={() => refresh()} style={{ marginTop: "12px" }}>
            🔄 공통코드 새로고침
          </Button>
        </div>

        {/* 1️⃣ 그룹코드 조회 */}
        <TestSection title="1️⃣ getGrpCode() - 그룹코드 조회">
          <div style={{ marginBottom: "12px" }}>
            <strong>getGrpCode() → 전체 그룹명 리스트</strong>
            <CodeBlock>
              {Array.isArray(allGrpNames) ? allGrpNames.join(", ") : "[]"}
            </CodeBlock>
            <small style={{ color: "#999" }}>
              총 {Array.isArray(allGrpNames) ? allGrpNames.length : 0}개
            </small>
          </div>
          <div>
            <strong>getGrpCode("APPROVAL_STATUS") → 특정 그룹명</strong>
            <CodeBlock>{approvalGrpName}</CodeBlock>
          </div>
        </TestSection>

        {/* 2️⃣ 속성코드 조회 */}
        <TestSection title="2️⃣ getAttrCode() - 속성코드 조회">
          <div style={{ marginBottom: "12px" }}>
            <strong>getAttrCode("APPROVAL_STATUS") → 전체 속성명 리스트</strong>
            <CodeBlock>{allAttrNames}</CodeBlock>
          </div>
          <div>
            <strong>getAttrCode("APPROVAL_STATUS", "001") → 특정 속성명</strong>
            <CodeBlock>{attrName001}</CodeBlock>
          </div>
        </TestSection>

        {/* 3️⃣ 상세코드 조회 */}
        <TestSection title="3️⃣ getDtlCode() - 상세코드 조회">
          <div style={{ marginBottom: "12px" }}>
            <strong>
              getDtlCode("APPROVAL_STATUS", "001") → 상세코드 리스트
            </strong>
            <CodeBlock>{dtlCodeList}</CodeBlock>
          </div>
          <div>
            <strong>
              getDtlCode("APPROVAL_STATUS", "001", "AGREE") → 특정 상세명
            </strong>
            <CodeBlock>{dtlName}</CodeBlock>
          </div>
        </TestSection>

        {/* 4️⃣ Select 컴포넌트 예시 */}
        <TestSection title="4️⃣ getSelectOptions() - Select 컴포넌트 연동">
          <div style={{ marginBottom: "12px" }}>
            <strong>getSelectOptions("APPROVAL_STATUS", "001")</strong>
            <Select
              label="승인 상태 (속성코드: 001)"
              options={getSelectOptions("APPROVAL_STATUS", "001")}
              placeholder="승인 상태를 선택하세요"
            />
          </div>
          <div>
            <strong>getSelectOptions("APPROVAL_STATUS", "002")</strong>
            <Select
              label="승인 상태 (속성코드: 002)"
              options={getSelectOptions("APPROVAL_STATUS", "002")}
              placeholder="승인 상태를 선택하세요"
            />
          </div>
        </TestSection>

        {/* 5️⃣ 실전 예시 */}
        <TestSection title="5️⃣ 실전 활용 예시">
          <div
            style={{
              padding: "12px",
              backgroundColor: "#08090a",
              borderRadius: "4px",
            }}
          >
            <p style={{ marginBottom: "8px" }}>
              💡 <strong>시나리오:</strong> APPROVAL_STATUS의 001번 속성코드를
              사용하여 Select 만들고, 선택된 값의 이름 표시
            </p>
            <pre style={{ color: "#4fc3f7", fontSize: "12px" }}>
              {`const options = getSelectOptions("APPROVAL_STATUS", "001");
const selectedName = getDtlCode("APPROVAL_STATUS", "001", "AGREE");

<Select options={options} />
선택된 값: {selectedName} // "협의"`}
            </pre>
          </div>
        </TestSection>

        {/* 6️⃣ 전체 데이터 미리보기 */}
        <TestSection title="6️⃣ 디버그 - 전체 데이터 구조">
          <details>
            <summary
              style={{ cursor: "pointer", padding: "8px", fontWeight: "bold" }}
            >
              🔍 APPROVAL_STATUS 전체 데이터 보기 (클릭)
            </summary>
            <CodeBlock>
              {{
                그룹명: approvalGrpName,
                속성코드목록: allAttrNames,
                상세코드: codes?.detailsByGroup?.["APPROVAL_STATUS"],
              }}
            </CodeBlock>
          </details>
        </TestSection>
      </div>
    </div>
  );
}

// 🎨 헬퍼 컴포넌트
function TestSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginBottom: "32px",
        padding: "20px",
        backgroundColor: "#1c1d1f",
        borderRadius: "8px",
        border: "1px solid #2a2b2d",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      <h3
        style={{
          marginBottom: "16px",
          color: "#4fc3f7",
          fontSize: "20px",
          borderBottom: "2px solid #2a2b2d",
          paddingBottom: "8px",
        }}
      >
        {title}
      </h3>
      <div style={{ marginTop: "16px" }}>{children}</div>
    </div>
  );
}
