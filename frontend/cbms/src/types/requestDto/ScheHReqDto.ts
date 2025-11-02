/**
 * 스케줄 이력 요청 DTO
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface ScheHReqDto {
  /** 로그아이디 */
  logId: string;

  /** 스케줄아이디 */
  scheId?: string;

  /** 스케줄러 그룹명 */
  scheGroup?: string;

  /** 시작시간 */
  startTime?: string;

  /** 종료시간 */
  endTime?: string;

  /** 성공여부 (Y,N) */
  success?: string;
}
