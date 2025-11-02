"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";

interface TripleSplitFrameProps {
  leftContent: React.ReactNode;
  rightTopContent: React.ReactNode;
  rightBottomContent: React.ReactNode;
  leftWidth?: string; // 예: "30%", "300px", "1/3"
  rightWidth?: string; // 예: "70%", "auto", "2/3"
  rightTopHeight?: string; // 예: "50%", "300px", "1/2"
  rightBottomHeight?: string; // 예: "50%", "auto", "1/2"
  gap?: string; // 예: "gap-4", "gap-6"
  rightGap?: string; // 우측 상하 간격
  className?: string;
  leftClassName?: string;
  rightTopClassName?: string;
  rightBottomClassName?: string;
  resizable?: boolean;
}

export default function TripleSplitFrame({
  leftContent,
  rightTopContent,
  rightBottomContent,
  leftWidth = "1/3",
  rightWidth = "2/3",
  rightTopHeight = "1/2",
  rightBottomHeight = "1/2",
  gap = "gap-6",
  rightGap = "gap-6",
  className = "",
  leftClassName = "",
  rightTopClassName = "",
  rightBottomClassName = "",
  resizable = false,
}: TripleSplitFrameProps) {
  const [leftWidthPx, setLeftWidthPx] = useState<number | null>(null);
  const [rightTopHeightPx, setRightTopHeightPx] = useState<number | null>(null);
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rightContainerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);
  const startHeightRef = useRef<number>(0);

  // 초기 크기 계산
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
        initialWidth = containerWidth / 3;
      }

      setLeftWidthPx(initialWidth);
    }

    if (rightContainerRef.current && rightTopHeightPx === null) {
      const containerHeight = rightContainerRef.current.offsetHeight;
      let initialHeight: number;

      if (rightTopHeight.includes("/")) {
        const [numerator, denominator] = rightTopHeight.split("/").map(Number);
        initialHeight = (containerHeight * numerator) / denominator;
      } else if (rightTopHeight.includes("%")) {
        initialHeight = (containerHeight * parseFloat(rightTopHeight)) / 100;
      } else if (rightTopHeight.includes("px")) {
        initialHeight = parseFloat(rightTopHeight);
      } else {
        initialHeight = containerHeight / 2;
      }

      setRightTopHeightPx(initialHeight);
    }
  }, [leftWidth, rightTopHeight, leftWidthPx, rightTopHeightPx]);

  // 수직 리사이저 (좌우)
  const handleVerticalMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingVertical(true);
      startXRef.current = e.clientX;
      startWidthRef.current = leftWidthPx || 0;
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    },
    [leftWidthPx]
  );

  // 수평 리사이저 (상하)
  const handleHorizontalMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingHorizontal(true);
      startYRef.current = e.clientY;
      startHeightRef.current = rightTopHeightPx || 0;
      document.body.style.userSelect = "none";
      document.body.style.cursor = "row-resize";
    },
    [rightTopHeightPx]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDraggingVertical && containerRef.current) {
        const diff = e.clientX - startXRef.current;
        const newWidth = Math.max(
          100,
          Math.min(
            startWidthRef.current + diff,
            containerRef.current.offsetWidth - 100
          )
        );
        setLeftWidthPx(newWidth);
      }

      if (isDraggingHorizontal && rightContainerRef.current) {
        const diff = e.clientY - startYRef.current;
        const newHeight = Math.max(
          100,
          Math.min(
            startHeightRef.current + diff,
            rightContainerRef.current.offsetHeight - 100
          )
        );
        setRightTopHeightPx(newHeight);
      }
    },
    [isDraggingVertical, isDraggingHorizontal]
  );

  const handleMouseUp = useCallback(() => {
    setIsDraggingVertical(false);
    setIsDraggingHorizontal(false);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }, []);

  // 마우스 이벤트 리스너
  useEffect(() => {
    if (isDraggingVertical || isDraggingHorizontal) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [
    isDraggingVertical,
    isDraggingHorizontal,
    handleMouseMove,
    handleMouseUp,
  ]);

  // width가 분수형태면 flex 클래스로, 아니면 직접 스타일로
  const getWidthClass = (width: string) => {
    if (width.includes("/")) {
      return `w-${width}`;
    }
    return "";
  };

  const getHeightClass = (height: string) => {
    if (height.includes("/")) {
      return `h-${height}`;
    }
    return "";
  };

  const getWidthStyle = (width: string) => {
    if (!width.includes("/")) {
      return { width };
    }
    return {};
  };

  const getHeightStyle = (height: string) => {
    if (!height.includes("/")) {
      return { height };
    }
    return {};
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-screen flex ${className} px-6 py-6`}
    >
      {/* 좌측 영역 */}
      <div
        className={`${leftClassName} flex-shrink-0`}
        style={{
          height: "100%",
          width: leftWidthPx ? `${leftWidthPx}px` : "33.333%",
          minWidth: "100px",
          maxWidth: "calc(100% - 200px)",
        }}
      >
        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 overflow-auto relative">
          {leftContent}
        </div>
      </div>

      {/* 수직 리사이저 (좌우) */}
      <div
        className="w-1.5 bg-gray-400 dark:bg-gray-500 hover:bg-blue-500 cursor-col-resize transition-colors duration-200 flex-shrink-0 mx-2 rounded-sm border border-gray-300 dark:border-gray-600 shadow-sm"
        style={{
          height: "100%",
          zIndex: 10,
        }}
        onMouseDown={handleVerticalMouseDown}
        draggable={false}
      >
        {/* 가운데 grip 표시 */}
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <div className="flex flex-col space-y-1">
            <div className="w-0.5 h-4 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
            <div className="w-0.5 h-4 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
            <div className="w-0.5 h-4 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* 우측 영역 (상하 분할) */}
      <div
        ref={rightContainerRef}
        className="flex-1 flex flex-col min-w-0"
        style={{ height: "100%", minWidth: "100px" }}
      >
        {/* 우측 상단 */}
        <div
          className={`${rightTopClassName} flex-shrink-0 w-full`}
          style={{
            height: rightTopHeightPx ? `${rightTopHeightPx}px` : "50%",
            minHeight: "100px",
            maxHeight: "calc(100% - 150px)",
          }}
        >
          <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 overflow-auto relative">
            {rightTopContent}
          </div>
        </div>

        {/* 수평 리사이저 (상하) */}
        <div
          className="h-1.5 my-2 bg-gray-400 dark:bg-gray-500 hover:bg-blue-500 cursor-row-resize transition-colors duration-200 flex-shrink-0 w-full rounded-sm border border-gray-300 dark:border-gray-600 shadow-sm"
          style={{ zIndex: 10 }}
          onMouseDown={handleHorizontalMouseDown}
          draggable={false}
        >
          {/* 가운데 grip 표시 */}
          <div className="w-full h-full flex items-center justify-center pointer-events-none">
            <div className="flex space-x-1">
              <div className="h-0.5 w-4 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
              <div className="h-0.5 w-4 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
              <div className="h-0.5 w-4 bg-gray-600 dark:bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* 우측 하단 */}
        <div
          className={`${rightBottomClassName} flex-1 w-full`}
          style={{ minHeight: "100px" }}
        >
          <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 overflow-auto relative">
            {rightBottomContent}
          </div>
        </div>
      </div>
    </div>
  );
}
