"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/common/themed/Modal";
import { Button } from "@/components/common/themed/Button";
import { useBbsApi } from "@/hooks/admin/useBbsApi";
import { BbsResDto } from "@/types/responseDto/BbsResDto";

/**
 * @파일명 : AnnouncementPopup.tsx
 * @설명 : 공지팝업(BBS_TYPE 002) 자동 표시 컴포넌트
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
 */

const STORAGE_KEY = "closedAnnouncements";

/**
 * @interface AnnouncementPopupProps
 */
export interface AnnouncementPopupProps {
  /** 공지팝업 자동 표시 여부 */
  autoShow?: boolean;
}

/**
 * @component AnnouncementPopup
 * @description BBS_TYPE이 002(공지팝업)인 게시글을 자동으로 팝업으로 표시
 */
export const AnnouncementPopup: React.FC<AnnouncementPopupProps> = ({
  autoShow = true,
}) => {
  const { fetchBbsData, bbsData } = useBbsApi();
  const [announcements, setAnnouncements] = useState<BbsResDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 초기 로드: 공지팝업(002) 타입 게시글 조회
  useEffect(() => {
    if (!autoShow) return;

    const loadAnnouncements = async () => {
      await fetchBbsData({ bbsType: "002" } as any, {
        page: 0,
        size: 100,
        sort: "writeDate",
        direction: "DESC",
      });
    };

    loadAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoShow]);

  // 공지팝업 데이터 필터링 (로컬스토리지에서 닫은 항목 제외)
  useEffect(() => {
    if (!bbsData?.content) return;

    const closedIds = getClosedAnnouncementIds();
    const filteredAnnouncements = bbsData.content.filter(
      (bbs: BbsResDto) => !closedIds.includes(bbs.bbsId)
    );

    setAnnouncements(filteredAnnouncements);
    if (filteredAnnouncements.length > 0) {
      setIsOpen(true);
      setCurrentIndex(0);
    }
  }, [bbsData]);

  /**
   * @function getClosedAnnouncementIds
   * @description 로컬스토리지에서 닫은 공지팝업 ID 목록 조회
   */
  const getClosedAnnouncementIds = (): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  };

  /**
   * @function saveClosedAnnouncementId
   * @description 로컬스토리지에 닫은 공지팝업 ID 저장
   */
  const saveClosedAnnouncementId = (bbsId: string) => {
    try {
      const closedIds = getClosedAnnouncementIds();
      if (!closedIds.includes(bbsId)) {
        closedIds.push(bbsId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(closedIds));
      }
    } catch (error) {
      console.error("Failed to save closed announcement ID:", error);
    }
  };

  /**
   * @function handleClose
   * @description 현재 공지팝업 닫기
   */
  const handleClose = () => {
    if (announcements.length > 0) {
      const currentAnnouncement = announcements[currentIndex];
      saveClosedAnnouncementId(currentAnnouncement.bbsId);
    }

    // 다음 공지팝업이 있으면 표시, 없으면 모달 닫기
    if (currentIndex + 1 < announcements.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsOpen(false);
    }
  };

  /**
   * @function handleCloseAll
   * @description 모든 공지팝업 다시 보지 않기
   */
  const handleCloseAll = () => {
    announcements.forEach((announcement) => {
      saveClosedAnnouncementId(announcement.bbsId);
    });
    setIsOpen(false);
  };

  /**
   * @function handleNext
   * @description 다음 공지팝업으로 이동
   */
  const handleNext = () => {
    if (currentIndex + 1 < announcements.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  /**
   * @function handlePrev
   * @description 이전 공지팝업으로 이동
   */
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (announcements.length === 0) return null;

  const currentAnnouncement = announcements[currentIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={currentAnnouncement?.title || "공지사항"}
      size="lg"
      closeOnOverlayClick={false}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* 왼쪽: 페이지 네비게이션 */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {announcements.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  이전
                </Button>
                <span style={{ fontSize: "14px", color: "#6b7280" }}>
                  {currentIndex + 1} / {announcements.length}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentIndex === announcements.length - 1}
                >
                  다음
                </Button>
              </>
            )}
          </div>

          {/* 오른쪽: 닫기 버튼 */}
          <div style={{ display: "flex", gap: "8px" }}>
            <Button variant="secondary" onClick={handleCloseAll}>
              모두 닫기
            </Button>
            <Button variant="primary" onClick={handleClose}>
              {currentIndex + 1 < announcements.length
                ? "다음 공지 보기"
                : "닫기"}
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ padding: "20px" }}>
        {/* 작성자 및 작성일 */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "20px",
            fontSize: "14px",
            color: "#6b7280",
            paddingBottom: "12px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <span>작성자: {currentAnnouncement?.writor?.name || "관리자"}</span>
          <span>작성일: {currentAnnouncement?.writeDate}</span>
        </div>

        {/* 본문 */}
        <div
          style={{
            minHeight: "200px",
            maxHeight: "400px",
            overflowY: "auto",
            lineHeight: "1.8",
            fontSize: "15px",
            whiteSpace: "pre-wrap",
            color: "#374151",
          }}
        >
          {currentAnnouncement?.content}
        </div>
      </div>
    </Modal>
  );
};
