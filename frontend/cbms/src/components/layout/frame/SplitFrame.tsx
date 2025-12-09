"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";

interface SplitFrameProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftWidth?: string; // 예: "30%", "300px", "1/3"
  rightWidth?: string; // 예: "70%", "auto", "2/3"
  gap?: string; // 예: "gap-4", "gap-6"
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
  resizable?: boolean;
}

export default function SplitFrame({
  leftContent,
  rightContent,
  leftWidth = "1/3",
  rightWidth = "2/3",
  gap = "gap-6",
  className = "",
  leftClassName = "",
  rightClassName = "",
  resizable = false,
}: SplitFrameProps) {
  const [leftWidthPx, setLeftWidthPx] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // 초기 너비 계산
  useEffect(() => {
    if (containerRef.current && leftWidthPx === null) {
      const containerWidth = containerRef.current.offsetWidth;
      let initialWidth: number;

      if (leftWidth.includes("/")) {
        const [numerator, denominator] = leftWidth.split("/").map(Number);
        initialWidth = (containerWidth * numerator) / denominator;
      } else if (leftWidth.includes("%")) {
        initialWidth = (containerWidth * parseFloat(leftWidth)) / 100;
      } else if (leftWidth.includes("px")) {
        initialWidth = parseFloat(leftWidth);
      } else {
        initialWidth = containerWidth / 3; // 기본값
      }

      setLeftWidthPx(initialWidth);
    }
  }, [leftWidth, leftWidthPx]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      startXRef.current = e.clientX;
      startWidthRef.current = leftWidthPx || 0;
    },
    [leftWidthPx]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const diff = e.clientX - startXRef.current;
      const newWidth = Math.max(
        100,
        Math.min(
          startWidthRef.current + diff,
          containerRef.current.offsetWidth - 100
        )
      );
      setLeftWidthPx(newWidth);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 마우스 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // width가 분수형태면 flex 클래스로, 아니면 직접 스타일로
  const getWidthClass = (width: string) => {
    if (width.includes("/")) {
      return `w-${width}`;
    }
    return "";
  };

  const getWidthStyle = (width: string) => {
    if (!width.includes("/")) {
      return { width };
    }
    return {};
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-screen flex ${className} px-6 py-6 select-none`}
    >
      {/* 좌측 영역 */}
      <div
        className={`${leftClassName} flex-shrink-0`}
        style={{
          height: "100%",
          width: leftWidthPx
            ? `${leftWidthPx}px`
            : getWidthStyle(leftWidth).width || "33.333%",
          minWidth: "100px",
          maxWidth: "calc(100% - 200px)",
        }}
      >
        <div
          className="w-full h-full rounded-lg p-6 overflow-auto"
          style={{
            backgroundColor: "var(--background-elevated)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {leftContent}
        </div>
      </div>

      {/* 리사이저 */}
      <div
        className="w-1.5 cursor-col-resize transition-colors duration-200 flex-shrink-0 mx-2 rounded-sm shadow-sm"
        style={{
          height: "100%",
          backgroundColor: "var(--border-default)",
          border: "1px solid var(--border-subtle)",
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--primary-default)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--border-default)")
        }
      >
        {/* 가운데 grip 표시 */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col space-y-1">
            <div
              className="w-0.5 h-4 rounded-full"
              style={{ backgroundColor: "var(--text-tertiary)" }}
            ></div>
            <div
              className="w-0.5 h-4 rounded-full"
              style={{ backgroundColor: "var(--text-tertiary)" }}
            ></div>
            <div
              className="w-0.5 h-4 rounded-full"
              style={{ backgroundColor: "var(--text-tertiary)" }}
            ></div>
          </div>
        </div>
      </div>

      {/* 우측 영역 */}
      <div
        className={`${rightClassName} flex-1 min-w-0`}
        style={{ height: "100%", minWidth: "100px" }}
      >
        <div
          className="w-full h-full rounded-lg p-6 overflow-auto"
          style={{
            backgroundColor: "var(--background-elevated)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {rightContent}
        </div>
      </div>
    </div>
  );
}
