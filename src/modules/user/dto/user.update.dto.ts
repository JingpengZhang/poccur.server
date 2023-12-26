import { Role } from '../../../constants/role.enum';

export interface UserUpdateDto {
  id: number;
  username?: string;
  roles?: Role[];
  description?: string;
  career?: string;
  city?: string;
  company?: string;
  website?: string;
}
