/**
 * @파일명 : MenuList.tsx
 * @설명 : 테마 적용된 메뉴 리스트 컴포넌트
 * @작성일 : 2025.12.07
 */

"use client";

import React from "react";
import Link from "next/link";
import { theme } from "@/styles/theme";

export interface MenuItem {
  id: string;
  label: string;
  url?: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface MenuListProps {
  items: MenuItem[];
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  showDescription?: boolean;
  showDivider?: boolean;
  onItemClick?: (item: MenuItem) => void;
  className?: string;
}

export const MenuList: React.FC<MenuListProps> = ({
  items,
  orientation = "horizontal",
  size = "md",
  showDescription = false,
  showDivider = true,
  onItemClick,
  className = "",
}) => {
  const sizeMap = {
    sm: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      fontSize: "13px",
      gap: theme.spacing.sm,
    },
    md: {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontSize: "14px",
      gap: theme.spacing.md,
    },
    lg: {
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      fontSize: "16px",
      gap: theme.spacing.lg,
    },
  };

  const currentSize = sizeMap[size];

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: orientation === "horizontal" ? "row" : "column",
    gap: orientation === "horizontal" ? currentSize.gap : "0",
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
  };

  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: currentSize.padding,
    fontSize: currentSize.fontSize,
    color: theme.colors.text.primary,
    backgroundColor: "transparent",
    borderRadius: theme.borderRadius.md,
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    position: "relative",
  };

  const disabledStyle: React.CSSProperties = {
    ...itemStyle,
    color: theme.colors.text.disabled,
    cursor: "not-allowed",
    opacity: 0.5,
  };

  const badgeStyle: React.CSSProperties = {
    padding: "2px 8px",
    fontSize: "11px",
    fontWeight: theme.typography.weights.semibold,
    backgroundColor: theme.colors.primary.default,
    color: "#FFFFFF",
    borderRadius: theme.borderRadius.pill,
    marginLeft: "auto",
  };

  const dividerStyle: React.CSSProperties = {
    width: orientation === "horizontal" ? "1px" : "100%",
    height: orientation === "horizontal" ? "20px" : "1px",
    backgroundColor: theme.colors.border.default,
    alignSelf: "center",
  };

  const renderItem = (item: MenuItem, index: number) => {
    const content = (
      <>
        {item.icon && (
          <span style={{ display: "flex", alignItems: "center" }}>
            {item.icon}
          </span>
        )}
        <div style={{ flex: 1 }}>
          <div>{item.label}</div>
          {showDescription && item.description && (
            <div
              style={{
                fontSize: "12px",
                color: theme.colors.text.tertiary,
                marginTop: "2px",
              }}
            >
              {item.description}
            </div>
          )}
        </div>
        {item.badge !== undefined && (
          <span style={badgeStyle}>{item.badge}</span>
        )}
      </>
    );

    const handleClick = (e: React.MouseEvent) => {
      if (item.disabled) {
        e.preventDefault();
        return;
      }
      if (onItemClick) {
        onItemClick(item);
      }
    };

    return (
      <React.Fragment key={item.id}>
        {item.url && !item.disabled ? (
          <Link
            href={item.url}
            style={item.disabled ? disabledStyle : itemStyle}
            onClick={handleClick}
            onMouseEnter={(e) => {
              if (!item.disabled) {
                e.currentTarget.style.backgroundColor =
                  theme.colors.background.overlay;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {content}
          </Link>
        ) : (
          <div
            style={item.disabled ? disabledStyle : itemStyle}
            onClick={handleClick}
            onMouseEnter={(e) => {
              if (!item.disabled) {
                e.currentTarget.style.backgroundColor =
                  theme.colors.background.overlay;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {content}
          </div>
        )}
        {showDivider && index < items.length - 1 && (
          <div style={dividerStyle} />
        )}
      </React.Fragment>
    );
  };

  return (
    <div style={containerStyle} className={className}>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  );
};
