import { Repository } from 'typeorm';
import { User } from './user.entity';

export class UserRepository extends Repository<User> {
  async findByUsername(username: string): Promise<User> {
    return this.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }
}
