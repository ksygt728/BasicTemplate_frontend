"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/common/themed/Button";
import { Card } from "@/components/common/themed/Card";

/**
 * @파일명 : not-found.tsx
 * @설명 : 404 Not Found 페이지
 * @작성자 : 김승연
 * @작성일 : 2025.10.30
 */

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--background-default)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <Card>
        <div
          style={{
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
            padding: "48px 32px",
          }}
        >
          {/* 404 아이콘 */}
          <div
            style={{
              fontSize: "80px",
              marginBottom: "24px",
            }}
          >
            ⚠️
          </div>

          {/* 404 텍스트 */}
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "700",
              color: "var(--text-primary)",
              marginBottom: "16px",
              lineHeight: "1",
            }}
          >
            404
          </h1>

          {/* 메시지 */}
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "var(--text-primary)",
              marginBottom: "12px",
            }}
          >
            페이지를 찾을 수 없습니다
          </h2>

          <p
            style={{
              fontSize: "16px",
              color: "var(--text-secondary)",
              marginBottom: "8px",
              lineHeight: "1.6",
            }}
          >
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>

          <p
            style={{
              fontSize: "14px",
              color: "var(--text-tertiary)",
              marginBottom: "32px",
            }}
          >
            URL을 다시 확인해주세요.
          </p>

          {/* 버튼 그룹 */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="primary"
              onClick={() => router.push("/")}
              leftIcon="🏠"
            >
              홈으로 가기
            </Button>

            <Button
              variant="secondary"
              onClick={() => router.back()}
              leftIcon="←"
            >
              뒤로 가기
            </Button>
          </div>

          {/* 추가 안내 */}
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-tertiary)",
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid var(--border-default)",
            }}
          >
            페이지 주소를 확인하시거나 관리자에게 문의해주세요.
          </p>
        </div>
      </Card>
    </div>
  );
}
