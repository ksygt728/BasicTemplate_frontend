/**
 * @파일명 : DateRangePicker.tsx
 * @설명 : 날짜 범위 선택 컴포넌트 (시작일/종료일 분리)
 * @작성일 : 2025.12.16
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { theme } from "@/styles/theme";

export interface DateRangePickerProps {
  value?: string; // "2025-08-08 00:00:00~2025-12-18 23:59:59" 형식
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  label?: string; // "시작일자" 또는 "종료일자"
  isEndDate?: boolean; // true면 종료일자 (23:59:59), false면 시작일자 (00:00:00)
  error?: boolean; // validation 실패 시 true
  errorMessage?: string; // 에러 메시지
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value = "",
  onChange,
  placeholder = "날짜 범위를 선택하세요",
  disabled = false,
  fullWidth = false,
  label = "조회기간",
  isEndDate = false,
  error = false,
  errorMessage = "시작일자와 종료일자를 모두 입력하거나 모두 비워주세요",
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const onChangeRef = useRef(onChange);

  // onChange ref를 최신 상태로 유지
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // value prop을 개별 필드로 파싱
  useEffect(() => {
    if (value && value.includes("~")) {
      const [start, end] = value.split("~");
      if (start) {
        const [date] = start.trim().split(" ");
        setStartDate(date || "");
      }
      if (end) {
        const [date] = end.trim().split(" ");
        setEndDate(date || "");
      }
    } else if (value === "") {
      // Reset 시 날짜 필드 초기화
      setStartDate("");
      setEndDate("");
    }
  }, [value]);

  // 개별 필드가 변경될 때 백엔드 포맷으로 변환하여 onChange 호출
  useEffect(() => {
    if (startDate && endDate) {
      const start = `${startDate} 00:00:00.000`;
      const end = `${endDate} 23:59:59.999`;
      const formattedValue = `${start}~${end}`;
      onChangeRef.current?.(formattedValue);
    } else if (!startDate && !endDate) {
      // 둘 다 비어있으면 빈 문자열 전달
      onChangeRef.current?.("");
    } else {
      // 하나만 입력된 경우: 불완전한 형식으로 전달 (validation에서 걸리도록)
      const start = startDate ? `${startDate} 00:00:00.000` : "";
      const end = endDate ? `${endDate} 23:59:59.999` : "";
      const formattedValue = `${start}~${end}`;
      onChangeRef.current?.(formattedValue);
    }
  }, [startDate, endDate]);

  const inputStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontSize: "14px",
    border: error
      ? `2px solid ${theme.colors.status.error}`
      : `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    outline: "none",
    backgroundColor: disabled
      ? theme.colors.background.subtle
      : theme.colors.background.surface,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily,
    transition: theme.effects.transitions.default,
    width: fullWidth ? "100%" : "140px",
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.xs,
    width: fullWidth ? "100%" : "auto",
  };

  const inputContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.sm,
    width: fullWidth ? "100%" : "auto",
  };

  const separatorStyle: React.CSSProperties = {
    fontSize: "14px",
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.weights.medium,
  };

  const errorTextStyle: React.CSSProperties = {
    fontSize: "12px",
    color: theme.colors.status.error,
    marginTop: theme.spacing.xs,
  };

  return (
    <div style={containerStyle}>
      <div style={inputContainerStyle}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={disabled}
          style={inputStyle}
          placeholder={placeholder}
        />
        <span style={separatorStyle}>~</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={disabled}
          style={inputStyle}
          placeholder={placeholder}
        />
      </div>
      {error && errorMessage && (
        <div style={errorTextStyle}>{errorMessage}</div>
      )}
    </div>
  );
};
