/**
 * @파일명 : Input.tsx
 * @설명 : 테마 기반 재사용 가능한 입력 컴포넌트
 * @작성일 : 2025.12.07
 */

import React from "react";
import { theme } from "@/styles/theme";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.xs,
    width: fullWidth ? "100%" : "auto",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily,
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    paddingLeft: leftIcon ? "40px" : theme.spacing.md,
    paddingRight: rightIcon ? "40px" : theme.spacing.md,
    backgroundColor: theme.colors.background.surface,
    color: theme.colors.text.primary,
    border: `1px solid ${
      error ? theme.colors.status.error : theme.colors.border.default
    }`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.baseSize,
    fontFamily: theme.typography.fontFamily,
    outline: "none",
    transition: theme.effects.transitions.default,
  };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    color: theme.colors.text.tertiary,
    pointerEvents: "none",
  };

  const helperStyle: React.CSSProperties = {
    fontSize: "12px",
    color: error ? theme.colors.status.error : theme.colors.text.tertiary,
    fontFamily: theme.typography.fontFamily,
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        {leftIcon && (
          <span style={{ ...iconStyle, left: theme.spacing.md }}>
            {leftIcon}
          </span>
        )}
        <input
          style={inputStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = theme.colors.primary.default;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error
              ? theme.colors.status.error
              : theme.colors.border.default;
          }}
          {...props}
        />
        {rightIcon && (
          <span style={{ ...iconStyle, right: theme.spacing.md }}>
            {rightIcon}
          </span>
        )}
      </div>
      {(error || helperText) && (
        <span style={helperStyle}>{error || helperText}</span>
      )}
    </div>
  );
};
