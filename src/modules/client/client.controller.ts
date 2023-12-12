import { Controller } from '@nestjs/common';
import { ClientService } from './client.service';

@Controller('/blog')
export class ClientController {
  constructor(private readonly blogService: ClientService) {}
}
