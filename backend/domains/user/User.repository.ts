import { DatabaseConnection } from '@/DatabaseConnection';
import { UserEntity } from '@/domains/user/User.entity';
import { Database } from 'sqlite';

export class UserRepository {
  private static instance: UserRepository;
  private db!: Database;

  private constructor() { }

  static async getInstance(): Promise<UserRepository> {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
      UserRepository.instance.db = await DatabaseConnection.getInstance();
    }
    return UserRepository.instance;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.db.get(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return user ? UserEntity.fromDatabase(user) : null;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const existingUser = await this.findByUsername(user.username);

    if (!existingUser) {
      await this.db.run(
        'INSERT INTO users (username, level, xp) VALUES (?, ?, ?)',
        [user.username, user.level, user.xp]
      );
    } else {
      await this.db.run(
        'UPDATE users SET level = ?, xp = ? WHERE username = ?',
        [user.level, user.xp, user.username]
      );
    }

    return user;
  }
} 