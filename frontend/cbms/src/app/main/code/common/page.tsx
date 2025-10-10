import BasicTableView from "@/components/common/table/BasicTableView";
import BasicFrame from "@/components/layout/frame/BasicFrame";
import TripleSplitFrame from "@/components/layout/frame/TripleSplitFrame";
import Image from "next/image";

export default function Home() {
  // 좌측 테이블 - 사용자 목록
  const leftTableColumns = [
    { key: "id", label: "ID", sortable: true, width: 80 },
    { key: "name", label: "이름", sortable: true, width: 120 },
    { key: "email", label: "이메일", sortable: true, width: 180 },
    { key: "role", label: "역할", sortable: false, width: 100 },
    { key: "status", label: "상태", sortable: true, width: 100 },
  ];

  const leftTableData = [
    {
      id: 1,
      name: "김철수",
      email: "kim@example.com",
      role: "관리자",
      status: "활성",
    },
    {
      id: 2,
      name: "이영희",
      email: "lee@example.com",
      role: "사용자",
      status: "활성",
    },
    {
      id: 3,
      name: "박민수",
      email: "park@example.com",
      role: "사용자",
      status: "비활성",
    },
    {
      id: 4,
      name: "최유진",
      email: "choi@example.com",
      role: "매니저",
      status: "활성",
    },
    {
      id: 5,
      name: "정호영",
      email: "jung@example.com",
      role: "사용자",
      status: "활성",
    },
  ];

  // 우측 상단 테이블 - 프로젝트 목록
  const rightTopTableColumns = [
    { key: "projectId", label: "프로젝트 ID", sortable: true, width: 120 },
    { key: "projectName", label: "프로젝트명", sortable: true, width: 200 },
    { key: "manager", label: "담당자", sortable: true, width: 120 },
    { key: "progress", label: "진행률", sortable: true, width: 100 },
    { key: "deadline", label: "마감일", sortable: true, width: 140 },
  ];

  const rightTopTableData = [
    {
      id: 1, // 고유한 ID로 변경
      projectId: "P001",
      projectName: "웹사이트 리뉴얼",
      manager: "김철수",
      progress: "75%",
      deadline: "2024-12-31",
    },
    {
      id: 2, // 고유한 ID로 변경
      projectId: "P002",
      projectName: "모바일 앱 개발",
      manager: "이영희",
      progress: "45%",
      deadline: "2024-11-15",
    },
    {
      id: 3, // 고유한 ID로 변경
      projectId: "P003",
      projectName: "API 개선",
      manager: "박민수",
      progress: "90%",
      deadline: "2024-10-20",
    },
    {
      id: 4, // 고유한 ID로 변경
      projectId: "P004",
      projectName: "데이터베이스 최적화",
      manager: "최유진",
      progress: "60%",
      deadline: "2024-12-01",
    },
  ];

  // 우측 하단 테이블 - 작업 로그
  const rightBottomTableColumns = [
    { key: "logId", label: "로그 ID", sortable: true, width: 100 },
    { key: "action", label: "작업", sortable: false, width: 120 },
    { key: "user", label: "사용자", sortable: true, width: 120 },
    { key: "timestamp", label: "시간", sortable: true, width: 160 },
    { key: "result", label: "결과", sortable: true, width: 80 },
  ];

  const rightBottomTableData = [
    {
      id: 1, // 고유한 ID 추가
      logId: "L001",
      action: "로그인",
      user: "김철수",
      timestamp: "2024-10-09 09:30",
      result: "성공",
    },
    {
      id: 2, // 고유한 ID 추가
      logId: "L002",
      action: "파일 업로드",
      user: "이영희",
      timestamp: "2024-10-09 10:15",
      result: "성공",
    },
    {
      id: 3, // 고유한 ID 추가
      logId: "L003",
      action: "데이터 수정",
      user: "박민수",
      timestamp: "2024-10-09 11:20",
      result: "실패",
    },
    {
      id: 4, // 고유한 ID 추가
      logId: "L004",
      action: "보고서 생성",
      user: "최유진",
      timestamp: "2024-10-09 14:45",
      result: "성공",
    },
    {
      id: 5, // 고유한 ID 추가
      logId: "L005",
      action: "로그아웃",
      user: "정호영",
      timestamp: "2024-10-09 17:30",
      result: "성공",
    },
  ];

  return (
    <TripleSplitFrame
      leftContent={
        <BasicTableView
          columns={leftTableColumns}
          data={leftTableData}
          title="사용자 관리"
        />
      }
      rightTopContent={
        <BasicTableView
          columns={rightTopTableColumns}
          data={rightTopTableData}
          title="프로젝트 현황"
        />
      }
      rightBottomContent={
        <BasicTableView
          columns={rightBottomTableColumns}
          data={rightBottomTableData}
          title="작업 로그"
        />
      }
    />
  );
}
