"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useNavBarMenu } from "@/hooks/common/menuHook";
import type { MenuResDto } from "@/types/responseDto/MenuResDto";

/**
 * @파일명 : Breadcrumb.tsx
 * @설명 : 현재 경로를 표시하는 breadcrumb 컴포넌트
 * @작성자 : 김승연
 * @작성일 : 2025.11.02
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  const { menuData } = useNavBarMenu();

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
    if (!menuData || menuData.length === 0) return [];

    const menuPath = findMenuPath(menuData, pathname);
    if (!menuPath) return [];

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

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400"
    >
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg
              className="w-4 h-4 text-gray-400"
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
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-gray-200 font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
