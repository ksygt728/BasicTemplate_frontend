/**
 * @파일명 : info.tsx
 * @설명 : 메뉴 관리 화면의 정보 설정 (필드 정의)
 * @작성자 : 김승연
 * @작성일 : 2025.12.11
 * @변경이력 :
 *       2025.12.11 김승연 최초 생성
 */

/**
 * @constant menuFormFields
 * @description 메뉴 폼 필드 정의
 */
export const menuFormFields = {
  menuCd: {
    label: "메뉴 코드",
    required: true,
    placeholder: "메뉴 코드를 입력하세요",
  },
  menuNm: {
    label: "메뉴명",
    required: true,
    placeholder: "메뉴명을 입력하세요",
  },
  upperMenu: {
    label: "상위 메뉴",
    required: true,
    placeholder: "상위 메뉴를 선택하세요",
  },
  menuLv: {
    label: "메뉴 레벨",
    required: true,
    placeholder: "메뉴 레벨을 입력하세요",
  },
  useYn: {
    label: "사용 여부",
    required: true,
    options: [
      { value: "Y", label: "사용" },
      { value: "N", label: "미사용" },
    ],
  },
  menuUrl: {
    label: "메뉴 URL",
    required: false,
    placeholder: "메뉴 URL을 입력하세요 (예: /admin/menu)",
  },
  orderNum: {
    label: "정렬 순서",
    required: true,
    placeholder: "정렬 순서를 입력하세요",
  },
};

/**
 * @constant initialMenuFormData
 * @description 메뉴 폼 초기값
 */
export const initialMenuFormData = {
  menuCd: "",
  menuNm: "",
  upperMenu: "",
  menuLv: 1,
  useYn: "",
  menuUrl: "",
  orderNum: 0,
};
