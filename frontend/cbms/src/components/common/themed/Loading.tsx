/**
 * @파일명 : Loading.tsx
 * @설명 : 공통 로딩 컴포넌트 (신규 테마)
 * @작성일 : 2025.12.09
 */

export interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  fullScreen = true,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: fullScreen ? "100vh" : "auto",
        backgroundColor: "var(--background-default)",
        gap: "24px",
        padding: fullScreen ? "0" : "48px 24px",
      }}
    >
      {/* Spinner */}
      <div
        className="loading-spinner"
        style={{
          width: "48px",
          height: "48px",
          border: "4px solid var(--border-default)",
          borderTopColor: "var(--primary-default)",
          borderRadius: "50%",
        }}
      />

      {/* Loading Text */}
      <p
        style={{
          fontSize: "16px",
          fontWeight: 500,
          color: "var(--text-secondary)",
        }}
      >
        {message}
      </p>
    </div>
  );
};
