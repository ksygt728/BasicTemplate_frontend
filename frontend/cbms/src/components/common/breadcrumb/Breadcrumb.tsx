"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useBreadcrumbMenu } from "@/hooks/common/menuHook";
import type { MenuResDto } from "@/types/responseDto/MenuResDto";

/**
 * @파일명 : Breadcrumb.tsx
 * @설명 : 현재 경로를 표시하는 breadcrumb 컴포넌트
 * @작성자 : 김승연
 * @작성일 : 2025.11.02
 * @변경이력 :
 *       2025.12.04 김승연 useBreadcrumbMenu로 변경 (Redux에서만 읽음)
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  const { menuData } = useBreadcrumbMenu(); // Redux에서만 읽음 (API 호출 없음)

  // 메뉴 트리에서 현재 경로에 해당하는 메뉴 찾기
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

  // 현재 경로에 해당하는 메뉴 경로 생성
  const generateBreadcrumb = (): BreadcrumbItem[] => {
    // Main 페이지는 기본 breadcrumb만 표시
    if (pathname === "/main") {
      return [{ label: "Main" }];
    }

    if (!menuData || menuData.length === 0) return [];

    const menuPath = findMenuPath(menuData, pathname);
    if (!menuPath) {
      // 메뉴를 못 찾으면 Main만 표시
      return [{ label: "Main" }];
    }

    const breadcrumbItems: BreadcrumbItem[] = [
      { label: "Main", href: "/main" },
    ];

    menuPath.forEach((menu, index) => {
      breadcrumbItems.push({
        label: menu.menuNm,
        href:
          index === menuPath.length - 1 ? undefined : menu.menuUrl || undefined,
      });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = generateBreadcrumb();

  // 빈 배열이면 렌더링하지 않음
  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "14px",
        color: "var(--text-secondary)",
      }}
    >
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg
              style={{
                width: "16px",
                height: "16px",
                color: "var(--text-tertiary)",
              }}
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
          {item.href ? (
            <Link
              href={item.href}
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--primary-default)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span
              style={{
                color: "var(--text-primary)",
                fontWeight: 500,
              }}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
