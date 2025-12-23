"use client";

import React from "react";
import { Card } from "@/components/common/themed/Card";
import { Button } from "@/components/common/themed/Button";
import { theme } from "@/styles/theme";

/**
 * @파일명 : ready/page.tsx
 * @설명 : 메뉴 준비 전 표시용 플레이스홀더 페이지
 * @작성자 : 김승연
 * @작성일 : 2025.12.17
 */

export default function ReadyPlaceholderPage() {
  return (
    <div
      style={{
        padding: theme.spacing.lg,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 680, maxWidth: "90%", textAlign: "center" }}>
        <Card title="Sorry..! 현재 화면은 개발중입니다!">
          <div style={{ padding: theme.spacing.lg }}>
            <div
              style={{
                fontSize: 64,
                opacity: 0.16,
                marginBottom: theme.spacing.md,
              }}
            >
              🛠️
            </div>
            <h2
              style={{
                margin: 0,
                color: theme.colors.text.primary,
                fontWeight: theme.typography.weights.semibold,
              }}
            >
              준비 중인 기능
            </h2>
            <p
              style={{
                color: theme.colors.text.secondary,
                marginTop: theme.spacing.sm,
              }}
            >
              해당 메뉴는 아직 개발 중입니다. 준비가 완료되면 여기에서 사용할 수
              있습니다.
            </p>

            <div
              style={{
                marginTop: theme.spacing.md,
                display: "flex",
                justifyContent: "center",
                gap: theme.spacing.sm,
              }}
            >
              <Button
                variant="primary"
                size="md"
                onClick={() => window.history.back()}
              >
                이전으로
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => window.location.reload()}
              >
                새로고침
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
