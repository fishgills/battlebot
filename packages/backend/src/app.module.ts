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
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'bot',
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
