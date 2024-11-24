import { UserEntity } from '@/domains/user/User.entity';
import { UserRepository } from '@/domains/user/User.repository';

export class UserService {
  private static instance: UserService;
  private userRepository: UserRepository;

  private constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  static async getInstance(): Promise<UserService> {
    if (!UserService.instance) {
      const repository = await UserRepository.getInstance();
      UserService.instance = new UserService(repository);
    }
    return UserService.instance;
  }

  async getOrCreateUser(username: string): Promise<UserEntity> {
    const user = await this.userRepository.findByUsername(username);
    return user || new UserEntity(username);
  }

  async addExperience(username: string, xp: number): Promise<UserEntity> {
    const user = await this.getOrCreateUser(username);
    user.xp += xp;
    user.level = user.calculateNewLevel(xp);
    return this.userRepository.save(user);
  }
} 