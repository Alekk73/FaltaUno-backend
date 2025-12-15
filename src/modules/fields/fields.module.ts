import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldEntity } from './entity/field.entity';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { EstablishmentsModule } from '../establishments/establishments.module';

@Module({
  imports: [TypeOrmModule.forFeature([FieldEntity]), EstablishmentsModule],
  controllers: [FieldsController],
  providers: [FieldsService],
  exports: [FieldsService],
})
export class FieldsModule {}
