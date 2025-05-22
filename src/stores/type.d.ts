/**
 * App State
 */
export interface AppState {
  /**
   * status reset
   */
  reset?: boolean;
  /**
   * locale Selected
   */
  locale?: string | number;
  /** Thiết bị */
  device?: string | number;
  /** Trạng thái page */
  page_url?: string | number;
  /** sub */
  sub_page_url?: string | number;
}
