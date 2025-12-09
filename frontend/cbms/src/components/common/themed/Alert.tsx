/**
 * @파일명 : Alert.tsx
 * @설명 : 테마 기반 재사용 가능한 알림 컴포넌트
 * @작성일 : 2025.12.07
 */

"use client";

import React from "react";
import { theme } from "@/styles/theme";

export type AlertVariant = "success" | "warning" | "error" | "info";

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  closable?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  onClose,
  closable = false,
  icon,
  className = "",
}) => {
  const variantConfig = {
    success: {
      backgroundColor: `${theme.colors.status.success}20`,
      borderColor: theme.colors.status.success,
      color: theme.colors.status.success,
      icon: "✓",
    },
    warning: {
      backgroundColor: `${theme.colors.status.warning}20`,
      borderColor: theme.colors.status.warning,
      color: theme.colors.status.warning,
      icon: "⚠",
    },
    error: {
      backgroundColor: `${theme.colors.status.error}20`,
      borderColor: theme.colors.status.error,
      color: theme.colors.status.error,
      icon: "✕",
    },
    info: {
      backgroundColor: `${theme.colors.status.info}20`,
      borderColor: theme.colors.status.info,
      color: theme.colors.status.info,
      icon: "ℹ",
    },
  };

  const config = variantConfig[variant];

  const alertStyle: React.CSSProperties = {
    display: "flex",
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: config.backgroundColor,
    border: `1px solid ${config.borderColor}`,
    borderRadius: theme.borderRadius.lg,
    fontFamily: theme.typography.fontFamily,
    position: "relative",
  };

  const iconStyle: React.CSSProperties = {
    fontSize: "20px",
    color: config.color,
    flexShrink: 0,
    lineHeight: 1,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.xs,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.tight,
  };

  const messageStyle: React.CSSProperties = {
    fontSize: "14px",
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal,
  };

  const closeButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    background: "none",
    border: "none",
    color: theme.colors.text.tertiary,
    cursor: "pointer",
    fontSize: "18px",
    lineHeight: 1,
    padding: theme.spacing.xs,
    transition: theme.effects.transitions.default,
  };

  return (
    <div style={alertStyle} className={className} role="alert">
      <div style={iconStyle}>{icon || config.icon}</div>

      <div style={contentStyle}>
        {title && <div style={titleStyle}>{title}</div>}
        <div style={messageStyle}>{children}</div>
      </div>

      {closable && onClose && (
        <button
          style={closeButtonStyle}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = theme.colors.text.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = theme.colors.text.tertiary;
          }}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
};
