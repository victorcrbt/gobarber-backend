import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public provider: string;

  @Column('timestamp with time zone')
  public date: Date;
}

export default Appointment;
