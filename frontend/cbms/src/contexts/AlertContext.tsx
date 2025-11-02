"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// Alert 타입 정의
export type AlertType = "info" | "success" | "warning" | "error";

// Alert 구성 옵션 인터페이스
export interface AlertOptions {
  type?: AlertType;
  title?: string;
  message?: string;
  data?: any; // 추가 데이터
  showCancel?: boolean;
  okText?: string;
  cancelText?: string;
  autoClose?: number; // 자동 닫힘 시간 (ms), 0이면 수동으로만 닫힘
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

// Alert 컨텍스트 타입 정의
interface AlertContextType {
  showAlert: (options: AlertOptions) => Promise<boolean>;
  hideAlert: () => void;
}

// Alert 컨텍스트 생성
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Alert Provider Props
interface AlertProviderProps {
  children: ReactNode;
}

// Alert Provider 컴포넌트
export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 상태
  const [alertOptions, setAlertOptions] = useState<AlertOptions>({});
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);
  const [autoCloseTimer, setAutoCloseTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Alert 표시 함수 - useCallback으로 메모이제이션
  const showAlert = useCallback((options: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const finalOptions = {
        type: "info" as AlertType,
        okText: "확인",
        cancelText: "취소",
        showCancel: false,
        autoClose: options.showCancel ? 0 : 3000, // Cancel 버튼이 있으면 수동, 없으면 3초 후 자동 닫힘
        ...options,
      };

      setAlertOptions(finalOptions);
      setIsVisible(true);
      setResolvePromise(() => resolve);

      // 애니메이션 시작
      setTimeout(() => setIsAnimating(true), 10);

      // 자동 닫힘 설정
      if (
        finalOptions.autoClose &&
        finalOptions.autoClose > 0 &&
        !finalOptions.showCancel
      ) {
        const timer = setTimeout(() => {
          handleOk();
        }, finalOptions.autoClose);
        setAutoCloseTimer(timer);
      }
    });
  }, []); // 의존성 배열을 빈 배열로 설정하여 한 번만 생성

  // Alert 숨김 함수
  const hideAlert = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      setAlertOptions({});
      if (resolvePromise) {
        resolvePromise(false);
        setResolvePromise(null);
      }
    }, 300);
  }, [resolvePromise, autoCloseTimer]);

  // OK 버튼 클릭 핸들러
  const handleOk = useCallback(() => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }

    // onOk 콜백 실행
    if (alertOptions.onOk) {
      alertOptions.onOk();
    }

    // 닫힘 애니메이션 시작
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (resolvePromise) {
        resolvePromise(true);
      }
    }, 300); // 애니메이션 지속 시간과 맞춤
  }, [autoCloseTimer, resolvePromise, alertOptions.onOk]);

  // Cancel 버튼 클릭 핸들러
  const handleCancel = useCallback(() => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      setAutoCloseTimer(null);
    }

    // onCancel 콜백 실행
    if (alertOptions.onCancel) {
      alertOptions.onCancel();
    }

    // 닫힘 애니메이션 시작
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (resolvePromise) {
        resolvePromise(false);
      }
    }, 300); // 애니메이션 지속 시간과 맞춤
  }, [autoCloseTimer, resolvePromise, alertOptions.onCancel]);

  // 배경 클릭 시 닫기
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleCancel();
      }
    },
    [handleCancel]
  );

  // 컴포넌트 정리 시 타이머 클리어
  useEffect(() => {
    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
    };
  }, [autoCloseTimer]);

  // Alert가 숨겨질 때 애니메이션 상태 초기화
  useEffect(() => {
    if (!isVisible) {
      setIsAnimating(false);
    }
  }, [isVisible]);

  // 타입별 아이콘과 색상 설정
  const getTypeSettings = () => {
    switch (alertOptions.type) {
      case "success":
        return {
          bgColor: "bg-emerald-500",
          textColor: "text-emerald-500 dark:text-emerald-400",
          label: "Success",
          icon: (
            <svg
              className="w-6 h-6 text-white fill-current"
              viewBox="0 0 40 40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
            </svg>
          ),
        };
      case "warning":
        return {
          bgColor: "bg-yellow-400",
          textColor: "text-yellow-400 dark:text-yellow-300",
          label: "Warning",
          icon: (
            <svg
              className="w-6 h-6 text-white fill-current"
              viewBox="0 0 40 40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
            </svg>
          ),
        };
      case "error":
        return {
          bgColor: "bg-red-500",
          textColor: "text-red-500 dark:text-red-400",
          label: "Error",
          icon: (
            <svg
              className="w-6 h-6 text-white fill-current"
              viewBox="0 0 40 40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
            </svg>
          ),
        };
      default: // info
        return {
          bgColor: "bg-blue-500",
          textColor: "text-blue-500 dark:text-blue-400",
          label: "Info",
          icon: (
            <svg
              className="w-6 h-6 text-white fill-current"
              viewBox="0 0 40 40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
            </svg>
          ),
        };
    }
  };

  // 데이터 렌더링 (JSON 형태로 표시)
  const renderData = () => {
    if (!alertOptions.data) return null;

    return (
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
        <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap overflow-x-auto">
          {typeof alertOptions.data === "string"
            ? alertOptions.data
            : JSON.stringify(alertOptions.data, null, 2)}
        </pre>
      </div>
    );
  };

  const contextValue: AlertContextType = useMemo(
    () => ({
      showAlert,
      hideAlert,
    }),
    [showAlert, hideAlert]
  );

  return (
    <AlertContext.Provider value={contextValue}>
      {children}

      {/* Alert Modal */}
      {isVisible && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
            isAnimating
              ? "translate-y-0 opacity-100 scale-100"
              : "-translate-y-full opacity-0 scale-95"
          }`}
        >
          <div className="px-4 w-screen max-w-screen-sm">
            {/* Toast 스타일 Alert */}
            <div className="flex w-fit min-w-80 max-w-full overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
              {/* 아이콘 영역 */}
              <div
                className={`flex items-center justify-center w-12 ${
                  getTypeSettings().bgColor
                }`}
              >
                {getTypeSettings().icon}
              </div>

              {/* 내용 영역 */}
              <div className="flex-1 px-4 py-2">
                <div className="mx-3">
                  {/* 타입 라벨 */}
                  <span
                    className={`font-semibold ${getTypeSettings().textColor}`}
                  >
                    {alertOptions.title || getTypeSettings().label}
                  </span>

                  {/* 메시지 */}
                  {alertOptions.message && (
                    <p className="text-sm text-gray-600 dark:text-gray-200 mt-1 whitespace-pre-wrap">
                      {alertOptions.message}
                    </p>
                  )}

                  {/* 추가 데이터 */}
                  {renderData()}

                  {/* 버튼들 (필요한 경우에만 표시) */}
                  {alertOptions.showCancel && (
                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        onClick={handleCancel}
                      >
                        {alertOptions.cancelText}
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-1 text-xs font-medium text-white rounded hover:opacity-90 ${
                          getTypeSettings().bgColor
                        }`}
                        onClick={handleOk}
                      >
                        {alertOptions.okText}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 닫기 버튼 (Cancel 버튼이 없는 경우) */}
              {!alertOptions.showCancel && (
                <div className="flex items-center justify-center w-8 pr-2">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={handleOk}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

// useAlert 커스텀 훅
export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
