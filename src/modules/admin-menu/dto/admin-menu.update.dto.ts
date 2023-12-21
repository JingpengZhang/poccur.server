import { AdminMenuCreateDto } from './admin-menu.create.dto';

export interface AdminMenuUpdateDto extends Partial<AdminMenuCreateDto> {
  id: string;
}
