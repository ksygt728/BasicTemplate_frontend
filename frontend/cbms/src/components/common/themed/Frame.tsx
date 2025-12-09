/**
 * @파일명 : Frame.tsx
 * @설명 : 테마 적용된 프레임 레이아웃 컴포넌트 (기본, 2분할, 3분할 지원)
 * @작성일 : 2025.12.07
 * @기능 : 리사이즈 가능한 분할 레이아웃, 다크모드 지원
 */

"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { theme } from "@/styles/theme";

interface FrameBaseProps {
  className?: string;
  padding?: boolean;
}

// 기본 프레임
export interface BasicFrameProps extends FrameBaseProps {
  mode: "basic";
  title?: string;
  description?: string;
  children: React.ReactNode;
}

// 2분할 프레임
export interface SplitFrameProps extends FrameBaseProps {
  mode: "split";
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftWidth?: string | number;
  resizable?: boolean;
}

// 3분할 프레임
export interface TripleSplitFrameProps extends FrameBaseProps {
  mode: "triple";
  leftContent: React.ReactNode;
  rightTopContent: React.ReactNode;
  rightBottomContent: React.ReactNode;
  leftWidth?: string | number;
  rightTopHeight?: string | number;
  resizable?: boolean;
}

export type FrameProps =
  | BasicFrameProps
  | SplitFrameProps
  | TripleSplitFrameProps;

export const Frame: React.FC<FrameProps> = (props) => {
  const { mode, padding = true, className = "" } = props;

  // 기본 프레임
  if (mode === "basic") {
    const { title, description, children } = props as BasicFrameProps;

    const containerStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      padding: `0 ${theme.spacing.lg}`,
      fontFamily: theme.typography.fontFamily,
    };

    const headerStyle: React.CSSProperties = {
      marginBottom: theme.spacing.lg,
      paddingTop: padding ? theme.spacing.lg : "0",
    };

    const titleStyle: React.CSSProperties = {
      fontSize: "24px",
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.primary,
      marginBottom: theme.spacing.xs,
    };

    const descriptionStyle: React.CSSProperties = {
      fontSize: "14px",
      color: theme.colors.text.secondary,
      lineHeight: theme.typography.lineHeight.relaxed,
    };

    const contentStyle: React.CSSProperties = {
      width: "100%",
      height: "100%",
      paddingBottom: padding ? theme.spacing.lg : "0",
      overflow: "auto",
    };

    return (
      <div style={containerStyle} className={className}>
        {(title || description) && (
          <div style={headerStyle}>
            {title && <h1 style={titleStyle}>{title}</h1>}
            {description && <p style={descriptionStyle}>{description}</p>}
          </div>
        )}
        <div style={contentStyle}>{children}</div>
      </div>
    );
  }

  // 2분할 프레임
  if (mode === "split") {
    const {
      leftContent,
      rightContent,
      leftWidth = "33.333%",
      resizable = false,
    } = props as SplitFrameProps;

    const [leftWidthPx, setLeftWidthPx] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef<number>(0);
    const startWidthRef = useRef<number>(0);

    useEffect(() => {
      if (containerRef.current && leftWidthPx === null) {
        const containerWidth = containerRef.current.offsetWidth;
        let initialWidth: number;

        if (typeof leftWidth === "number") {
          initialWidth = leftWidth;
        } else if (leftWidth.includes("%")) {
          initialWidth = (containerWidth * parseFloat(leftWidth)) / 100;
        } else if (leftWidth.includes("px")) {
          initialWidth = parseFloat(leftWidth);
        } else {
          initialWidth = containerWidth / 3;
        }

        setLeftWidthPx(initialWidth);
      }
    }, [leftWidth, leftWidthPx]);

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (!resizable) return;
        e.preventDefault();
        setIsDragging(true);
        startXRef.current = e.clientX;
        startWidthRef.current = leftWidthPx || 0;
        document.body.style.userSelect = "none";
        document.body.style.cursor = "col-resize";
      },
      [leftWidthPx, resizable]
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
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }, []);

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

    const containerStyle: React.CSSProperties = {
      width: "100%",
      height: "100vh",
      display: "flex",
      padding: padding ? theme.spacing.lg : "0",
      userSelect: "none",
      fontFamily: theme.typography.fontFamily,
    };

    const panelStyle: React.CSSProperties = {
      backgroundColor: theme.colors.background.surface,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.border.default}`,
      padding: theme.spacing.lg,
      overflow: "auto",
    };

    const resizerStyle: React.CSSProperties = {
      width: "6px",
      backgroundColor: theme.colors.background.overlay,
      cursor: resizable ? "col-resize" : "default",
      transition: "background-color 0.2s",
      flexShrink: 0,
      margin: `0 ${theme.spacing.xs}`,
      borderRadius: theme.borderRadius.sm,
      border: `1px solid ${theme.colors.border.default}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const gripStyle: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    };

    const gripDotStyle: React.CSSProperties = {
      width: "2px",
      height: "16px",
      backgroundColor: theme.colors.text.tertiary,
      borderRadius: theme.borderRadius.pill,
    };

    return (
      <div ref={containerRef} style={containerStyle} className={className}>
        <div
          style={{
            ...panelStyle,
            width: leftWidthPx ? `${leftWidthPx}px` : leftWidth,
            minWidth: "100px",
            flexShrink: 0,
          }}
        >
          {leftContent}
        </div>

        {resizable && (
          <div
            style={resizerStyle}
            onMouseDown={handleMouseDown}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme.colors.primary.default;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                theme.colors.background.overlay;
            }}
          >
            <div style={gripStyle}>
              <div style={gripDotStyle} />
              <div style={gripDotStyle} />
              <div style={gripDotStyle} />
            </div>
          </div>
        )}

        <div style={{ ...panelStyle, flex: 1, minWidth: "100px" }}>
          {rightContent}
        </div>
      </div>
    );
  }

  // 3분할 프레임
  if (mode === "triple") {
    const {
      leftContent,
      rightTopContent,
      rightBottomContent,
      leftWidth = "33.333%",
      rightTopHeight = "50%",
      resizable = false,
    } = props as TripleSplitFrameProps;

    const [leftWidthPx, setLeftWidthPx] = useState<number | null>(null);
    const [rightTopHeightPx, setRightTopHeightPx] = useState<number | null>(
      null
    );
    const [isDraggingVertical, setIsDraggingVertical] = useState(false);
    const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const rightContainerRef = useRef<HTMLDivElement>(null);
    const startXRef = useRef<number>(0);
    const startYRef = useRef<number>(0);
    const startWidthRef = useRef<number>(0);
    const startHeightRef = useRef<number>(0);

    useEffect(() => {
      if (containerRef.current && leftWidthPx === null) {
        const containerWidth = containerRef.current.offsetWidth;
        let initialWidth: number;

        if (typeof leftWidth === "number") {
          initialWidth = leftWidth;
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

        if (typeof rightTopHeight === "number") {
          initialHeight = rightTopHeight;
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

    const handleVerticalMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (!resizable) return;
        e.preventDefault();
        setIsDraggingVertical(true);
        startXRef.current = e.clientX;
        startWidthRef.current = leftWidthPx || 0;
        document.body.style.userSelect = "none";
        document.body.style.cursor = "col-resize";
      },
      [leftWidthPx, resizable]
    );

    const handleHorizontalMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (!resizable) return;
        e.preventDefault();
        setIsDraggingHorizontal(true);
        startYRef.current = e.clientY;
        startHeightRef.current = rightTopHeightPx || 0;
        document.body.style.userSelect = "none";
        document.body.style.cursor = "row-resize";
      },
      [rightTopHeightPx, resizable]
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

    const containerStyle: React.CSSProperties = {
      width: "100%",
      height: "100vh",
      display: "flex",
      padding: padding ? theme.spacing.lg : "0",
      userSelect: "none",
      fontFamily: theme.typography.fontFamily,
    };

    const panelStyle: React.CSSProperties = {
      backgroundColor: theme.colors.background.surface,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.border.default}`,
      padding: theme.spacing.lg,
      overflow: "auto",
    };

    const verticalResizerStyle: React.CSSProperties = {
      width: "6px",
      backgroundColor: theme.colors.background.overlay,
      cursor: resizable ? "col-resize" : "default",
      transition: "background-color 0.2s",
      flexShrink: 0,
      margin: `0 ${theme.spacing.xs}`,
      borderRadius: theme.borderRadius.sm,
      border: `1px solid ${theme.colors.border.default}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const horizontalResizerStyle: React.CSSProperties = {
      height: "6px",
      backgroundColor: theme.colors.background.overlay,
      cursor: resizable ? "row-resize" : "default",
      transition: "background-color 0.2s",
      flexShrink: 0,
      margin: `${theme.spacing.xs} 0`,
      borderRadius: theme.borderRadius.sm,
      border: `1px solid ${theme.colors.border.default}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };

    const gripStyle: React.CSSProperties = {
      display: "flex",
      gap: "4px",
    };

    const gripDotStyle: React.CSSProperties = {
      width: "2px",
      height: "16px",
      backgroundColor: theme.colors.text.tertiary,
      borderRadius: theme.borderRadius.pill,
    };

    const gripDotHorizontalStyle: React.CSSProperties = {
      width: "16px",
      height: "2px",
      backgroundColor: theme.colors.text.tertiary,
      borderRadius: theme.borderRadius.pill,
    };

    return (
      <div ref={containerRef} style={containerStyle} className={className}>
        <div
          style={{
            ...panelStyle,
            width: leftWidthPx ? `${leftWidthPx}px` : leftWidth,
            minWidth: "100px",
            flexShrink: 0,
          }}
        >
          {leftContent}
        </div>

        {resizable && (
          <div
            style={verticalResizerStyle}
            onMouseDown={handleVerticalMouseDown}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme.colors.primary.default;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                theme.colors.background.overlay;
            }}
          >
            <div style={gripStyle}>
              <div style={gripDotStyle} />
              <div style={gripDotStyle} />
              <div style={gripDotStyle} />
            </div>
          </div>
        )}

        <div
          ref={rightContainerRef}
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: "100px",
          }}
        >
          <div
            style={{
              ...panelStyle,
              height: rightTopHeightPx
                ? `${rightTopHeightPx}px`
                : rightTopHeight,
              minHeight: "100px",
              flexShrink: 0,
            }}
          >
            {rightTopContent}
          </div>

          {resizable && (
            <div
              style={horizontalResizerStyle}
              onMouseDown={handleHorizontalMouseDown}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme.colors.primary.default;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme.colors.background.overlay;
              }}
            >
              <div style={{ ...gripStyle, flexDirection: "row" }}>
                <div style={gripDotHorizontalStyle} />
                <div style={gripDotHorizontalStyle} />
                <div style={gripDotHorizontalStyle} />
              </div>
            </div>
          )}

          <div style={{ ...panelStyle, flex: 1, minHeight: "100px" }}>
            {rightBottomContent}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
