/** 페이지네이션 '더 보기'는 전체 건수가 이 값 이상일 때만 노출 */
export const LIST_LOAD_MORE_MIN_TOTAL_COUNT = 4

export function shouldShowInfiniteListLoadMore(
  hasNextPage: boolean,
  totalCount: number
): boolean {
  return Boolean(hasNextPage && totalCount >= LIST_LOAD_MORE_MIN_TOTAL_COUNT)
}
