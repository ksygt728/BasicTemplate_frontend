"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNavBarMenu } from "@/hooks/common/menuHook";
import type { MenuResDto } from "@/types/responseDto/MenuResDto";
import MainLogo from "@/components/common/logo/MainLogo";
import Breadcrumb from "@/components/common/breadcrumb/Breadcrumb";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useAlert } from "@/contexts/AlertContext";
import Cookies from "js-cookie";
import { Button } from "@/components/common/themed";

export default function NavBar() {
  // Hook을 사용하여 메뉴 데이터 가져오기
  const { menuData, loading, error } = useNavBarMenu();

  // Redux에서 인증 상태 가져오기
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showAlert } = useAlert();
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubMenus, setActiveSubMenus] = useState<{
    [key: string]: string;
  }>({});
  const [clickedMenu, setClickedMenu] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    dispatch(logout());
    setUserDropdownOpen(false);
    router.push("/main");
  };

  // 캐시 삭제 핸들러
  const handleClearCache = () => {
    showAlert({
      type: "info",
      title: "캐시 삭제",
      message: "캐시를 삭제하시겠습니까?",
      showCancel: true,
      okText: "예",
      cancelText: "아니오",
      onOk: () => {
        // 토큰 쿠키 삭제
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        // Redux 상태 초기화
        dispatch(logout());
        // 페이지 새로고침
        window.location.reload();
      },
    });
  };

  // 메뉴 아이템을 재귀적으로 렌더링하는 함수
  const renderMenuItem = (
    menu: MenuResDto,
    level: number = 1
  ): React.ReactElement => {
    const hasChildren = menu.childMenus && menu.childMenus.length > 0;
    const sortedChildren = hasChildren ? menu.childMenus : [];

    return (
      <div
        key={menu.menuCd}
        className={`${
          level === 1
            ? "relative inline-block group mt-3"
            : "relative group/sub"
        }`}
        onMouseEnter={() => {
          if (level === 1) {
            setActiveDropdown(menu.menuCd);
          } else {
            setActiveSubMenus((prev) => ({
              ...prev,
              [`level${level}`]: menu.menuCd,
            }));
          }
        }}
        onMouseLeave={() => {
          if (level === 1) {
            setActiveDropdown(null);
          }
          // level > 1인 경우 onMouseLeave를 제거하여 서브메뉴 간 이동시 메뉴가 유지되도록 함
        }}
      >
        <Link
          href={menu.menuUrl || "#"}
          className={`${
            level === 1
              ? `mx-4 text-sm leading-5 transition-colors duration-300 transform hover:underline md:my-0 cursor-pointer ${
                  clickedMenu === menu.menuCd
                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                }`
              : `flex items-center justify-between px-4 py-2 text-sm transition-colors duration-200 ${
                  clickedMenu === menu.menuCd
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                }`
          }`}
          onClick={(e) => {
            // URL이 없거나 #인 경우 기본 동작 방지
            if (!menu.menuUrl || menu.menuUrl === "#") {
              e.preventDefault();
            } else {
              // 클릭된 메뉴 표시
              setClickedMenu(menu.menuCd);
              // 0.3초 후 클릭 효과 제거
              setTimeout(() => setClickedMenu(null), 300);
            }
          }}
        >
          {menu.menuNm}
          {hasChildren && level > 1 && (
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </Link>

        {/* 서브메뉴 렌더링 */}
        {hasChildren && (
          <>
            {level === 1 && activeDropdown === menu.menuCd && (
              <div
                className="absolute top-full left-0 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700"
                style={{ zIndex: 9999, display: "block" }}
                onMouseEnter={() => setActiveDropdown(menu.menuCd)}
                onMouseLeave={() => {
                  setActiveSubMenus({}); // 최상위 드롭다운을 벗어날 때 모든 서브메뉴도 닫기
                }}
              >
                <div className="py-2">
                  {sortedChildren.map((child: MenuResDto) =>
                    renderMenuItem(child, level + 1)
                  )}
                </div>
              </div>
            )}
            {level > 1 && activeSubMenus[`level${level}`] === menu.menuCd && (
              <div
                className="absolute top-0 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700"
                style={{
                  zIndex: 10000 + level,
                  left: "calc(100%)",
                }}
                onMouseEnter={() =>
                  setActiveSubMenus((prev) => ({
                    ...prev,
                    [`level${level}`]: menu.menuCd,
                  }))
                }
              >
                <div className="py-2">
                  {sortedChildren.map((child: MenuResDto) =>
                    renderMenuItem(child, level + 1)
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <nav className="relative bg-white shadow dark:bg-gray-800">
        <div className="container px-6 py-3 mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MainLogo />

                {/* Search input on desktop screen */}
                <div className="hidden mx-10 md:block">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </span>

                    <input
                      type="text"
                      className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                      placeholder="Search"
                    />
                  </div>
                </div>

                {/* Breadcrumb navigation */}
                <div className="hidden md:block ml-6">
                  <Breadcrumb />
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex lg:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                  aria-label="toggle menu"
                >
                  {!isOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 8h16M4 16h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <div
              className={`absolute inset-x-0 z-20 w-full px-6 py-2 transition-all duration-300 ease-in-out bg-white top-24 dark:bg-gray-800 md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center ${
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "opacity-0 -translate-x-full"
              }`}
            >
              <div className="flex flex-col md:flex-row md:mx-1 md:items-center">
                <Link
                  className="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="/main"
                >
                  예비버튼1
                </Link>
                <Link
                  className="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="/main"
                >
                  예비버튼2
                </Link>
                <Button
                  onClick={handleClearCache}
                  className="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0 text-left"
                >
                  캐시삭제
                </Button>
                {isAuthenticated && user ? (
                  <div
                    className="relative md:mx-4 flex items-center"
                    ref={userDropdownRef}
                  >
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 my-2 md:my-0 text-sm leading-5 text-gray-700 dark:text-gray-200 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm hover:shadow-md transition-shadow duration-200">
                        {user.name?.charAt(0) || "U"}
                      </div>
                      <span className="hidden md:inline">{user.name}님</span>
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          userDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                        <div className="py-2">
                          <Link
                            href="/mypage"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            MyPage
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            로그아웃
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    className="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                    href="/signIn"
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* Search input on mobile screen */}
              <div className="my-4 md:hidden">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </span>

                  <input
                    type="text"
                    className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Menu List*/}
          <div className="py-1 mt-1 -mx-5 whitespace-nowrap relative overflow-visible">
            {loading ? (
              <div className="text-gray-500">loading...</div>
            ) : error ? (
              <div className="text-red-500">
                메뉴 로딩 중 오류가 발생했습니다: {error}
              </div>
            ) : (
              menuData.map((menu) => renderMenuItem(menu))
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
