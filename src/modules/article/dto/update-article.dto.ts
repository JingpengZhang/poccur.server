import { CreateArticleDto } from './create-article.dto';
import { EntityIdDto } from '../../../common/dto/entity-id.dto';

export interface UpdateArticleDto
  extends Partial<CreateArticleDto>,
    EntityIdDto {}
