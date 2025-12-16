/**
 * @파일명 : TextViewModal.tsx
 * @설명 : 긴 텍스트를 전체 내용으로 보여주는 모달 컴포넌트
 * @작성자 : 김승연
 * @작성일 : 2025.12.15
 * @변경이력 :
 *       2025.12.15 김승연 최초 생성
 */

"use client";

import React from "react";
import { Modal } from "./Modal";
import { theme } from "@/styles/theme";

export interface TextViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const TextViewModal: React.FC<TextViewModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
}) => {
  const contentStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    maxHeight: "500px",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontFamily: theme.typography.fontFamily,
    fontSize: "14px",
    lineHeight: "1.6",
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borderRadius.md,
  };

  const footerStyle: React.CSSProperties = {
    padding: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.border.default}`,
    display: "flex",
    justifyContent: "flex-end",
  };

  const closeButtonStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    backgroundColor: theme.colors.primary.default,
    color: "#fff",
    border: "none",
    borderRadius: theme.borderRadius.md,
    cursor: "pointer",
    fontWeight: theme.typography.weights.medium,
    transition: theme.effects.transitions.default,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <div style={footerStyle}>
          <button style={closeButtonStyle} onClick={onClose}>
            닫기
          </button>
        </div>
      }
    >
      <div style={contentStyle}>{content || "(내용 없음)"}</div>
    </Modal>
  );
};
