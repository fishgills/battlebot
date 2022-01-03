import { Field, InputType, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

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
  @Field(() => GraphQLJSON)
  installObj: any;

  @Column({
    nullable: true,
  })
  @Field({
    nullable: true,
  })
  channelId: string;
}
