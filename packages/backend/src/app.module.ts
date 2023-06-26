import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CharactersModule } from './characters/characters.module';
import { CombatModule } from './combat/combat.module';
import { HealthModule } from './health/health.module';
import { RewardModule } from './reward/reward.module';
import { InstallModule } from './install/install.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      logging: true,
      type: 'mysql',
      ...(process.env.INSTANCE_UNIX_SOCKET && {
        socketPath: process.env.INSTANCE_UNIX_SOCKET,
      }),
      ...(process.env.DB_HOST && { host: process.env.host }),
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'botdb',
      autoLoadEntities: true,
    }),
    CharactersModule,
    CombatModule,
    HealthModule,
    RewardModule,
    InstallModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
