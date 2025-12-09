/**
 * @파일명 : ThemedNavBar.tsx
 * @설명 : 기존 MenuResDto 구조를 themed NavBar로 변환하는 래퍼 컴포넌트
 * @작성일 : 2025.12.07
 */

"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { NavBar } from "@/components/common/themed";
import type { NavMenuItem } from "@/components/common/themed";
import type { MenuResDto } from "@/types/responseDto/MenuResDto";
import { useNavBarMenu } from "@/hooks/common/menuHook";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useAlert } from "@/contexts/AlertContext";
import Cookies from "js-cookie";

/**
 * MenuResDto를 NavMenuItem으로 변환하는 재귀 함수
 */
const convertMenuToNavItem = (menu: MenuResDto): NavMenuItem => {
  const hasChildren = menu.childMenus && menu.childMenus.length > 0;

  return {
    id: menu.menuCd,
    label: menu.menuNm,
    url: menu.menuUrl || "#",
    children: hasChildren
      ? menu.childMenus!.map((child) => convertMenuToNavItem(child))
      : undefined,
  };
};

export default function ThemedNavBar() {
  const { menuData, loading, error } = useNavBarMenu();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { showAlert } = useAlert();
  const [searchQuery, setSearchQuery] = useState("");

  // 메뉴 데이터를 NavMenuItem 형식으로 변환
  const menuItems: NavMenuItem[] = menuData
    ? menuData.map((menu) => convertMenuToNavItem(menu))
    : [];

  // Breadcrumb 생성 로직
  const generateBreadcrumbs = ():
    | { label: string; url?: string }[]
    | undefined => {
    // /main 페이지에서는 breadcrumb 표시하지 않음
    if (pathname === "/main") {
      return undefined;
    }

    if (!menuData || menuData.length === 0) return undefined;

    // 메뉴 트리에서 현재 경로 찾기
    const findMenuPath = (
      menus: MenuResDto[],
      targetPath: string
    ): MenuResDto[] | null => {
      for (const menu of menus) {
        if (menu.menuUrl === targetPath) {
          return [menu];
        }

        if (menu.childMenus && menu.childMenus.length > 0) {
          const childPath = findMenuPath(menu.childMenus, targetPath);
          if (childPath) {
            return [menu, ...childPath];
          }
        }
      }
      return null;
    };

    const menuPath = findMenuPath(menuData, pathname);
    if (!menuPath) return undefined;

    const breadcrumbs: { label: string; url?: string }[] = [
      { label: "Main", url: "/main" },
    ];

    menuPath.forEach((menu, index) => {
      breadcrumbs.push({
        label: menu.menuNm,
        url:
          index === menuPath.length - 1 ? undefined : menu.menuUrl || undefined,
      });
    });

    return breadcrumbs;
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    const result = await showAlert({
      type: "warning",
      title: "로그아웃",
      message: "로그아웃 하시겠습니까?",
      showCancel: true,
      okText: "로그아웃",
      cancelText: "취소",
    });

    if (result) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      dispatch(logout());
      router.push("/signIn");
    }
  };

  // 캐시 삭제 핸들러
  const handleClearCache = async () => {
    const result = await showAlert({
      type: "info",
      title: "캐시 삭제",
      message: "캐시를 삭제하시겠습니까?",
      showCancel: true,
      okText: "예",
      cancelText: "아니오",
    });

    if (result) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      dispatch(logout());
      window.location.reload();
    }
  };

  // 검색 핸들러
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // TODO: 검색 기능 구현
  };

  // 사용자 메뉴 아이템 - onClick 없이 url만 사용
  const userMenuItems: NavMenuItem[] = isAuthenticated
    ? [
        {
          id: "profile",
          label: "프로필",
          url: "/main/profile",
        },
        {
          id: "settings",
          label: "설정",
          url: "/main/settings",
        },
      ]
    : [
        {
          id: "signIn",
          label: "로그인",
          url: "/signIn",
        },
        {
          id: "signUp",
          label: "회원가입",
          url: "/signUp",
        },
      ];

  // 사용자 정보 (로그아웃 버튼을 직접 제어)
  const userInfo = isAuthenticated
    ? {
        name: user?.name || "사용자",
        email: user?.email || "",
        avatar: undefined,
      }
    : undefined;

  if (loading) {
    return (
      <div
        style={{
          height: "64px",
          background: "var(--background-surface)",
          borderBottom: "1px solid var(--border-default)",
        }}
      />
    );
  }

  if (error) {
    console.error("NavBar error:", error);
  }

  return (
    <NavBar
      logo={
        <Link href="/main" style={{ textDecoration: "none", color: "inherit" }}>
          <span style={{ fontWeight: 600, fontSize: "20px" }}>CBMS</span>
        </Link>
      }
      menuItems={menuItems}
      breadcrumbs={generateBreadcrumbs()}
      user={
        isAuthenticated
          ? {
              name: user?.name || "Guest",
              avatar: user?.email ? user.email.charAt(0).toUpperCase() : "G",
            }
          : undefined
      }
      onLogout={isAuthenticated ? handleLogout : undefined}
      onSearch={handleSearch}
      searchPlaceholder="검색..."
      extraButtons={
        isAuthenticated ? (
          <button
            onClick={handleClearCache}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "var(--background-overlay)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--background-surface)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--background-overlay)";
            }}
          >
            캐시삭제
          </button>
        ) : undefined
      }
    />
  );
}
