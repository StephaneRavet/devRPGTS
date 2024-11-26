import { Quest } from '@shared/Quest.interface';
import { User } from '@shared/User.interface';
import { LogMethod } from '../decorators/LogMethod';
import { Cache } from './Cache';

const API_BASE_URL = 'http://localhost:3000/api';

export class Api {
  private questCache: Cache<Quest[]>;
  private userCache: Cache<User>;

  constructor() {
    this.questCache = new Cache<Quest[]>(1); // Cache de 1 minute pour les quêtes
    this.userCache = new Cache<User>(5);     // Cache de 30 secondes pour les utilisateurs
  }

  @LogMethod()
  async getQuests(): Promise<Quest[]> {
    const cachedQuests = this.questCache.get('quests');
    if (cachedQuests) return cachedQuests;

    const response = await fetch(`${API_BASE_URL}/quests`);
    if (!response.ok) throw new Error('Failed to fetch quests');

    const quests = await response.json();
    this.questCache.set('quests', quests);
    return quests;
  }

  @LogMethod()
  async getUser(username: string): Promise<User> {
    const cacheKey = `user:${username}`;
    const cachedUser = this.userCache.get(cacheKey);
    if (cachedUser) return cachedUser;

    const response = await fetch(`${API_BASE_URL}/users/${username}`);
    if (!response.ok) throw new Error('Failed to fetch user');

    const user = await response.json();
    this.userCache.set(cacheKey, user);
    return user;
  }

  @LogMethod()
  async completeQuest(username: string, questId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/${username}/quests/${questId}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to complete quest');

    // Invalider les caches car les données ont changé
    this.questCache.clear();
    this.userCache.delete(`user:${username}`);

    return response.json();
  }
}

export const api = new Api(); 