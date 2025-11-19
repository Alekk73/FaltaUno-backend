import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchEntity } from './entities/match.entity';
import { MatchTeamEntity } from './entities/match-team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchEntity, MatchTeamEntity])],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
