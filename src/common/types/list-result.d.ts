export interface ListResult<T> {
  list: T[];
  currentPage: number;
  pageSize: number;
  total: number;
}
