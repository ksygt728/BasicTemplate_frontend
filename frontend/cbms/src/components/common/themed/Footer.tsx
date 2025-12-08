/**
 * @파일명 : Footer.tsx
 * @설명 : 테마 적용된 푸터 컴포넌트
 * @작성일 : 2025.12.07
 */

"use client";

import React from "react";
import Link from "next/link";
import { theme } from "@/styles/theme";

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  logo?: React.ReactNode;
  companyName?: string;
  description?: string;
  sections?: FooterSection[];
  socialLinks?: {
    icon: React.ReactNode;
    url: string;
    label: string;
  }[];
  copyright?: string;
  bottomLinks?: FooterLink[];
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  logo,
  companyName,
  description,
  sections = [],
  socialLinks = [],
  copyright,
  bottomLinks = [],
  className = "",
}) => {
  const footerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background.surface,
    borderTop: `1px solid ${theme.colors.border.default}`,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily,
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: `${theme.spacing.xxl} ${theme.spacing.lg}`,
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  };

  const linkStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    color: theme.colors.text.secondary,
    textDecoration: "none",
    marginBottom: theme.spacing.sm,
    transition: "color 0.2s",
  };

  const bottomBarStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.border.default}`,
    gap: theme.spacing.md,
  };

  const socialLinksStyle: React.CSSProperties = {
    display: "flex",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  };

  const socialIconStyle: React.CSSProperties = {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: theme.colors.background.overlay,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.colors.text.secondary,
    transition: "all 0.3s",
    cursor: "pointer",
  };

  return (
    <footer style={footerStyle} className={className}>
      <div style={containerStyle}>
        <div style={gridStyle}>
          {/* Company Info Section */}
          <div>
            {logo && (
              <div style={{ marginBottom: theme.spacing.md }}>{logo}</div>
            )}
            {companyName && <h3 style={sectionTitleStyle}>{companyName}</h3>}
            {description && (
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: theme.typography.lineHeight.relaxed,
                  marginBottom: theme.spacing.md,
                }}
              >
                {description}
              </p>
            )}
            {socialLinks.length > 0 && (
              <div style={socialLinksStyle}>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    style={socialIconStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        theme.colors.primary.default;
                      e.currentTarget.style.color = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        theme.colors.background.overlay;
                      e.currentTarget.style.color = theme.colors.text.secondary;
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h4 style={sectionTitleStyle}>{section.title}</h4>
              <nav>
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.url}
                    style={linkStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color =
                        theme.colors.primary.default;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = theme.colors.text.secondary;
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={bottomBarStyle}>
          <div style={{ fontSize: "14px", color: theme.colors.text.tertiary }}>
            {copyright || `© ${new Date().getFullYear()} All rights reserved.`}
          </div>

          {bottomLinks.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: theme.spacing.lg,
                flexWrap: "wrap",
              }}
            >
              {bottomLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  style={{
                    fontSize: "14px",
                    color: theme.colors.text.tertiary,
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.colors.primary.default;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.text.tertiary;
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
