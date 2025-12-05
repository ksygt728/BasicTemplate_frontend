import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/**
 * @파일명 : hooks.ts
 * @설명 : Redux 타입 안전 hooks
 * @작성자 : 김승연
 * @작성일 : 2025.12.01
 * @변경이력 :
 *       2025.12.01 김승연 최초 생성
 */

/**
 * @hook useAppDispatch
 * @description 타입이 지정된 useDispatch hook
 * @returns {AppDispatch} dispatch 함수
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * @hook useAppSelector
 * @description 타입이 지정된 useSelector hook
 * @returns {TypedUseSelectorHook<RootState>} selector 함수
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
