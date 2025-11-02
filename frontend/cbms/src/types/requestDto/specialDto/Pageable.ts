/**
 * Pageable 객체
 * @작성자 김승연
 * @작성일 2025.10.07
 */
export interface Pageable {
  page: number;
  size: number;
  sort?: string;
  direction?: "ASC" | "DESC";
}
