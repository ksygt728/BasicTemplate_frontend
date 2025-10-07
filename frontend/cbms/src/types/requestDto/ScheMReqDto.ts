/**
 * 스케줄 마스터 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ScheMReqDto {
  /** 스케줄아이디 */
  scheId: string;

  /** 스케줄명 */
  scheName: string;

  /** 설명 */
  description?: string;

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

  /** 사용여부 (Y,N) */
  useYn?: string;
}
