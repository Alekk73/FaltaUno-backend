import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TeamsModule } from './modules/teams/teams.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { MatchesModule } from './modules/matches/matches.module';
import { FieldsModule } from './modules/fields/fields.module';
import { SwaggerConfigModule } from './common/swagger/swagger.module';
import { SchedulesModule } from './modules/schedules/schedules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    TeamsModule,
    InvitationsModule,
    MatchesModule,
    FieldsModule,
    SwaggerConfigModule,
    SchedulesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
