export type ToAny<T> = {
  [Key in keyof T]: any;
};
