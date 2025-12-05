import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * @파일명 : middleware.ts
 * @설명 : Next.js Middleware - 인증 체크 및 리다이렉트 처리
 * @작성자 : 김승연
 * @작성일 : 2025.12.05
 * @변경이력 :
 *       2025.12.05 김승연 최초 생성
 */

// Default : 토큰상관 없이 접근 허용

// 인증이 필요한 경로들
const protectedPaths = ["/main/admin"];

// 인증 후 접근 불가한 경로들 (로그인, 회원가입 등)
const authPaths = ["/signIn", "/signUp"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 쿠키에서 토큰 확인
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const hasToken = accessToken || refreshToken;

  // 보호된 경로 접근 시 토큰 체크
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!hasToken) {
      // 토큰 없으면 로그인 페이지로 리다이렉트 (원래 경로를 redirect 파라미터로 전달)
      const url = request.nextUrl.clone();
      url.pathname = "/signIn";
      url.searchParams.set("redirect", pathname); // 원래 가려던 경로 저장
      return NextResponse.redirect(url);
    }
  }

  // 인증 페이지 접근 시 (이미 로그인된 경우)
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (hasToken) {
      // 이미 로그인되어 있으면 redirect 파라미터가 있으면 그곳으로, 없으면 메인으로
      const url = request.nextUrl.clone();
      const redirect = url.searchParams.get("redirect");
      url.pathname = redirect || "/main";
      url.searchParams.delete("redirect"); // 파라미터 제거
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Middleware가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
