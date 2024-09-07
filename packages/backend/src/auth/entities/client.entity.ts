import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  clientId: string;

  @Column()
  clientSecret: string;

  @Column()
  name: string;
}
