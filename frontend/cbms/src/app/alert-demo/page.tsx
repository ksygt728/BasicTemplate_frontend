/**
 * @파일명 : AlertDemo.tsx
 * @설명 : Alert 컴포넌트 사용 예시를 보여주는 데모 컴포넌트
 * @작성자 : 김승연
 * @작성일 : 2025.01.24
 */

"use client";

import { useAlert } from "@/contexts/AlertContext";

export default function AlertDemo() {
  const { showAlert } = useAlert();

  // Info 알림 예시
  const showInfoAlert = async () => {
    const result = await showAlert({
      type: "info",
      title: "정보 알림",
      message: "이것은 정보성 알림입니다.",
      okText: "확인",
    });
  };

  // Success 알림 예시
  const showSuccessAlert = async () => {
    const result = await showAlert({
      type: "success",
      title: "성공",
      message: "작업이 성공적으로 완료되었습니다.",
      okText: "좋아요!",
    });
  };

  // Warning 알림 (확인/취소 버튼) 예시
  const showWarningAlert = async () => {
    const result = await showAlert({
      type: "warning",
      title: "경고",
      message: "이 작업을 계속 진행하시겠습니까?",
      showCancel: true,
      okText: "계속",
      cancelText: "취소",
    });

    if (result) {
      await showAlert({
        type: "info",
        title: "확인됨",
        message: "작업을 계속 진행합니다.",
      });
    }
  };

  // Error 알림 예시
  const showErrorAlert = async () => {
    const result = await showAlert({
      type: "error",
      title: "오류 발생",
      message: "작업을 처리하는 중 오류가 발생했습니다.",
      okText: "다시 시도",
    });
  };

  // 데이터 포함 알림 예시
  const showDataAlert = async () => {
    const sampleData = {
      userId: 1001,
      userName: "김승연",
      email: "user@example.com",
      roles: ["USER", "ADMIN"],
      lastLoginAt: "2025-01-24T10:30:00Z",
    };

    const result = await showAlert({
      type: "info",
      title: "사용자 정보",
      message: "다음은 현재 사용자의 상세 정보입니다:",
      data: sampleData,
      okText: "확인",
    });
  };

  // 콜백 함수 포함 알림 예시
  const showCallbackAlert = async () => {
    const result = await showAlert({
      type: "warning",
      title: "데이터 삭제",
      message:
        "선택된 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      showCancel: true,
      okText: "삭제",
      cancelText: "취소",
      onOk: async () => {
        // 실제 삭제 로직을 여기에 구현
        console.log("데이터 삭제 중...");
        // 서버 API 호출 등
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 가짜 지연
        console.log("데이터 삭제 완료");
      },
      onCancel: () => {
        console.log("삭제 취소됨");
      },
    });

    if (result) {
      await showAlert({
        type: "success",
        title: "삭제 완료",
        message: "데이터가 성공적으로 삭제되었습니다.",
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Alert 컴포넌트 사용 예시
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={showInfoAlert}
          className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Info Alert
        </button>

        <button
          onClick={showSuccessAlert}
          className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Success Alert
        </button>

        <button
          onClick={showWarningAlert}
          className="p-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Warning Alert (확인/취소)
        </button>

        <button
          onClick={showErrorAlert}
          className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Error Alert
        </button>

        <button
          onClick={showDataAlert}
          className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Data Alert
        </button>

        <button
          onClick={showCallbackAlert}
          className="p-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Callback Alert
        </button>

        <button
          onClick={() =>
            showAlert({
              type: "success",
              title: "자동 닫힘 테스트",
              message: "이 알림은 3초 후 자동으로 사라집니다.",
              autoClose: 3000,
            })
          }
          className="p-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          자동 닫힘 Alert (3초)
        </button>

        <button
          onClick={() =>
            showAlert({
              type: "info",
              title: "빠른 알림",
              message: "1초 후 자동으로 사라집니다.",
              autoClose: 1000,
            })
          }
          className="p-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          빠른 닫힘 Alert (1초)
        </button>

        <button
          onClick={() =>
            showAlert({
              type: "warning",
              title: "줄바꿈 테스트",
              message:
                "첫 번째 줄입니다.\n두 번째 줄입니다.\n세 번째 줄입니다.\n\n줄바꿈이 잘 작동하는지 확인해보세요!",
              showCancel: true,
              okText: "확인",
              cancelText: "취소",
            })
          }
          className="p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          줄바꿈 테스트 Alert
        </button>

        <button
          onClick={() =>
            showAlert({
              type: "error",
              title: "API 에러 예시",
              message:
                "HTTP STATUS CODE: 400\nError Code: VALIDATION_ERROR\nMessage: 필수 필드가 누락되었습니다.",
            })
          }
          className="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          API 에러 형태 Alert
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          사용법:
        </h2>
        <pre className="text-sm text-gray-600 dark:text-gray-300 overflow-x-auto">
          {`import { useAlert } from "@/contexts/AlertContext";

const { showAlert } = useAlert();

// 기본 사용
await showAlert({
  type: 'info',
  title: '제목',
  message: '메시지 내용'
});

// 고급 사용
const result = await showAlert({
  type: 'warning',
  title: '확인 필요',
  message: '정말 삭제하시겠습니까?',
  showCancel: true,
  data: { id: 123, name: '테스트' },
  onOk: async () => { /* 삭제 로직 */ },
  onCancel: () => { /* 취소 로직 */ }
});

if (result) {
  console.log('사용자가 확인을 눌렀습니다');
}`}
        </pre>
      </div>
    </div>
  );
}
