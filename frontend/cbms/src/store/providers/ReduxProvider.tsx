"use client";

import { Provider } from "react-redux";
import { store } from "../store";
import { ReactNode } from "react";

/**
 * @파일명 : ReduxProvider.tsx
 * @설명 : Redux Provider 컴포넌트 (Client Component)
 * @작성자 : 김승연
 * @작성일 : 2025.12.01
 * @변경이력 :
 *       2025.12.01 김승연 최초 생성
 */

interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * @component ReduxProvider
 * @description Next.js App Router에서 사용하기 위한 Redux Provider
 */
export default function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
