import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CharactersModule } from './characters/characters.module';
import { CombatModule } from './combat/combat.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      logging: true,
      type: 'mysql',
      host: process.env.DB_INSTANCE,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'botdb',
      synchronize: true,
      autoLoadEntities: true,
      dropSchema: true,
    }),
    CharactersModule,
    CombatModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
