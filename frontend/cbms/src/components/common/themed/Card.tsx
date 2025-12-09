/**
 * @파일명 : Card.tsx
 * @설명 : 테마 기반 재사용 가능한 카드 컴포넌트
 * @작성일 : 2025.12.07
 */

import React from "react";
import { theme } from "@/styles/theme";

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  hoverable = false,
  className = "",
  onClick,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background.surface,
    border: `1px solid ${
      isHovered ? theme.colors.border.hover : theme.colors.border.default
    }`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily,
    transition: theme.effects.transitions.default,
    cursor: onClick ? "pointer" : "default",
    boxShadow:
      isHovered && hoverable
        ? theme.effects.shadows.md
        : theme.effects.shadows.sm,
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: theme.spacing.md,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: "14px",
    color: theme.colors.text.secondary,
  };

  const footerStyle: React.CSSProperties = {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTop: `1px solid ${theme.colors.border.default}`,
  };

  return (
    <div
      style={cardStyle}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div style={headerStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        </div>
      )}
      <div>{children}</div>
      {footer && <div style={footerStyle}>{footer}</div>}
    </div>
  );
};
