/**
 * 스케줄 마스터 정보 응답 데이터 전송 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ScheMResDto {
  /** 스케줄아이디 */
  scheId: string;

  /** 스케줄명 */
  scheName: string;

  /** 설명 */
  description: string;

  /** 스케줄러 그룹명 */
  scheGroup: string;

  /** 클래스명 */
  className: string;

  /** 메소드명 */
  methodName: string;

  /** 트리거명 */
  triggerName: string;

  /** CRON식 */
  cronExp: string;

  /** 마지막실행시간 (yyyy-MM-dd HH:mm:ss.SSS) */
  lastExecTime: string;

  /** 다음실행시간 (yyyy-MM-dd HH:mm:ss.SSS) */
  nextExecTime: string;

  /** 사용여부 (Y,N) */
  useYn: string;
}
