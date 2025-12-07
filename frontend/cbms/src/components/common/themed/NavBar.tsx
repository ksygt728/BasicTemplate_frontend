/**
 * @파일명 : NavBar.tsx
 * @설명 : 테마 적용된 네비게이션 바 컴포넌트
 * @작성일 : 2025.12.07
 * @기능 : 다단계 드롭다운 메뉴, 모바일 반응형, 검색, 사용자 프로필, 브레드크럼
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { theme } from "@/styles/theme";

export interface NavMenuItem {
  id: string;
  label: string;
  url?: string;
  icon?: React.ReactNode;
  children?: NavMenuItem[];
}

export interface NavBarProps {
  logo?: React.ReactNode;
  menuItems?: NavMenuItem[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  user?: {
    name: string;
    avatar?: string;
  };
  onLogout?: () => void;
  breadcrumbs?: { label: string; url?: string }[];
  extraButtons?: React.ReactNode;
  className?: string;
}

export const NavBar: React.FC<NavBarProps> = ({
  logo,
  menuItems = [],
  searchPlaceholder = "Search...",
  onSearch,
  user,
  onLogout,
  breadcrumbs,
  extraButtons,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubMenus, setActiveSubMenus] = useState<{
    [key: string]: string;
  }>({});
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userDropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const renderMenuItem = (
    menu: NavMenuItem,
    level: number = 1
  ): React.ReactElement => {
    const hasChildren = menu.children && menu.children.length > 0;

    const level1Style: React.CSSProperties = {
      margin: `0 ${theme.spacing.md}`,
      fontSize: "14px",
      color: theme.colors.text.primary,
      transition: "color 0.3s",
      cursor: "pointer",
      padding: `${theme.spacing.sm} 0`,
    };

    const subMenuItemStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontSize: "14px",
      color: theme.colors.text.primary,
      transition: "all 0.2s",
      cursor: "pointer",
    };

    const dropdownStyle: React.CSSProperties = {
      position: "absolute",
      top: level === 1 ? "100%" : "0",
      left: level === 1 ? "0" : "100%",
      width: "192px",
      backgroundColor: theme.colors.background.surface,
      borderRadius: theme.borderRadius.md,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
      border: `1px solid ${theme.colors.border.default}`,
      zIndex: 9999 + level,
    };

    return (
      <div
        key={menu.id}
        style={{
          position: "relative",
          display: level === 1 ? "inline-block" : "block",
        }}
        onMouseEnter={() => {
          if (level === 1) {
            setActiveDropdown(menu.id);
          } else {
            setActiveSubMenus((prev) => ({
              ...prev,
              [`level${level}`]: menu.id,
            }));
          }
        }}
        onMouseLeave={() => {
          if (level === 1) {
            setActiveDropdown(null);
            setActiveSubMenus({});
          }
        }}
      >
        <Link
          href={menu.url || "#"}
          style={level === 1 ? level1Style : subMenuItemStyle}
          onMouseEnter={(e) => {
            if (level > 1) {
              e.currentTarget.style.backgroundColor =
                theme.colors.background.overlay;
            }
          }}
          onMouseLeave={(e) => {
            if (level > 1) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
          onClick={(e) => {
            if (!menu.url || menu.url === "#") {
              e.preventDefault();
            }
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.xs,
            }}
          >
            {menu.icon}
            {menu.label}
          </span>
          {hasChildren && level > 1 && (
            <svg
              style={{
                width: "16px",
                height: "16px",
                marginLeft: theme.spacing.xs,
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
        </Link>

        {hasChildren && (
          <>
            {level === 1 && activeDropdown === menu.id && (
              <div style={dropdownStyle}>
                <div style={{ padding: `${theme.spacing.xs} 0` }}>
                  {menu.children!.map((child) =>
                    renderMenuItem(child, level + 1)
                  )}
                </div>
              </div>
            )}
            {level > 1 && activeSubMenus[`level${level}`] === menu.id && (
              <div style={dropdownStyle}>
                <div style={{ padding: `${theme.spacing.xs} 0` }}>
                  {menu.children!.map((child) =>
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

  const navStyle: React.CSSProperties = {
    position: "relative",
    backgroundColor: theme.colors.background.surface,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    fontFamily: theme.typography.fontFamily,
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
  };

  const searchInputStyle: React.CSSProperties = {
    width: "100%",
    padding: `${theme.spacing.sm} ${theme.spacing.md} ${theme.spacing.sm} ${theme.spacing.xl}`,
    backgroundColor: theme.colors.background.default,
    color: theme.colors.text.primary,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.md,
    fontSize: "14px",
    outline: "none",
  };

  return (
    <nav style={navStyle} className={className}>
      <div style={containerStyle}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.xl,
              }}
            >
              {logo && <div>{logo}</div>}

              {/* Desktop Search */}
              <div
                style={{
                  display: "none",
                  position: "relative",
                  width: "300px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: theme.spacing.md,
                  }}
                >
                  <svg
                    style={{
                      width: "20px",
                      height: "20px",
                      color: theme.colors.text.tertiary,
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    style={searchInputStyle}
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Breadcrumbs */}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.xs,
                  }}
                >
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <span style={{ color: theme.colors.text.tertiary }}>
                          /
                        </span>
                      )}
                      {crumb.url ? (
                        <Link
                          href={crumb.url}
                          style={{
                            fontSize: "14px",
                            color: theme.colors.text.secondary,
                          }}
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span
                          style={{
                            fontSize: "14px",
                            color: theme.colors.text.primary,
                          }}
                        >
                          {crumb.label}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.md,
              }}
            >
              {extraButtons}

              {user ? (
                <div ref={userDropdownRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.spacing.sm,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: theme.colors.text.primary,
                      fontSize: "14px",
                      padding: theme.spacing.sm,
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background:
                          user.avatar ||
                          `linear-gradient(135deg, ${theme.colors.primary.default}, ${theme.colors.primary.hover})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        fontSize: "14px",
                        fontWeight: theme.typography.weights.semibold,
                      }}
                    >
                      {!user.avatar && user.name.charAt(0)}
                    </div>
                    <span>{user.name}</span>
                    <svg
                      style={{
                        width: "14px",
                        height: "14px",
                        transform: userDropdownOpen
                          ? "rotate(180deg)"
                          : "rotate(0)",
                        transition: "transform 0.2s",
                      }}
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
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        marginTop: theme.spacing.xs,
                        width: "192px",
                        backgroundColor: theme.colors.background.surface,
                        borderRadius: theme.borderRadius.md,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                        border: `1px solid ${theme.colors.border.default}`,
                        zIndex: 50,
                      }}
                    >
                      <div style={{ padding: `${theme.spacing.xs} 0` }}>
                        <Link
                          href="/mypage"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: theme.spacing.sm,
                            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                            fontSize: "14px",
                            color: theme.colors.text.primary,
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              theme.colors.background.overlay;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <svg
                            style={{ width: "20px", height: "20px" }}
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
                          My Page
                        </Link>
                        <button
                          onClick={() => {
                            if (onLogout) onLogout();
                            setUserDropdownOpen(false);
                          }}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: theme.spacing.sm,
                            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                            fontSize: "14px",
                            color: theme.colors.text.primary,
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              theme.colors.background.overlay;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <svg
                            style={{ width: "20px", height: "20px" }}
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
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/signIn"
                  style={{
                    fontSize: "14px",
                    color: theme.colors.primary.default,
                    textDecoration: "none",
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  }}
                >
                  Sign In
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  display: "none",
                  backgroundColor: "transparent",
                  border: "none",
                  color: theme.colors.text.primary,
                  cursor: "pointer",
                  padding: theme.spacing.sm,
                }}
                aria-label="Toggle menu"
              >
                {!isOpen ? (
                  <svg
                    style={{ width: "24px", height: "24px" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                ) : (
                  <svg
                    style={{ width: "24px", height: "24px" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Menu */}
          {menuItems.length > 0 && (
            <div style={{ paddingTop: theme.spacing.md, position: "relative" }}>
              {menuItems.map((menu) => renderMenuItem(menu))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
