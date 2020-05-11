import { uuid } from 'uuidv4';
import bcrypt from 'bcryptjs';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private usersRepository: User[] = [];

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), name, email, password });

    this.usersRepository.push(user);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.usersRepository.find(user => user.email === email);

    return findUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.usersRepository.find(user => user.id === id);

    return findUser;
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.usersRepository.findIndex(
      findUser => findUser.id === user.id
    );

    this.usersRepository[userIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
