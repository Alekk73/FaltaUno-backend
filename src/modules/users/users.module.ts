import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { TeamsModule } from '../teams/teams.module';
import { TokenEntity } from './entity/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, TokenEntity]),
    forwardRef(() => TeamsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
