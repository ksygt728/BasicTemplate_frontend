import { ResponseApi } from "@/types/commonDto/ResponseApi";
import { UserReqDto } from "@/types/requestDto/UserReqDto";
import { UserResDto } from "@/types/responseDto/UserResDto";
import { AuthReqDto } from "@/types/requestDto/specialDto/AuthReqDto";

/**
 * @파일명 : authApi.ts
 * @설명 : 사용자 인증 관련 기능 제공 API
 * @작성자 : 김승연
 * @작성일 : 2025.07.31
 * @변경이력 :
 *       2025.07.31 김승연 최초 생성
 */
export class AuthApi {
  private static instance: AuthApi;

  private constructor() {}

  public static getInstance(): AuthApi {
    if (!AuthApi.instance) {
      AuthApi.instance = new AuthApi();
    }
    return AuthApi.instance;
  }

  // API 기본 URL 설정
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  private API_AUTH_BASE_URL = `${this.API_BASE_URL}/api/auth`;

  /**
   * @REQ_ID : REQ_CMN_003
   * @화면 : 회원가입
   * @기능 : 회원정보 입력
   * @param user 회원가입 요청 정보
   * @returns 회원가입 결과
   */
  public async signUp(
    user: UserReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.API_AUTH_BASE_URL}/signUp`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_CMN_004
   * @화면 : 로그인
   * @기능 : 일반 로그인(성공)
   * @param user 로그인 요청 정보
   * @returns 로그인 결과 (토큰 정보 포함)
   */
  public async signIn(
    user: AuthReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.API_AUTH_BASE_URL}/signIn`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_CMN_005
   * @화면 : 로그인
   * @기능 : 카카오 계정 로그인
   * @param code 카카오 인증 코드
   * @param state 상태 값
   * @returns 카카오 로그인 결과 (토큰 정보 포함)
   */
  public async signInForKakao(
    code: string,
    state?: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = new URL(`${this.API_AUTH_BASE_URL}/kakao-signIn`);

    url.searchParams.append("code", code);
    if (state) {
      url.searchParams.append("state", state);
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : REQ_CMN_005
   * @화면 : 로그인
   * @기능 : 카카오 콜백 처리
   * @param code 카카오 인증 코드
   * @param state 상태 값
   * @returns 카카오 콜백 결과
   */
  public async kakaoCallback(
    code: string,
    state?: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = new URL(`${this.API_AUTH_BASE_URL}/kakao-callback`);

    url.searchParams.append("code", code);
    if (state) {
      url.searchParams.append("state", state);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : 채번예정
   * @화면 : 로그인
   * @기능 : 문자 인증번호 발송 요청
   * @param phoneNum 휴대폰 번호
   * @returns 문자 인증번호 발송 결과
   */
  public async smsAuth(
    phoneNum: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = new URL(`${this.API_AUTH_BASE_URL}/smsAuth`);

    url.searchParams.append("phoneNum", phoneNum);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : 채번예정
   * @화면 : 로그인
   * @기능 : 문자 인증번호 검증
   * @param phoneNum 휴대폰 번호
   * @param smsCode SMS 인증번호
   * @returns 문자 인증번호 검증 결과
   */
  public async smsAuthValidation(
    phoneNum: string,
    smsCode: string
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = new URL(`${this.API_AUTH_BASE_URL}/smsAuthValidation`);

    url.searchParams.append("phoneNum", phoneNum);
    url.searchParams.append("smsCode", smsCode);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }

  /**
   * @REQ_ID : 테스트용
   * @화면 : 테스트
   * @기능 : 테스트 함수
   * @param user 테스트 요청 정보
   * @returns 테스트 결과
   */
  public async test(
    user: AuthReqDto
  ): Promise<ResponseApi<Map<string, object>>> {
    const url = `${this.API_AUTH_BASE_URL}/test`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await response.json();
  }
}
