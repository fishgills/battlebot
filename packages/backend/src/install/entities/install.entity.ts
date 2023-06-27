import { Installation } from '@slack/oauth';
import { BaseEntity } from '../../base/entity';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class InstallEntity extends BaseEntity {
  @Column()
  team_id: string;

  @Column({
    type: 'simple-json',
    nullable: false,
  })
  installObj: Installation;

  @Column({
    nullable: true,
  })
  channelId: string;

  @Column({
    nullable: true,
  })
  stripeSubId?: string;

  @Column({
    nullable: true,
  })
  stripeCOSId?: string;

  @Column({
    nullable: true,
  })
  stripeCusId?: string;
}
