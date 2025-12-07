/**
 * @파일명 : Badge.tsx
 * @설명 : 테마 기반 재사용 가능한 배지 컴포넌트
 * @작성일 : 2025.12.07
 */

import React from "react";
import { theme } from "@/styles/theme";

export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
}) => {
  const variantColors = {
    primary: theme.colors.primary.default,
    success: theme.colors.status.success,
    warning: theme.colors.status.warning,
    error: theme.colors.status.error,
    info: theme.colors.status.info,
    neutral: theme.colors.text.tertiary,
  };

  const sizeStyles = {
    sm: {
      padding: `2px ${theme.spacing.xs}`,
      fontSize: "11px",
    },
    md: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      fontSize: "12px",
    },
    lg: {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontSize: "14px",
    },
  };

  const badgeStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: `${variantColors[variant]}20`,
    color: variantColors[variant],
    ...sizeStyles[size],
    borderRadius: theme.borderRadius.pill,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.medium,
    lineHeight: theme.typography.lineHeight.tight,
  };

  const dotStyle: React.CSSProperties = {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: variantColors[variant],
  };

  return (
    <span style={badgeStyle} className={className}>
      {dot && <span style={dotStyle} />}
      {children}
    </span>
  );
};
