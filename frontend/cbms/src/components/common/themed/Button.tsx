/**
 * @파일명 : Button.tsx
 * @설명 : 테마 기반 재사용 가능한 버튼 컴포넌트
 * @작성일 : 2025.12.07
 */

import React from "react";
import { theme } from "@/styles/theme";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = {
    fontFamily: theme.typography.fontFamily,
    transition: theme.effects.transitions.default,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    fontWeight: theme.typography.weights.medium,
    border: "none",
    outline: "none",
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.primary.default,
      color: theme.colors.primary.text,
      ":hover": theme.colors.primary.hover,
      ":active": theme.colors.primary.active,
    },
    secondary: {
      backgroundColor: theme.colors.background.surface,
      color: theme.colors.text.primary,
      border: `1px solid ${theme.colors.border.default}`,
    },
    success: {
      backgroundColor: theme.colors.status.success,
      color: theme.colors.primary.text,
    },
    warning: {
      backgroundColor: theme.colors.status.warning,
      color: theme.colors.background.default,
    },
    error: {
      backgroundColor: theme.colors.status.error,
      color: theme.colors.primary.text,
    },
    ghost: {
      backgroundColor: "transparent",
      color: theme.colors.text.secondary,
      border: "none",
    },
  };

  const sizeStyles = {
    sm: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      fontSize: "14px",
      borderRadius: theme.borderRadius.sm,
    },
    md: {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontSize: theme.typography.baseSize,
      borderRadius: theme.borderRadius.md,
    },
    lg: {
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      fontSize: "18px",
      borderRadius: theme.borderRadius.lg,
    },
  };

  const style: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    width: fullWidth ? "100%" : "auto",
  };

  return (
    <button
      style={style}
      className={`themed-button ${className}`}
      disabled={disabled || loading}
      onMouseEnter={(e) => {
        if (!disabled && !loading && variant === "primary") {
          e.currentTarget.style.backgroundColor = theme.colors.primary.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading && variant === "primary") {
          e.currentTarget.style.backgroundColor = theme.colors.primary.default;
        }
      }}
      onMouseDown={(e) => {
        if (!disabled && !loading && variant === "primary") {
          e.currentTarget.style.backgroundColor = theme.colors.primary.active;
        }
      }}
      onMouseUp={(e) => {
        if (!disabled && !loading && variant === "primary") {
          e.currentTarget.style.backgroundColor = theme.colors.primary.hover;
        }
      }}
      {...props}
    >
      {loading ? (
        <span className="loading-spinner">⟳</span>
      ) : (
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
