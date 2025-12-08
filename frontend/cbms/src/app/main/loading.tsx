/**
 * @파일명 : loading.tsx
 * @설명 : /main 라우트 로딩 페이지 (신규 테마 적용)
 * @작성일 : 2025.12.08
 */

import { Loading } from "@/components/common/themed";

export default function MainLoading() {
  return <Loading message="Loading..." fullScreen={false} />;
}
