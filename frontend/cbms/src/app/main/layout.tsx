import type { Metadata } from "next";
import "../globals.css";
import ThemedNavBar from "@/components/layout/navBar/ThemedNavBar";
import { Footer } from "@/components/common/themed/Footer";
import type { FooterSection } from "@/components/common/themed/Footer";

const footerSections: FooterSection[] = [
  {
    title: "제품",
    links: [
      { label: "기능", url: "/features" },
      { label: "가격", url: "/pricing" },
      { label: "고객사례", url: "/cases" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "회사소개", url: "/about" },
      { label: "채용", url: "/careers" },
      { label: "문의하기", url: "/contact" },
    ],
  },
  {
    title: "지원",
    links: [
      { label: "문서", url: "/docs" },
      { label: "API", url: "/api" },
      { label: "FAQ", url: "/faq" },
    ],
  },
  {
    title: "법적고지",
    links: [
      { label: "이용약관", url: "/terms" },
      { label: "개인정보처리방침", url: "/privacy" },
    ],
  },
];

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <ThemedNavBar />
      <main className="flex-1">{children}</main>
      <Footer
        companyName="CBMS Inc."
        sections={footerSections}
        socialLinks={[
          {
            icon: <span>📘</span>,
            url: "https://github.com",
            label: "GitHub",
          },
          {
            icon: <span>🐦</span>,
            url: "https://twitter.com",
            label: "Twitter",
          },
          {
            icon: <span>💼</span>,
            url: "https://linkedin.com",
            label: "LinkedIn",
          },
        ]}
      />
    </div>
  );
}
