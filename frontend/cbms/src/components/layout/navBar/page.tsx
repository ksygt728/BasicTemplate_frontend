"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// API 응답 타입 정의
interface MenuResDto {
  menuCd: string;
  menuNm: string;
  upperMenu: string | null;
  menuLv: number;
  useYn: "Y" | "N";
  menuUrl: string;
  orderNum: number;
  childMenus: MenuResDto[];
}

interface ApiResponse {
  success: boolean;
  errorCode: string | null;
  message: string;
  data: {
    data: MenuResDto[];
  };
}

export default function NavBar() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubMenus, setActiveSubMenus] = useState<{
    [key: string]: string;
  }>({});
  const [menuData, setMenuData] = useState<MenuResDto[]>([]);
  const [loading, setLoading] = useState(true);

  // API에서 메뉴 데이터 가져오기
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        console.log("API_BASE_URL:", API_BASE_URL);

        const response = await fetch(`${API_BASE_URL}/admin/menu/search`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success && data.data.data.length > 0) {
          // menuLv = 0인 최상위 메뉴를 제외하고 menuLv = 1인 메뉴들만 추출
          const rootMenu = data.data.data[0]; // 최상위 메뉴 (menuLv = 0)
          const level1Menus = rootMenu.childMenus;

          setMenuData(level1Menus);
        }
      } catch (error) {
        console.error("메뉴 데이터 로딩 실패:", error);
        // 에러 시 빈 배열로 설정 (또는 기본 메뉴 데이터)
        setMenuData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [API_BASE_URL]);

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
        <a
          href={menu.menuUrl}
          className={`${
            level === 1
              ? "mx-4 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:my-0 cursor-pointer"
              : "flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          }`}
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
        </a>

        {/* 서브메뉴 렌더링 */}
        {hasChildren && (
          <>
            {level === 1 && activeDropdown === menu.menuCd && (
              <div
                className="absolute top-full left-0 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700"
                style={{ zIndex: 9999, display: "block" }}
                onMouseEnter={() => setActiveDropdown(menu.menuCd)}
                onMouseLeave={() => {
                  setActiveDropdown(null);
                  setActiveSubMenus({}); // 최상위 드롭다운을 벗어날 때 모든 서브메뉴도 닫기
                }}
              >
                <div className="py-2">
                  {sortedChildren.map((child) =>
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
                  {sortedChildren.map((child) =>
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
                <a href="#">
                  <Image
                    className="w-auto h-6 sm:h-7"
                    src="https://merakiui.com/images/full-logo.svg"
                    alt="Logo"
                    width={200}
                    height={32}
                  />
                </a>

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
              <div className="flex flex-col md:flex-row md:mx-1">
                <a
                  className="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="#"
                >
                  Home
                </a>
                <a
                  className="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="#"
                >
                  Blog
                </a>
                <a
                  className="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="#"
                >
                  Components
                </a>
                <a
                  className="my-2 text-sm leading-5 text-gray-700 transition-colors duration-300 transform dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:underline md:mx-4 md:my-0"
                  href="#"
                >
                  Courses
                </a>
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
            ) : (
              menuData.map((menu) => renderMenuItem(menu))
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
