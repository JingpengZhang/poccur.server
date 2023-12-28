export interface AdminMenuUpdateTreeDto {
  indexes: {
    id: number;
    index: number;
    parent: number;
  }[];
}
