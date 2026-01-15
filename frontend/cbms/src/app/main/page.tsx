"use client";

import { AnnouncementPopup } from "@/components/common/themed/AnnouncementPopup";

/**
 * @파일명 : page.tsx
 * @설명 : 메인 페이지 - 공지팝업 표시
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 */
export default function Home() {
  return (
    <div style={{ padding: "40px" }}>
      {/* 공지팝업 컴포넌트 */}
      {/* <AnnouncementPopup autoShow={true} /> */}

      {/* 메인 컨텐츠 */}
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "16px" }}>
          환영합니다
        </h1>
        <p style={{ fontSize: "16px", color: "#6b7280" }}>
          메인 페이지 컨텐츠를 여기에 추가하세요.
        </p>
      </div>
    </div>
  );
}
