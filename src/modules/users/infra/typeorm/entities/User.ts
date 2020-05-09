import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { hash } from 'bcryptjs';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  public password_hash: string;

  @Column({
    update: false,
    insert: false,
    select: false,
  })
  public password: string;

  @Column()
  public avatar: string;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword(): Promise<void> {
    if (this.password) {
      this.password_hash = await hash(this.password, 10);

      delete this.password;
    }
  }
}

export default User;
