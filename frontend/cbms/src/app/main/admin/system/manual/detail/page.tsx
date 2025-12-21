"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/common/themed/Card";
import { Button } from "@/components/common/themed/Button";
import { Input } from "@/components/common/themed/Input";
import { Select } from "@/components/common/themed/Select";
import { useBbsService } from "@/service/BbsService";
import { useAlert } from "@/contexts/AlertContext";
import { useCommonCode } from "@/hooks/common/useCommonCode";
import { useAppSelector } from "@/store/hooks";

/**
 * @파일명 : page.tsx
 * @설명 : 게시판 상세 페이지 - 게시글 내용 및 댓글 표시
 * @작성자 : 김승연
 * @작성일 : 2025.12.21
 * @변경이력 :
 *       2025.12.21 김승연 최초 생성
 */
export default function BbsDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bbsId = searchParams.get("bbsId");
  const mode = searchParams.get("mode"); // 신규 작성 모드

  const {
    // 상태
    loading,
    selectedBbsId,

    // 데이터
    selectedBbsData,
    bbsDetailData,
    commentListData,

    // 게시판 함수
    handleTableRowClick,
    handleInsertBbs,
    handleUpdateBbs,
    handleDeleteBbs,

    // 댓글 함수
    handleFetchComments,
    handleInsertComment,
    handleUpdateComment,
    handleDeleteComment,
  } = useBbsService();

  const { showAlert } = useAlert();
  const { getDtlCode, getSelectOptions } = useCommonCode();

  // Redux에서 현재 로그인한 사용자 정보 가져오기
  const { user } = useAppSelector((state) => state.auth);
  const currentUserId = user?.userId || "";

  // 게시판 데이터
  const [bbsFormData, setBbsFormData] = useState<Record<string, any>>({});
  const [isEditingBbs, setIsEditingBbs] = useState(false);
  const [isNewMode, setIsNewMode] = useState(false); // 신규 작성 모드
  const originalBbsData = useRef<Record<string, any>>({});

  // 댓글 데이터
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  const isFetched = useRef(false);

  // 공통코드 옵션
  const bbsTypeOptions = getSelectOptions("BBS_TYPE", "001");

  // 신규 작성 모드 초기화
  useEffect(() => {
    if (mode === "new") {
      setIsNewMode(true);
      setIsEditingBbs(true);
      setBbsFormData({
        // bbsId는 신규 등록 시 서버에서 생성되므로 제외
        bbsType: "",
        title: "",
        content: "",
        writorName: "",
        writeDate: "",
      });
      originalBbsData.current = {};
      isFetched.current = true; // 중복 호출 방지
    } else {
      // 신규 작성 모드가 아니면 초기화
      setIsNewMode(false);
      setIsEditingBbs(false);
    }
  }, [mode]);

  // bbsId 변경 시 isFetched 리셋
  useEffect(() => {
    if (mode !== "new") {
      isFetched.current = false;
    }
  }, [bbsId, mode]);

  // 초기 데이터 로드 (bbsId가 있을 때만)
  useEffect(() => {
    if (!bbsId || isFetched.current || mode === "new") return;
    isFetched.current = true;

    // 게시판 상세 조회
    handleTableRowClick({ bbsId } as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bbsId, mode]);

  // 게시판 상세 데이터 변경 시 폼 업데이트
  useEffect(() => {
    if (selectedBbsData && !isEditingBbs && !isNewMode) {
      setBbsFormData(bbsDetailData);
      originalBbsData.current = { ...bbsDetailData };
    }
  }, [selectedBbsData, bbsDetailData, isEditingBbs, isNewMode]);

  // bbsId와 mode가 모두 없으면 목록 페이지로 리다이렉트
  useEffect(() => {
    if (!bbsId && mode !== "new") {
      router.push("/main/admin/system/manual");
    }
  }, [bbsId, mode, router]);

  // 댓글 작성 가능 여부 확인 (일반 게시판 타입 003만 가능)
  const canComment = bbsFormData.bbsType === "003";

  // 게시글 수정/삭제 권한 확인 (작성자와 현재 사용자가 같을 때만)
  const canEditOrDelete = bbsFormData.writorId === currentUserId;

  // ============================================================================
  // 게시판 CRUD 핸들러
  // ============================================================================

  const handleBbsEdit = () => {
    setIsEditingBbs(true);
  };

  const handleBbsCancel = () => {
    if (isNewMode) {
      // 신규 작성 모드에서 취소하면 목록으로 이동
      router.push("/main/admin/system/manual");
    } else {
      // 수정 모드에서 취소하면 원본 데이터로 복원
      setBbsFormData(originalBbsData.current);
      setIsEditingBbs(false);
    }
  };

  const handleBbsSave = async () => {
    try {
      if (!bbsFormData.bbsType || !bbsFormData.title || !bbsFormData.content) {
        await showAlert({
          type: "warning",
          title: "입력 오류",
          message: "게시판 타입, 제목, 내용을 모두 입력해주세요.",
        });
        return;
      }

      let result;
      if (isNewMode) {
        // 신규 등록
        result = await handleInsertBbs(bbsFormData);
      } else {
        // 수정
        result = await handleUpdateBbs(bbsFormData);
      }

      if (result?.success) {
        await showAlert({
          type: "success",
          title: "저장 완료",
          message: isNewMode
            ? "게시글이 등록되었습니다."
            : "게시글이 수정되었습니다.",
        });

        // 신규 등록 및 수정 후 목록으로 이동
        router.push("/main/admin/system/manual");
      } else {
        await showAlert({
          type: "error",
          title: "저장 실패",
          message: result?.message || "게시글 수정에 실패했습니다.",
        });
      }
    } catch (error: any) {
      await showAlert({
        type: "error",
        title: "오류 발생",
        message: error?.message || "게시글 수정 중 오류가 발생했습니다.",
      });
    }
  };

  const handleBbsDelete = async () => {
    if (!bbsId) return;

    const confirmed = await showAlert({
      type: "warning",
      title: "삭제 확인",
      message: "정말로 이 게시글을 삭제하시겠습니까?",
      showCancel: true,
    });

    if (!confirmed) return;

    try {
      const result = await handleDeleteBbs(bbsId);

      if (result?.success) {
        await showAlert({
          type: "success",
          title: "삭제 완료",
          message: "게시글이 삭제되었습니다.",
        });
        router.push("/main/admin/system/manual");
      } else {
        await showAlert({
          type: "error",
          title: "삭제 실패",
          message: result?.message || "게시글 삭제에 실패했습니다.",
        });
      }
    } catch (error: any) {
      await showAlert({
        type: "error",
        title: "오류 발생",
        message: error?.message || "게시글 삭제 중 오류가 발생했습니다.",
      });
    }
  };

  // ============================================================================
  // 댓글 CRUD 핸들러
  // ============================================================================

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      await showAlert({
        type: "warning",
        title: "입력 오류",
        message: "댓글 내용을 입력해주세요.",
      });
      return;
    }

    if (!bbsId) return;

    try {
      const result = await handleInsertComment({
        bbsId,
        commentContent: newComment,
        writor: currentUserId,
      });

      if (result?.success) {
        setNewComment("");
        await showAlert({
          type: "success",
          title: "댓글 등록",
          message: "댓글이 등록되었습니다.",
        });
      } else {
        await showAlert({
          type: "error",
          title: "등록 실패",
          message: result?.message || "댓글 등록에 실패했습니다.",
        });
      }
    } catch (error: any) {
      await showAlert({
        type: "error",
        title: "오류 발생",
        message: error?.message || "댓글 등록 중 오류가 발생했습니다.",
      });
    }
  };

  const handleCommentEdit = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
  };

  const handleCommentEditCancel = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  const handleCommentEditSave = async (commentId: string) => {
    if (!editingCommentContent.trim()) {
      await showAlert({
        type: "warning",
        title: "입력 오류",
        message: "댓글 내용을 입력해주세요.",
      });
      return;
    }

    if (!bbsId) return;

    try {
      const result = await handleUpdateComment({
        commentId,
        bbsId,
        commentContent: editingCommentContent,
        writor: currentUserId,
      });

      if (result?.success) {
        setEditingCommentId(null);
        setEditingCommentContent("");
        await showAlert({
          type: "success",
          title: "수정 완료",
          message: "댓글이 수정되었습니다.",
        });
      } else {
        await showAlert({
          type: "error",
          title: "수정 실패",
          message: result?.message || "댓글 수정에 실패했습니다.",
        });
      }
    } catch (error: any) {
      await showAlert({
        type: "error",
        title: "오류 발생",
        message: error?.message || "댓글 수정 중 오류가 발생했습니다.",
      });
    }
  };

  const handleCommentDeleteClick = async (commentId: string) => {
    const confirmed = await showAlert({
      type: "warning",
      title: "삭제 확인",
      message: "정말로 이 댓글을 삭제하시겠습니까?",
      showCancel: true,
    });

    if (!confirmed) return;

    try {
      const result = await handleDeleteComment(commentId);

      if (result?.success) {
        await showAlert({
          type: "success",
          title: "삭제 완료",
          message: "댓글이 삭제되었습니다.",
        });
      } else {
        await showAlert({
          type: "error",
          title: "삭제 실패",
          message: result?.message || "댓글 삭제에 실패했습니다.",
        });
      }
    } catch (error: any) {
      await showAlert({
        type: "error",
        title: "오류 발생",
        message: error?.message || "댓글 삭제 중 오류가 발생했습니다.",
      });
    }
  };

  // ============================================================================
  // 렌더링
  // ============================================================================

  // bbsId와 mode 둘 다 없으면 렌더링하지 않음
  if (!bbsId && mode !== "new") {
    return null;
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* 뒤로가기 버튼 */}
      <div style={{ marginBottom: "24px" }}>
        <Button
          variant="secondary"
          onClick={() => router.push("/main/admin/system/manual")}
        >
          ← 목록으로
        </Button>
      </div>

      {/* 게시글 상세 카드 */}
      <div style={{ marginBottom: "24px" }}>
        <Card>
          {/* 버튼 영역 */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {!isEditingBbs && !isNewMode ? (
              <>
                {canEditOrDelete && (
                  <>
                    <Button variant="secondary" onClick={handleBbsEdit}>
                      수정
                    </Button>
                    <Button variant="error" onClick={handleBbsDelete}>
                      삭제
                    </Button>
                  </>
                )}
                <Button
                  variant="secondary"
                  onClick={() => router.push("/main/admin/system/manual")}
                >
                  목록
                </Button>
              </>
            ) : (
              <>
                <Button variant="primary" onClick={handleBbsSave}>
                  저장
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => router.push("/main/admin/system/manual")}
                >
                  목록
                </Button>
              </>
            )}
          </div>

          {/* 헤더 */}
          <div
            style={{
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: "2px solid #e5e7eb",
            }}
          >
            {isNewMode ? (
              // 신규 작성 모드 - 제목 입력
              <div>
                <h2
                  style={{
                    margin: 0,
                    marginBottom: "12px",
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                >
                  신규 게시글 작성
                </h2>
                <Input
                  value={bbsFormData.title || ""}
                  onChange={(e) =>
                    setBbsFormData({ ...bbsFormData, title: e.target.value })
                  }
                  placeholder="제목을 입력하세요"
                  fullWidth
                />
              </div>
            ) : isEditingBbs ? (
              // 수정 모드 - 제목은 수정 불가
              <div>
                <Input
                  value={bbsFormData.title || ""}
                  onChange={(e) =>
                    setBbsFormData({ ...bbsFormData, title: e.target.value })
                  }
                  placeholder="제목을 입력하세요"
                  fullWidth
                  disabled
                />
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginTop: "12px",
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  <span>작성자: {bbsFormData.writorName}</span>
                  <span>작성일: {bbsFormData.writeDate}</span>
                </div>
              </div>
            ) : (
              // 읽기 모드
              <div>
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>
                  {bbsFormData.title}
                </h1>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginTop: "12px",
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  <span>작성자: {bbsFormData.writorName}</span>
                  <span>작성일: {bbsFormData.writeDate}</span>
                  <span>
                    타입:{" "}
                    {(() => {
                      const typeName = getDtlCode(
                        "BBS_TYPE",
                        "001",
                        bbsFormData.bbsType
                      );
                      return typeof typeName === "string"
                        ? typeName
                        : bbsFormData.bbsType;
                    })()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 게시판 타입 선택 (신규 작성/수정 모드에서만) */}
          {(isNewMode || isEditingBbs) && (
            <div style={{ marginBottom: "16px" }}>
              <Select
                label="게시판 타입"
                value={bbsFormData.bbsType || ""}
                onChange={(value) =>
                  setBbsFormData({ ...bbsFormData, bbsType: value })
                }
                options={bbsTypeOptions}
                placeholder="선택하세요"
                fullWidth
                disabled={!isNewMode}
              />
            </div>
          )}

          {/* 본문 */}
          <div style={{ minHeight: "300px", lineHeight: "1.8" }}>
            {isEditingBbs ? (
              <textarea
                value={bbsFormData.content || ""}
                onChange={(e) =>
                  setBbsFormData({ ...bbsFormData, content: e.target.value })
                }
                placeholder="내용을 입력하세요"
                style={{
                  width: "100%",
                  minHeight: "300px",
                  padding: "16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            ) : (
              <div style={{ whiteSpace: "pre-wrap" }}>
                {bbsFormData.content}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 댓글 섹션 - 일반 게시판(003)만 표시, 신규 작성 모드에서는 숨김 */}
      {canComment && !isNewMode && (
        <Card>
          <h2
            style={{
              margin: "0 0 24px 0",
              fontSize: "20px",
              fontWeight: 600,
              paddingBottom: "16px",
              borderBottom: "2px solid rgba(255, 255, 255, 0.08)",
              color: "#F7F8F8",
            }}
          >
            댓글 ({commentListData.length})
          </h2>

          {/* 댓글 목록 */}
          <div style={{ marginBottom: "32px" }}>
            {commentListData.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#8A8F98",
                }}
              >
                아직 댓글이 없습니다.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {commentListData.map((comment) => (
                  <div
                    key={comment.commentId}
                    style={{
                      padding: "16px",
                      backgroundColor: "#1C1D1F",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontWeight: 600,
                            marginRight: "8px",
                            color: "#F7F8F8",
                          }}
                        >
                          {comment.writorName}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#8A8F98",
                            marginRight: "12px",
                          }}
                        >
                          ({comment.writorId})
                        </span>
                        <span style={{ fontSize: "13px", color: "#8A8F98" }}>
                          {comment.writeDate}
                        </span>
                      </div>
                      {editingCommentId !== comment.commentId &&
                        comment.writorId === currentUserId && (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                handleCommentEdit(
                                  comment.commentId,
                                  comment.content
                                )
                              }
                            >
                              수정
                            </Button>
                            <Button
                              variant="error"
                              size="sm"
                              onClick={() =>
                                handleCommentDeleteClick(comment.commentId)
                              }
                            >
                              삭제
                            </Button>
                          </div>
                        )}
                    </div>
                    {editingCommentId === comment.commentId ? (
                      <div>
                        <textarea
                          value={editingCommentContent || ""}
                          onChange={(e) =>
                            setEditingCommentContent(e.target.value)
                          }
                          style={{
                            width: "100%",
                            minHeight: "80px",
                            padding: "12px",
                            backgroundColor: "#141516",
                            color: "#F7F8F8",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            marginBottom: "8px",
                          }}
                        />
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              handleCommentEditSave(comment.commentId)
                            }
                          >
                            저장
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleCommentEditCancel}
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          whiteSpace: "pre-wrap",
                          lineHeight: "1.6",
                          color: "#B4B5B8",
                        }}
                      >
                        {comment.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 댓글 작성 */}
          <div
            style={{
              paddingTop: "24px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <h3
              style={{
                margin: "0 0 16px 0",
                fontSize: "16px",
                fontWeight: 600,
                color: "#F7F8F8",
              }}
            >
              댓글 작성
            </h3>
            <textarea
              value={newComment || ""}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "12px",
                backgroundColor: "#141516",
                color: "#F7F8F8",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "6px",
                fontSize: "14px",
                fontFamily: "inherit",
                marginBottom: "12px",
                resize: "vertical",
              }}
            />
            <div style={{ textAlign: "right" }}>
              <Button
                variant="primary"
                onClick={handleCommentSubmit}
                disabled={loading}
              >
                댓글 등록
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* 댓글 불가능한 게시판 타입일 경우 안내 메시지 */}
      {!isNewMode && !canComment && bbsId && (
        <div style={{ padding: "32px", textAlign: "center" }}>
          <Card>
            <div style={{ color: "#6b7280" }}>
              이 게시판 타입에서는 댑글을 작성할 수 없습니다.
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
