/**
 * @파일명 : CodeBlock.tsx
 * @설명 : 코드 또는 JSON 데이터를 표시하는 공통 컴포넌트
 * @작성자 : 김승연
 * @작성일 : 2025.12.09
 */

import React from "react";

export interface CodeBlockProps {
  /** 표시할 코드, 텍스트 또는 객체 (객체는 자동으로 JSON.stringify) */
  children: string | object | any[];
  /** 최대 높이 (기본: auto) */
  maxHeight?: string;
  /** 폰트 크기 (기본: 13px) */
  fontSize?: string;
  /** 추가 스타일 */
  style?: React.CSSProperties;
  /** 언어 표시 (선택) */
  language?: string;
  /** JSON 들여쓰기 간격 (기본: 2) */
  indent?: number;
}

/**
 * 코드 블록 컴포넌트
 * JSON, 코드 스니펫 등을 보기 좋게 표시
 * 객체나 배열을 전달하면 자동으로 JSON.stringify 처리
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  maxHeight = "auto",
  fontSize = "13px",
  style,
  language,
  indent = 2,
}) => {
  // 자동 JSON 변환
  const content =
    typeof children === "string"
      ? children
      : JSON.stringify(children, null, indent);

  return (
    <div style={{ position: "relative" }}>
      {language && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "12px",
            fontSize: "11px",
            color: "#666",
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          {language}
        </div>
      )}
      <pre
        style={{
          backgroundColor: "#08090a",
          padding: "12px",
          borderRadius: "4px",
          overflow: "auto",
          marginTop: "8px",
          fontSize,
          border: "1px solid #1a1b1c",
          maxHeight,
          ...style,
        }}
      >
        {content}
      </pre>
    </div>
  );
};
