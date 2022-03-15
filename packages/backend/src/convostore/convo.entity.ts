import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ConvoEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    unique: true,
  })
  convoId: string;

  @Column()
  value: string;

  @Column()
  expiresAt: number;
}
