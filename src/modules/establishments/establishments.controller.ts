import { Controller } from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';

@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}
}
