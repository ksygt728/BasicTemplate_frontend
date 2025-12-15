/**
 * @파일명 : Tooltip.tsx
 * @설명 : 재사용 가능한 툴팁 컴포넌트
 * @작성일 : 2025.12.11
 * @기능 : 호버 시 정보를 표시하는 툴팁
 */

"use client";

import React, { useState } from "react";
import { theme } from "@/styles/theme";

export interface TooltipProps {
  /** 툴팁 내용 */
  content: string;
  /** 툴팁 트리거 위치 */
  position?: "top" | "bottom" | "left" | "right";
  /** 최소 너비 (기본값: 200px) */
  minWidth?: number;
  /** 최대 너비 (기본값: 500px) */
  maxWidth?: number;
  /** 최대 높이 (기본값: 400px, 초과시 스크롤) */
  maxHeight?: number;
  /** 자식 요소 (트리거) */
  children?: React.ReactNode;
  /** 기본 아이콘 표시 여부 (기본값: true) */
  showIcon?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "bottom",
  minWidth = 300,
  maxWidth = 800,
  maxHeight = 9999,
  children,
  showIcon = true,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getTooltipPosition = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      zIndex: 1000,
    };

    switch (position) {
      case "top":
        return {
          ...baseStyle,
          bottom: "calc(100% + 8px)",
          left: "0",
        };
      case "bottom":
        return {
          ...baseStyle,
          top: "calc(100%)",
          left: "50%",
          transform: "translateX(0%)",
        };
      case "left":
        return {
          ...baseStyle,
          right: "calc(100% + 8px)",
          top: "50%",
          transform: "translateY(-50%)",
        };
      case "right":
        return {
          ...baseStyle,
          left: "calc(100% + 8px)",
          top: "50%",
          transform: "translateY(-50%)",
        };
      default:
        return baseStyle;
    }
  };

  const getArrowStyle = (): React.CSSProperties => {
    const baseArrow: React.CSSProperties = {
      position: "absolute",
      width: "0",
      height: "0",
    };

    switch (position) {
      case "top":
        return {
          ...baseArrow,
          top: "100%",
          left: "20px",
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: `6px solid ${theme.colors.border.default}`,
        };
      case "bottom":
        return {
          ...baseArrow,
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderBottom: `6px solid ${theme.colors.border.default}`,
        };
      case "left":
        return {
          ...baseArrow,
          left: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          borderTop: "6px solid transparent",
          borderBottom: "6px solid transparent",
          borderLeft: `6px solid ${theme.colors.border.default}`,
        };
      case "right":
        return {
          ...baseArrow,
          right: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          borderTop: "6px solid transparent",
          borderBottom: "6px solid transparent",
          borderRight: `6px solid ${theme.colors.border.default}`,
        };
      default:
        return baseArrow;
    }
  };

  const iconStyle: React.CSSProperties = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: showTooltip
      ? theme.colors.background.surface
      : theme.colors.background.overlay,
    border: `1px solid ${theme.colors.border.default}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "help",
    fontSize: "12px",
    fontWeight: "bold",
    color: showTooltip
      ? theme.colors.text.primary
      : theme.colors.text.secondary,
    transition: "all 0.2s",
  };

  const tooltipStyle: React.CSSProperties = {
    ...getTooltipPosition(),
    backgroundColor: theme.colors.background.surface,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    whiteSpace: "pre-line",
    minWidth: `${minWidth}px`,
    maxWidth: `${maxWidth}px`,
    fontSize: "14px",
    color: theme.colors.text.primary,
    lineHeight: "1.6",
    wordBreak: "break-word",
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={children ? {} : iconStyle}
      >
        {children || "?"}
      </div>
      {showTooltip && (
        <div style={tooltipStyle}>
          {content}
          <div style={getArrowStyle()} />
        </div>
      )}
    </div>
  );
};
