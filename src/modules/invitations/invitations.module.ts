import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationEntity } from './entities/invitation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvitationEntity])],
  controllers: [InvitationsController],
  providers: [InvitationsService],
})
export class InvitationsModule {}
