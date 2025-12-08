/**
 * @파일명 : Select.tsx
 * @설명 : 테마 기반 재사용 가능한 셀렉트 박스 컴포넌트
 * @작성일 : 2025.12.07
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { theme } from "@/styles/theme";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  disabled = false,
  fullWidth = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    onChange?.(optionValue);
  };

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.xs,
    width: fullWidth ? "100%" : "auto",
    position: "relative",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily,
  };

  const selectButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.colors.background.surface,
    color: selectedOption
      ? theme.colors.text.primary
      : theme.colors.text.tertiary,
    border: `1px solid ${
      error ? theme.colors.status.error : theme.colors.border.default
    }`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.baseSize,
    fontFamily: theme.typography.fontFamily,
    cursor: disabled ? "not-allowed" : "pointer",
    outline: "none",
    transition: theme.effects.transitions.default,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    opacity: disabled ? 0.5 : 1,
  };

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.background.overlay,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.effects.shadows.lg,
    maxHeight: "240px",
    overflowY: "auto",
    zIndex: 1000,
    display: isOpen ? "block" : "none",
  };

  const optionStyle = (
    option: SelectOption,
    isSelected: boolean
  ): React.CSSProperties => ({
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontSize: theme.typography.baseSize,
    fontFamily: theme.typography.fontFamily,
    color: option.disabled
      ? theme.colors.text.disabled
      : theme.colors.text.primary,
    backgroundColor: isSelected ? theme.colors.primary.default : "transparent",
    cursor: option.disabled ? "not-allowed" : "pointer",
    transition: theme.effects.transitions.default,
    opacity: option.disabled ? 0.5 : 1,
  });

  const errorStyle: React.CSSProperties = {
    fontSize: "12px",
    color: theme.colors.status.error,
    fontFamily: theme.typography.fontFamily,
  };

  const arrowStyle: React.CSSProperties = {
    fontSize: "12px",
    color: theme.colors.text.tertiary,
    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
    transition: theme.effects.transitions.default,
  };

  return (
    <div ref={containerRef} style={containerStyle} className={className}>
      {label && <label style={labelStyle}>{label}</label>}

      <button
        type="button"
        style={selectButtonStyle}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = theme.colors.primary.default;
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error
            ? theme.colors.status.error
            : theme.colors.border.default;
        }}
        disabled={disabled}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span style={arrowStyle}>▼</span>
      </button>

      <div style={dropdownStyle}>
        {options.map((option) => {
          const isSelected = option.value === selectedValue;
          return (
            <div
              key={option.value}
              style={optionStyle(option, isSelected)}
              onClick={() => !option.disabled && handleSelect(option.value)}
              onMouseEnter={(e) => {
                if (!option.disabled && !isSelected) {
                  e.currentTarget.style.backgroundColor =
                    theme.colors.background.surface;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {option.label}
              {isSelected && (
                <span
                  style={{
                    marginLeft: theme.spacing.sm,
                    color: theme.colors.primary.text,
                  }}
                >
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>

      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};
