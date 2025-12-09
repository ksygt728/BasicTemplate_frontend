"use client";

import { FormEvent } from "react";
import Link from "next/link";
import { Button, Input, Card } from "@/components/common/themed";
import { useAlert } from "@/contexts/AlertContext";
import { useAuthService } from "@/service/AuthService";

/**
 * @파일명 : page.tsx
 * @설명 : 회원가입 페이지 (Themed)
 * @작성자 : 김승연
 * @작성일 : 2025.12.05
 * @변경이력 :
 *       2025.12.05 김승연 최초 생성
 *       2025.12.08 김승연 신규 테마 컴포넌트 적용
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

  // Validation 규칙 렌더링 컴포넌트
  const ValidationRules = ({ rules }: { rules: any[] }) => {
    if (!rules || rules.length === 0) return null;

    return (
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {rules.map((rule, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
            }}
          >
            <span
              style={{
                color: rule.isValid
                  ? "var(--status-success)"
                  : "var(--status-error)",
              }}
            >
              {rule.isValid ? "✓" : "✗"}
            </span>
            <span
              style={{
                color: rule.isValid
                  ? "var(--status-success)"
                  : "var(--status-error)",
              }}
            >
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
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <Card>
          <form onSubmit={onSubmit}>
            {/* Logo & Title */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <Link
                href="/main"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
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
              </Link>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                }}
              >
                새 계정을 만들어주세요
              </p>
            </div>

            {/* User ID Input */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                아이디
              </label>
              <Input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                disabled={loading}
                required
                fullWidth
              />
              <ValidationRules rules={validations.userId.rules} />
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                비밀번호
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                disabled={loading}
                required
                fullWidth
              />
              <ValidationRules rules={validations.password.rules} />
            </div>

            {/* Confirm Password Input */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                비밀번호 확인
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                disabled={loading}
                required
                fullWidth
              />
              <ValidationRules rules={validations.confirmPassword.rules} />
            </div>

            {/* Name Input */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                이름
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                disabled={loading}
                required
                fullWidth
              />
              <ValidationRules rules={validations.name.rules} />
            </div>

            {/* Phone Number Input */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                전화번호
              </label>
              <Input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="전화번호를 입력하세요"
                disabled={loading}
                required
                fullWidth
              />
              <ValidationRules rules={validations.phoneNumber.rules} />
            </div>

            {/* Gender Select */}
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                성별
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                  backgroundColor: "var(--background-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "6px",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary-default)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-default)";
                }}
              >
                <option value="">성별을 선택하세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
              <ValidationRules rules={validations.gender.rules} />
            </div>

            {/* Email Input */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  marginBottom: "8px",
                }}
              >
                이메일
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
                disabled={loading}
                required
                fullWidth
              />
              <ValidationRules rules={validations.email.rules} />
            </div>

            {/* Submit Button */}
            <div style={{ marginBottom: "16px" }}>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? "처리 중..." : "회원가입"}
              </Button>
            </div>

            {/* Sign In Link */}
            <div style={{ textAlign: "center" }}>
              <Link
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
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
