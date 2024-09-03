import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './character.entity';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Character]), UserModule],
  providers: [CharacterService],
  controllers: [CharacterController],
  exports: [CharacterService],
})
export class CharacterModule {}
