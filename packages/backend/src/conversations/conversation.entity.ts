import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType({
  description: 'A conversation between two users',
})
@Entity()
export class Conversation {
  @Field()
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  body: string;

  @Field()
  @Column({
    type: 'bigint',
    nullable: true,
  })
  expiresAt: number;
}

@InputType()
export class ConversationInput {
  @Field()
  id: string;

  @Field()
  body: string;

  @Field({
    nullable: true,
  })
  expiresAt: number;
}
