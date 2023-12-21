import { Role } from '../../../constants/role.enum';

export interface AuthSignUpDto {
  email: string;
  password: string;
  username?: string;
  autoSignIn?: boolean;
  roles?: Role[];
}
