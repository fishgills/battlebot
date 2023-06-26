import { BaseEntity } from 'src/base/entity';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class InstallEntity extends BaseEntity {
  @Column()
  team_id: string;

  @Column({
    type: 'simple-json',
    nullable: false,
  })
  installObj: {
    bot: {
      token: string;
    };
  };

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
