import { User } from '@/domains/user/User.interface';

export class UserEntity implements User {
  constructor(
    public username: string,
    public level: number = 1,
    public xp: number = 0
  ) { }

  static fromDatabase(data: any): UserEntity {
    return new UserEntity(
      data.username,
      data.level,
      data.xp
    );
  }

  calculateNewLevel(additionalXp: number): number {
    const totalXp = this.xp + additionalXp;
    return Math.floor(Math.pow(totalXp, 0.4) / 2) + 1;
  }
} 