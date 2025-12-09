"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button, Input, Card } from "@/components/common/themed";
import Link from "next/link";
import { useAlert } from "@/contexts/AlertContext";
import { useAuthService } from "@/service/AuthService";

/**
 * @파일명 : page.tsx
 * @설명 : 회원가입 페이지 (Themed)
 * @작성자 : 김승연
 * @작성일 : 2025.12.05
 * @변경이력 :
 *       2025.12.05 김승연 최초 생성
 *       2025.12.07 김승연 테마 컴포넌트 적용
 */

export default function SignUpPage() {
  const { showAlert } = useAlert();
  const { loading, formData, validations, handleChange, handleSubmit } =
    useAuthService();

  // 폼 제출 핸들러
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const result = await handleSubmit(e);

    // 검증 실패
    if (!result.success && result.validationResults) {
      showAlert({
        type: "warning",
        title: "입력 오류",
        message: result.message || "입력 정보를 확인해주세요.",
      });
      return;
    }

    // API 호출 결과 처리
    if (result.success) {
      showAlert({
        type: "success",
        title: "회원가입 성공",
        message: result.message || "회원가입이 완료되었습니다.",
      });
    } else {
      showAlert({
        type: "error",
        title: "회원가입 실패",
        message: result.message || "회원가입에 실패했습니다.",
      });
    }
  };

  // Validation 규칙 렌더링
  const ValidationRules = ({ rules }: { rules: any[] }) => {
    if (!rules || rules.length === 0) return null;

    return (
      <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {rules.map((rule, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px" }}>
            <span style={{ color: rule.isValid ? "var(--status-success)" : "var(--status-error)" }}>
              {rule.isValid ? "✓" : "✗"}
            </span>
            <span style={{ color: rule.isValid ? "var(--status-success)" : "var(--status-error)" }}>
              {rule.text}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background-default)",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <Card>
          <form onSubmit={onSubmit}>
            {/* 로고 */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h1
                style={{
                  fontSize: "32px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                }}
              >
                CBMS
              </h1>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                새 계정 만들기
              </p>
            </div>

            {/* ID 입력 */}
            <div style={{ marginBottom: "16px" }}>
              <Input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="아이디"
                disabled={loading}
                error={validations.userId.error}
                fullWidth
              />
              <ValidationRules rules={validations.userId.rules} />
            </div>

            {/* 비밀번호 */}
            <div style={{ marginBottom: "16px" }}>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호"
                disabled={loading}
                error={validations.password.error}
                fullWidth
              />
              <ValidationRules rules={validations.password.rules} />
            </div>

            {/* 비밀번호 확인 */}
            <div style={{ marginBottom: "16px" }}>
              <Input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="비밀번호 확인"
                disabled={loading}
                error={validations.passwordConfirm.error}
                fullWidth
              />
            </div>

            {/* 이름 */}
            <div style={{ marginBottom: "16px" }}>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름"
                disabled={loading}
                error={validations.name.error}
                fullWidth
              />
            </div>

            {/* 이메일 */}
            <div style={{ marginBottom: "16px" }}>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일"
                disabled={loading}
                error={validations.email.error}
                fullWidth
              />
              <ValidationRules rules={validations.email.rules} />
            </div>

            {/* 전화번호 */}
            <div style={{ marginBottom: "24px" }}>
              <Input
                type="tel"
                name="phoneNum"
                value={formData.phoneNum}
                onChange={handleChange}
                placeholder="전화번호"
                disabled={loading}
                error={validations.phoneNum.error}
                fullWidth
              />
              <ValidationRules rules={validations.phoneNum.rules} />
            </div>

            {/* 회원가입 버튼 */}
            <div style={{ marginBottom: "16px" }}>
              <Button type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? "처리 중..." : "회원가입"}
              </Button>
            </div>

            {/* 로그인 링크 */}
            <div style={{ textAlign: "center" }}>
              <a
                href="/signIn"
                style={{
                  fontSize: "14px",
                  color: "var(--primary-default)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                이미 계정이 있으신가요? 로그인
              </a>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
