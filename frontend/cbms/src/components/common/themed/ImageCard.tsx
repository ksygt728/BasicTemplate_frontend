/**
 * @파일명 : ImageCard.tsx
 * @설명 : 테마 적용된 이미지 카드 컴포넌트
 * @작성일 : 2025.12.07
 */

"use client";

import React from "react";
import { theme } from "@/styles/theme";

export interface ImageCardProps {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  badge?: string;
  onClick?: () => void;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "auto";
  overlay?: boolean;
  className?: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  src,
  alt,
  title,
  description,
  badge,
  onClick,
  aspectRatio = "16:9",
  overlay = false,
  className = "",
}) => {
  const aspectRatios = {
    "16:9": "56.25%",
    "4:3": "75%",
    "1:1": "100%",
    auto: "auto",
  };

  const containerStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.surface,
    border: `1px solid ${theme.colors.border.default}`,
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.3s ease",
  };

  const imageWrapperStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    paddingBottom: aspectRatio === "auto" ? "0" : aspectRatios[aspectRatio],
    overflow: "hidden",
  };

  const imageStyle: React.CSSProperties = {
    position: aspectRatio === "auto" ? "relative" : "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: aspectRatio === "auto" ? "auto" : "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  };

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)",
    opacity: overlay ? 1 : 0,
    transition: "opacity 0.3s ease",
  };

  const contentStyle: React.CSSProperties = {
    padding: theme.spacing.md,
  };

  const overlayContentStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "18px",
    fontWeight: theme.typography.weights.semibold,
    color: overlay ? "#FFFFFF" : theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.lineHeight.tight,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: "14px",
    color: overlay ? "rgba(255,255,255,0.9)" : theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal,
  };

  const badgeStyle: React.CSSProperties = {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    backgroundColor: theme.colors.primary.default,
    color: theme.colors.primary.text,
    fontSize: "12px",
    fontWeight: theme.typography.weights.semibold,
    borderRadius: theme.borderRadius.md,
    zIndex: 2,
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={className}
      style={containerStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <div style={imageWrapperStyle}>
        <img
          src={src}
          alt={alt}
          style={{
            ...imageStyle,
            transform: isHovered && onClick ? "scale(1.05)" : "scale(1)",
          }}
        />
        {badge && <div style={badgeStyle}>{badge}</div>}
        {overlay && (
          <div
            style={{
              ...overlayStyle,
              opacity: isHovered ? 1 : 0.8,
            }}
          />
        )}
      </div>

      {overlay && (title || description) && (
        <div style={overlayContentStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {description && <p style={descriptionStyle}>{description}</p>}
        </div>
      )}

      {!overlay && (title || description) && (
        <div style={contentStyle}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {description && <p style={descriptionStyle}>{description}</p>}
        </div>
      )}
    </div>
  );
};
