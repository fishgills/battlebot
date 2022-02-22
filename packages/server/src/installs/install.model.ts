import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { JSONScalar } from './json.scalar';

@Unique(['team_id'])
@ObjectType()
@Entity()
export class SlackInstallModel {
  @PrimaryGeneratedColumn()
  @Field()
  id: string;

  @Column()
  @Field()
  team_id: string;

  @Column({
    type: 'json',
    nullable: false,
  })
  @Field(() => JSONScalar)
  installObj: string;

  @Column({
    nullable: true,
  })
  @Field({
    nullable: true,
  })
  channelId: string;

  @Field({
    nullable: true,
  })
  @Column({
    nullable: true,
  })
  stripeId: string;
}
