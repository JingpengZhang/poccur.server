type ResponseDataCode = 200 | 1000;

interface ResponseData {
  code: ResponseDataCode;
  message: string;
}

interface ResponseListData<T> {
  code: ResponseDataCode;
  message: string;
  data: T[];
}

interface ServiceResult<T> {
  result: boolean;
  data?: T | null;
  message: string;
}

interface GetListDto {
  skip: number;
  limit: number;
}

interface PageQuery {
  page?: number;
  pageCount?: number;
}


type ToAny<T> = {
  [Key in keyof T]: any
}