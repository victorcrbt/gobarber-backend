import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public provider_id: string;

  @Column()
  public user_id: string;

  @Column('timestamp with time zone')
  public date: Date;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  public provider: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  public user: User;
}

export default Appointment;
