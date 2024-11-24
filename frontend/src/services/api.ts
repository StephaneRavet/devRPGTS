const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  async getQuests() {
    const response = await fetch(`${API_BASE_URL}/quests`);
    if (!response.ok) throw new Error('Failed to fetch quests');
    return response.json();
  },

  async getUser(username: string) {
    const response = await fetch(`${API_BASE_URL}/users/${username}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async completeQuest(username: string, questId: number) {
    const response = await fetch(`${API_BASE_URL}/users/${username}/quests/${questId}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to complete quest');
    return response.json();
  }
}; 