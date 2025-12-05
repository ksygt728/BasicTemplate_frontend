/**
 * @파일명 : ValidationService.ts
 * @설명 : 회원가입 폼 Validation 로직을 처리하는 서비스
 * @작성자 : 김승연
 * @작성일 : 2025.12.05
 * @변경이력 :
 *       2025.12.05 김승연 최초 생성
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * @interface ValidationResult
 * @description Validation 결과 타입
 */
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * @interface ValidationRule
 * @description 개별 validation 규칙 타입
 */
export interface ValidationRule {
  text: string;
  isValid: boolean;
}

/**
 * @interface DetailedValidationResult
 * @description 상세 validation 결과 타입 (규칙별 체크 포함)
 */
export interface DetailedValidationResult {
  isValid: boolean;
  rules: ValidationRule[];
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * @function validateUserId
 * @description 사용자 ID 유효성 검사 (영문+숫자, 6~30자)
 * @param {string} userId - 검증할 사용자 ID
 * @returns {DetailedValidationResult} 상세 검증 결과
 */
export const validateUserId = (userId: string): DetailedValidationResult => {
  const hasValidChars = /^[a-zA-Z0-9]*$/.test(userId) && userId.length > 0;
  const hasValidLength = userId.length >= 6 && userId.length <= 30;

  const rules: ValidationRule[] = [
    {
      text: "영문과 숫자만 사용",
      isValid: hasValidChars,
    },
    {
      text: "6~30자 길이",
      isValid: hasValidLength,
    },
  ];

  return {
    isValid: hasValidChars && hasValidLength,
    rules,
  };
};

/**
 * @function validatePassword
 * @description 비밀번호 유효성 검사 (영문+숫자+특수문자, 8자 이상)
 * @param {string} password - 검증할 비밀번호
 * @returns {DetailedValidationResult} 상세 검증 결과
 */
export const validatePassword = (
  password: string
): DetailedValidationResult => {
  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password) && password.length > 0;
  const hasNumber = /\d/.test(password) && password.length > 0;
  const hasSpecialChar = /[@$!%*#?&]/.test(password) && password.length > 0;

  const rules: ValidationRule[] = [
    {
      text: "8자 이상",
      isValid: hasMinLength,
    },
    {
      text: "영문 포함",
      isValid: hasLetter,
    },
    {
      text: "숫자 포함",
      isValid: hasNumber,
    },
    {
      text: "특수문자 포함 (@$!%*#?&)",
      isValid: hasSpecialChar,
    },
  ];

  return {
    isValid: hasMinLength && hasLetter && hasNumber && hasSpecialChar,
    rules,
  };
};

/**
 * @function validatePasswordConfirm
 * @description 비밀번호 확인 검사
 * @param {string} password - 원본 비밀번호
 * @param {string} confirmPassword - 확인 비밀번호
 * @returns {DetailedValidationResult} 상세 검증 결과
 */
export const validatePasswordConfirm = (
  password: string,
  confirmPassword: string
): DetailedValidationResult => {
  const isMatching = password === confirmPassword && confirmPassword.length > 0;

  const rules: ValidationRule[] = [
    {
      text: "비밀번호 일치",
      isValid: isMatching,
    },
  ];

  return {
    isValid: isMatching,
    rules,
  };
};

/**
 * @function validateName
 * @description 이름 유효성 검사 (한글 또는 영문만)
 * @param {string} name - 검증할 이름
 * @returns {DetailedValidationResult} 상세 검증 결과
 */
export const validateName = (name: string): DetailedValidationResult => {
  const hasValidChars = /^[가-힣a-zA-Z\s]+$/.test(name) && name.length > 0;

  const rules: ValidationRule[] = [
    {
      text: "한글 또는 영문만 입력",
      isValid: hasValidChars,
    },
  ];

  return {
    isValid: hasValidChars,
    rules,
  };
};

/**
 * @function validatePhoneNumber
 * @description 전화번호 유효성 검사 (11자리 숫자)
 * @param {string} phoneNumber - 검증할 전화번호
 * @returns {DetailedValidationResult} 상세 검증 결과
 */
export const validatePhoneNumber = (
  phoneNumber: string
): DetailedValidationResult => {
  const isNumericOnly = /^[0-9]*$/.test(phoneNumber) && phoneNumber.length > 0;
  const hasValidLength = phoneNumber.length === 11;

  const rules: ValidationRule[] = [
    {
      text: "숫자만 입력",
      isValid: isNumericOnly,
    },
    {
      text: "11자리 (예: 01012345678)",
      isValid: hasValidLength,
    },
  ];

  return {
    isValid: isNumericOnly && hasValidLength,
    rules,
  };
};

/**
 * @function validateGender
 * @description 성별 선택 검사
 * @param {string} gender - 선택된 성별
 * @returns {DetailedValidationResult} 상세 검증 결과
 */
export const validateGender = (gender: string): DetailedValidationResult => {
  const isSelected = gender !== "" && gender !== undefined;

  const rules: ValidationRule[] = [
    {
      text: "성별 선택 필수",
      isValid: isSelected,
    },
  ];

  return {
    isValid: isSelected,
    rules,
  };
};

/**
 * @function validateEmail
 * @description 이메일 유효성 검사
 * @param {string} email - 검증할 이메일
 * @returns {DetailedValidationResult} 상세 검증 결과
 */
export const validateEmail = (email: string): DetailedValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidFormat = emailRegex.test(email);

  const rules: ValidationRule[] = [
    {
      text: "올바른 이메일 형식 (예: user@example.com)",
      isValid: isValidFormat,
    },
  ];

  return {
    isValid: isValidFormat,
    rules,
  };
};

/**
 * @function validateAllFields
 * @description 모든 필드 일괄 검증
 * @param {object} formData - 폼 데이터
 * @returns {object} 모든 필드의 상세 검증 결과
 */
export const validateAllFields = (formData: {
  userId: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNumber: string;
  gender: string;
  email: string;
}) => {
  return {
    userId: validateUserId(formData.userId),
    password: validatePassword(formData.password),
    confirmPassword: validatePasswordConfirm(
      formData.password,
      formData.confirmPassword
    ),
    name: validateName(formData.name),
    phoneNumber: validatePhoneNumber(formData.phoneNumber),
    gender: validateGender(formData.gender),
    email: validateEmail(formData.email),
  };
};
