/**
 * 스케줄 이력 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ScheHResDto {
  /** 사용자이력ID */
  logId: string;

  /** 스케줄아이디 */
  scheId: string;

  /** 스케줄러 그룹명 */
  scheGroup: string;

  /** 시작시간 (yyyy-MM-dd HH:mm:ss.SSS) */
  startTime: string;

  /** 종료시간 (yyyy-MM-dd HH:mm:ss.SSS) */
  endTime: string;

  /** 실행시간 */
  execTime: number;

  /** 성공여부 */
  success: string;

  /** 실패사유 */
  errorMsg: string;
}
