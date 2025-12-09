/**
 * @파일명 : Modal.tsx
 * @설명 : 테마 기반 재사용 가능한 모달 컴포넌트
 * @작성일 : 2025.12.07
 */

"use client";

import React, { useEffect } from "react";
import { theme } from "@/styles/theme";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeWidths = {
    sm: "400px",
    md: "600px",
    lg: "800px",
    xl: "1000px",
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: theme.effects.blur.backdrop,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: theme.spacing.lg,
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.effects.shadows.lg,
    maxWidth: sizeWidths[size],
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
    fontFamily: theme.typography.fontFamily,
  };

  const headerStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    borderBottom: `1px solid ${theme.colors.border.default}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  };

  const closeButtonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    color: theme.colors.text.secondary,
    cursor: "pointer",
    fontSize: "24px",
    padding: theme.spacing.xs,
    lineHeight: 1,
    transition: theme.effects.transitions.default,
  };

  const bodyStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    color: theme.colors.text.primary,
  };

  const footerStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.border.default}`,
    display: "flex",
    justifyContent: "flex-end",
    gap: theme.spacing.sm,
  };

  return (
    <div
      style={overlayStyle}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div style={headerStyle}>
            <h2 style={titleStyle}>{title}</h2>
            <button
              style={closeButtonStyle}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.colors.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.colors.text.secondary;
              }}
            >
              ×
            </button>
          </div>
        )}
        <div style={bodyStyle}>{children}</div>
        {footer && <div style={footerStyle}>{footer}</div>}
      </div>
    </div>
  );
};
