export interface IPaginatedArray<T> {
  array: Array<T>;
  pageSize: number;
  currentGroup: number;
  currentPage: number;
  size: number;
}
