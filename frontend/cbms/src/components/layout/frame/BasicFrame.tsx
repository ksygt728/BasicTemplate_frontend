"use client";

import React from "react";

interface BasicFrameProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  padding?: boolean;
}

export default function BasicFrame({
  children,
  title,
  description,
  className = "",
  padding = true,
}: BasicFrameProps) {
  return (
    <div className={`w-full h-full ${className} px-6`}>
      {/* 헤더 영역 */}
      {(title || description) && (
        <div className={`mb-6 ${padding ? "pt-6" : ""}`}>
          {title && (
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h1>
          )}
          {description && (
            <p style={{ color: "var(--text-secondary)" }}>{description}</p>
          )}
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div className={`w-full h-full ${padding ? "pb-6" : ""} overflow-auto`}>
        {children}
      </div>
    </div>
  );
}
