import { Quest } from '@shared/Quest.interface';
import { User } from '@shared/User.interface';
import { Cache } from './Cache';

const API_BASE_URL = 'http://localhost:3000/api';

const questCache = new Cache<Quest[]>(1); // Cache de 1 minute pour les quêtes
const userCache = new Cache<User>(5);     // Cache de 30 secondes pour les utilisateurs

export const api = {
  async getQuests() {
    const cachedQuests = questCache.get('quests');
    if (cachedQuests) return cachedQuests;

    const response = await fetch(`${API_BASE_URL}/quests`);
    if (!response.ok) throw new Error('Failed to fetch quests');

    const quests = await response.json();
    questCache.set('quests', quests);
    return quests;
  },

  async getUser(username: string) {
    const cacheKey = `user:${username}`;
    const cachedUser = userCache.get(cacheKey);
    if (cachedUser) return cachedUser;

    const response = await fetch(`${API_BASE_URL}/users/${username}`);
    if (!response.ok) throw new Error('Failed to fetch user');

    const user = await response.json();
    userCache.set(cacheKey, user);
    return user;
  },

  async completeQuest(username: string, questId: number) {
    const response = await fetch(`${API_BASE_URL}/users/${username}/quests/${questId}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to complete quest');

    // Invalider les caches car les données ont changé
    // questCache.clear();
    // userCache.delete(`user:${username}`);

    return response.json();
  }
}; 