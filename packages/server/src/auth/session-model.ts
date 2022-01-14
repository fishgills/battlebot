import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class SessionModel extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  expiresAt: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  data: string;
}
