/**
 * @파일명 : SearchForm.tsx
 * @설명 : 테마 기반 재사용 가능한 검색 폼 컴포넌트
 * @작성일 : 2025.12.07
 */

"use client";

import React from "react";
import { theme } from "@/styles/theme";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select } from "./Select";

export interface SearchField {
  name: string;
  label: string;
  type: "text" | "select" | "date" | "dateRange" | "number" | "email";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
}

export interface SearchFormProps {
  fields: SearchField[];
  onSearch: (searchData: Record<string, any>) => void;
  onReset?: () => void;
  loading?: boolean;
  layout?: "horizontal" | "vertical";
  columns?: 1 | 2 | 3 | 4;
  searchButtonText?: string;
  resetButtonText?: string;
  initialValues?: Record<string, any>;
  className?: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  fields,
  onSearch,
  onReset,
  loading = false,
  layout = "horizontal",
  columns = 3,
  searchButtonText = "Search",
  resetButtonText = "Reset",
  initialValues = {},
  className = "",
}) => {
  const [searchData, setSearchData] =
    React.useState<Record<string, any>>(initialValues);

  const handleChange = (name: string, value: any) => {
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const handleReset = () => {
    setSearchData(initialValues);
    if (onReset) {
      onReset();
    } else {
      onSearch(initialValues);
    }
  };

  const renderField = (field: SearchField) => {
    const value = searchData[field.name] ?? field.defaultValue ?? "";

    switch (field.type) {
      case "select":
        return (
          <Select
            label={field.label}
            value={value}
            onChange={(val) => handleChange(field.name, val)}
            options={field.options || []}
            placeholder={field.placeholder}
            disabled={field.disabled || loading}
            fullWidth
          />
        );

      case "date":
        return (
          <Input
            type="date"
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled || loading}
            fullWidth
          />
        );

      case "dateRange":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing.xs,
            }}
          >
            <label
              style={{
                fontSize: "14px",
                fontWeight: theme.typography.weights.medium,
                color: theme.colors.text.primary,
              }}
            >
              {field.label}
            </label>
            <div
              style={{
                display: "flex",
                gap: theme.spacing.sm,
                alignItems: "center",
              }}
            >
              <Input
                type="date"
                value={searchData[`${field.name}Start`] || ""}
                onChange={(e) =>
                  handleChange(`${field.name}Start`, e.target.value)
                }
                disabled={field.disabled || loading}
                fullWidth
              />
              <span style={{ color: theme.colors.text.secondary }}>~</span>
              <Input
                type="date"
                value={searchData[`${field.name}End`] || ""}
                onChange={(e) =>
                  handleChange(`${field.name}End`, e.target.value)
                }
                disabled={field.disabled || loading}
                fullWidth
              />
            </div>
          </div>
        );

      case "number":
        return (
          <Input
            type="number"
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled || loading}
            fullWidth
          />
        );

      case "email":
        return (
          <Input
            type="email"
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled || loading}
            fullWidth
          />
        );

      case "text":
      default:
        return (
          <Input
            type="text"
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled || loading}
            fullWidth
          />
        );
    }
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    borderRadius: theme.borderRadius.lg,
    padding: 0,
    border: "none",
  };

  const formStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns:
      layout === "vertical" ? "1fr" : `repeat(${columns}, 1fr)`,
    gap: theme.spacing.md,
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    gridColumn: layout === "vertical" ? "1" : `1 / -1`,
    justifyContent: "flex-end",
  };

  return (
    <div style={containerStyle} className={className}>
      <form onSubmit={handleSubmit}>
        <div style={formStyle}>
          {fields.map((field) => (
            <div key={field.name}>{renderField(field)}</div>
          ))}
        </div>

        <div style={buttonGroupStyle}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={loading}
            leftIcon="↻"
          >
            {resetButtonText}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            leftIcon="🔍"
          >
            {searchButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
};
