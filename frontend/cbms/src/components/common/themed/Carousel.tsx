/**
 * @파일명 : Carousel.tsx
 * @설명 : 테마 적용된 캐루셀 컴포넌트
 * @작성일 : 2025.12.07
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { theme } from "@/styles/theme";

export interface CarouselItem {
  id: string | number;
  content: React.ReactNode;
}

export interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  loop?: boolean;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  interval = 3000,
  showDots = true,
  showArrows = true,
  loop = true,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToNext = useCallback(() => {
    if (loop) {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1));
    }
  }, [items.length, loop]);

  const goToPrev = useCallback(() => {
    if (loop) {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    } else {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  }, [items.length, loop]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (autoPlay && !isHovered && items.length > 1) {
      const timer = setInterval(goToNext, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, isHovered, interval, goToNext, items.length]);

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background.surface,
    minHeight: "400px", // 최소 높이 설정
  };

  const slideContainerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "400px", // 컨테이너 높이 보장
  };

  const slideStyle = (index: number): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: index === currentIndex ? 1 : 0,
    transition: "opacity 0.5s ease-in-out",
    pointerEvents: index === currentIndex ? "auto" : "none",
  });

  const arrowButtonStyle = (
    direction: "left" | "right"
  ): React.CSSProperties => ({
    position: "absolute",
    top: "50%",
    [direction]: theme.spacing.md,
    transform: "translateY(-50%)",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    border: "none",
    color: "#FFFFFF",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    zIndex: 2,
    opacity: isHovered ? 1 : 0.6,
  });

  const dotsContainerStyle: React.CSSProperties = {
    position: "absolute",
    bottom: theme.spacing.md,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: theme.spacing.xs,
    zIndex: 2,
  };

  const dotStyle = (isActive: boolean): React.CSSProperties => ({
    width: isActive ? "24px" : "8px",
    height: "8px",
    borderRadius: theme.borderRadius.pill,
    backgroundColor: isActive
      ? theme.colors.primary.default
      : "rgba(255, 255, 255, 0.5)",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  });

  if (items.length === 0) {
    return (
      <div style={containerStyle} className={className}>
        <div
          style={{
            padding: theme.spacing.xl,
            textAlign: "center",
            color: theme.colors.text.secondary,
          }}
        >
          No items to display
        </div>
      </div>
    );
  }

  return (
    <div
      style={containerStyle}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={slideContainerStyle}>
        {items.map((item, index) => (
          <div key={item.id} style={slideStyle(index)}>
            {item.content}
          </div>
        ))}
      </div>

      {showArrows && items.length > 1 && (
        <>
          <button
            style={arrowButtonStyle("left")}
            onClick={goToPrev}
            aria-label="Previous slide"
            disabled={!loop && currentIndex === 0}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            }}
          >
            ‹
          </button>
          <button
            style={arrowButtonStyle("right")}
            onClick={goToNext}
            aria-label="Next slide"
            disabled={!loop && currentIndex === items.length - 1}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            }}
          >
            ›
          </button>
        </>
      )}

      {showDots && items.length > 1 && (
        <div style={dotsContainerStyle}>
          {items.map((_, index) => (
            <button
              key={index}
              style={dotStyle(index === currentIndex)}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
