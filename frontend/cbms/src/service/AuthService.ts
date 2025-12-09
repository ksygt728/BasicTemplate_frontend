/**
 * @파일명 : AuthService.ts
 * @설명 : 회원가입 관련 비즈니스 로직 처리 서비스
 * @작성자 : 김승연
 * @작성일 : 2025.12.05
 * @변경이력 :
 *       2025.12.05 김승연 최초 생성
 */

import { useState } from "react";
import { useAuthApi } from "@/hooks/common/useAuthApi";
import {
  validateUserId,
  validatePassword,
  validatePasswordConfirm,
  validateName,
  validatePhoneNumber,
  validateGender,
  validateEmail,
  validateAllFields,
  DetailedValidationResult,
} from "./ValidationService";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface SignUpFormData
 * @description 회원가입 폼 데이터 타입
 */
export interface SignUpFormData {
  userId: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
  gender: string;
  email: string;
}

/**
 * @interface SignUpValidations
 * @description 회원가입 폼 검증 결과 타입
 */
export interface SignUpValidations {
  userId: DetailedValidationResult;
  password: DetailedValidationResult;
  confirmPassword: DetailedValidationResult;
  name: DetailedValidationResult;
  phoneNumber: DetailedValidationResult;
  gender: DetailedValidationResult;
  email: DetailedValidationResult;
}

// ============================================================================
// Initial State
// ============================================================================

/**
 * @constant initialFormData
 * @description 회원가입 폼 초기 데이터
 */
export const initialFormData: SignUpFormData = {
  userId: "",
  password: "",
  confirmPassword: "",
  name: "",
  phoneNumber: "",
  gender: "",
  email: "",
};

/**
 * @constant initialValidations
 * @description 회원가입 폼 검증 초기 상태
 */
export const initialValidations: SignUpValidations = {
  userId: { isValid: false, rules: [] },
  password: { isValid: false, rules: [] },
  confirmPassword: { isValid: false, rules: [] },
  name: { isValid: false, rules: [] },
  phoneNumber: { isValid: false, rules: [] },
  gender: { isValid: false, rules: [] },
  email: { isValid: false, rules: [] },
};

// ============================================================================
// Business Logic Functions
// ============================================================================

/**
 * @function handleFieldValidation
 * @description 개별 필드 실시간 검증 처리
 * @param {string} fieldName - 검증할 필드명
 * @param {string} value - 검증할 값
 * @param {SignUpFormData} currentFormData - 현재 폼 데이터
 * @returns {Partial<SignUpValidations>} 업데이트된 검증 결과
 */
export const handleFieldValidation = (
  fieldName: keyof SignUpFormData,
  value: string,
  currentFormData: SignUpFormData
): Partial<SignUpValidations> => {
  const updates: Partial<SignUpValidations> = {};

  switch (fieldName) {
    case "userId":
      updates.userId = validateUserId(value);
      break;

    case "password":
      updates.password = validatePassword(value);
      // 비밀번호 변경 시 확인 비밀번호도 재검증
      if (currentFormData.confirmPassword) {
        updates.confirmPassword = validatePasswordConfirm(
          value,
          currentFormData.confirmPassword
        );
      }
      break;

    case "confirmPassword":
      updates.confirmPassword = validatePasswordConfirm(
        currentFormData.password,
        value
      );
      break;

    case "name":
      updates.name = validateName(value);
      break;

    case "phoneNumber":
      updates.phoneNumber = validatePhoneNumber(value);
      break;

    case "gender":
      updates.gender = validateGender(value);
      break;

    case "email":
      updates.email = validateEmail(value);
      break;
  }

  return updates;
};

/**
 * @function validateFormData
 * @description 전체 폼 데이터 검증
 * @param {SignUpFormData} formData - 검증할 폼 데이터
 * @returns {SignUpValidations} 전체 필드 검증 결과
 */
export const validateFormData = (
  formData: SignUpFormData
): SignUpValidations => {
  return validateAllFields(formData);
};

/**
 * @function isFormValid
 * @description 폼 유효성 확인
 * @param {SignUpValidations} validations - 검증 결과
 * @returns {boolean} 모든 필드가 유효한지 여부
 */
export const isFormValid = (validations: SignUpValidations): boolean => {
  return Object.values(validations).every((result) => result.isValid);
};

/**
 * @function convertGenderValue
 * @description Gender 값을 백엔드 형식으로 변환
 * @param {string} gender - 폼에서 입력된 gender 값 (male/female)
 * @returns {string} 변환된 gender 값 (M/F)
 */
export const convertGenderValue = (gender: string): string => {
  const upperGender = gender.toUpperCase();
  if (upperGender === "MALE") return "M";
  if (upperGender === "FEMALE") return "F";
  return upperGender;
};

/**
 * @function convertToUserReqDto
 * @description 회원가입 폼 데이터를 백엔드 API 요청 DTO로 변환
 * @param {SignUpFormData} formData - 제출할 폼 데이터
 * @returns {UserReqDto} 백엔드 API 요청 DTO
 */
export const convertToUserReqDto = (formData: SignUpFormData) => {
  return {
    userId: formData.userId,
    password: formData.password,
    name: formData.name,
    phoneNum: formData.phoneNumber,
    email: formData.email,
    userType: "NORMAL",
    gender: convertGenderValue(formData.gender),
    deptCode: "20000000",
  };
};

/**
 * @function handleSignUpSubmit
 * @description 회원가입 제출 전체 로직 처리 (검증 + DTO 변환)
 * @param {SignUpFormData} formData - 제출할 폼 데이터
 * @param {SignUpValidations} validations - 현재 검증 상태
 * @returns {{isValid: boolean, userReqDto?: any, validationResults?: SignUpValidations}} 처리 결과
 */
export const handleSignUpSubmit = (
  formData: SignUpFormData,
  validations: SignUpValidations
) => {
  // 전체 필드 검증
  const validationResults = validateFormData(formData);

  // 모든 필드가 유효한지 확인
  if (!isFormValid(validationResults)) {
    return {
      isValid: false,
      validationResults,
    };
  }

  // DTO 변환
  const userReqDto = convertToUserReqDto(formData);

  return {
    isValid: true,
    userReqDto,
  };
};

// ============================================================================
// Custom Hook
// ============================================================================

/**
 * @hook useAuthService
 * @description 회원가입 관련 비즈니스 로직을 처리하는 서비스 훅
 * @returns 회원가입 관련 상태 및 함수들
 */
export const useAuthService = () => {
  const { handleSignUpWithValidation, loading } = useAuthApi();
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData);
  const [validations, setValidations] =
    useState<SignUpValidations>(initialValidations);

  /**
   * @function handleChange
   * @description 입력 변경 핸들러
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof SignUpFormData;

    // 폼 데이터 업데이트
    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // 실시간 Validation 업데이트
    const validationUpdates = handleFieldValidation(fieldName, value, formData);
    setValidations((prev) => ({ ...prev, ...validationUpdates }));
  };

  /**
   * @function handleSubmit
   * @description 폼 제출 핸들러
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<{
    success: boolean;
    validationResults?: SignUpValidations;
    message?: string;
  }> => {
    e.preventDefault();

    // useAuthApi로 검증 + API 호출 + 리다이렉트 처리
    const result = await handleSignUpWithValidation(
      formData,
      validations,
      handleSignUpSubmit
    );

    // 검증 실패
    if (!result.success && result.validationResults) {
      setValidations(result.validationResults);
    }

    return result;
  };

  return {
    // 상태
    loading,
    formData,
    validations,

    // 핸들러
    handleChange,
    handleSubmit,
  };
};
