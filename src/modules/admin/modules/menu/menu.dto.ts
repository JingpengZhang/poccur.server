export interface CreateMenuDto {
  name: string;
  path: string;
  icon: string;
  parent: string;
  enable: boolean;
  visible: boolean;
}

export interface UpdateMenuDto extends CreateMenuDto {
  id: string;
}

export interface GetOneByIdDto {
  id: string;
}

export interface DeleteDto {
  ids: string[];
  all?: boolean;
}

export interface UpdateIndexesDto {
  indexes: Array<{
    id: string,
    index: number,
    parent: string | null
  }>;
}

