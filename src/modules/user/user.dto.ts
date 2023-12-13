export interface CreateUserDto {
  email: string;
  password: string;
  username?: string;
}

export interface FindOneUserByEmailDto {
  email: string;
}