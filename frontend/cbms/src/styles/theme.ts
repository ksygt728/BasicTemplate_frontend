/**
 * @파일명 : theme.ts
 * @설명 : Linear Dark 테마 정의
 * @작성일 : 2025.12.07
 */

export const theme = {
  colors: {
    background: {
      default: "#08090A",
      subtle: "#141516",
      surface: "#1C1D1F",
      overlay: "#242528",
    },
    text: {
      primary: "#F7F8F8",
      secondary: "#B4B5B8",
      tertiary: "#8A8F98",
      disabled: "#5F6267",
    },
    primary: {
      default: "#5E6AD2",
      hover: "#4E5AC0",
      active: "#3E49A0",
      text: "#FFFFFF",
    },
    border: {
      default: "rgba(255, 255, 255, 0.08)",
      hover: "rgba(255, 255, 255, 0.12)",
      active: "rgba(255, 255, 255, 0.2)",
    },
    status: {
      success: "#27C986",
      warning: "#F2C94C",
      error: "#FF5C5C",
      info: "#5E6AD2",
    },
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    baseSize: "16px",
    lineHeight: {
      tight: "1.2",
      normal: "1.5",
      relaxed: "1.75",
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  borderRadius: {
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
    pill: "9999px",
  },
  effects: {
    shadows: {
      sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
      md: "0 4px 6px rgba(0, 0, 0, 0.4)",
      lg: "0 10px 15px rgba(0, 0, 0, 0.4)",
    },
    blur: {
      backdrop: "blur(12px)",
    },
    transitions: {
      default: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
} as const;

export type Theme = typeof theme;
