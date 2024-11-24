import $ from 'jquery';
import { api } from './services/api';
import './style.css';
import { Quest, User } from './types';

function updateUserInfo(user: User) {
  $('#username').text(user.username);
  $('#level').text(user.level.toString());
  const xpProgress = (user.xp % 100) / 100 * 100;
  $('#xp-bar').css('width', `${xpProgress}%`);
}

function createQuestElement(quest: Quest) {
  const questDiv = $('<div>')
    .addClass('bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors')
    .html(`
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold">${quest.name}</h3>
          <p class="text-sm text-gray-400">XP: ${quest.xp}</p>
        </div>
        <button 
          class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          data-quest-id="${quest.id}"
        >
          Complete
        </button>
      </div>
    `);

  questDiv.find('button').on('click', async () => {
    try {
      const username = localStorage.getItem('username');
      if (!username) return;

      const updatedUser = await api.completeQuest(username, quest.id!);
      updateUserInfo(updatedUser);
      await initializeApp(); // Refresh quests
    } catch (error) {
      console.error('Failed to complete quest:', error);
    }
  });

  return questDiv;
}

function renderQuests(quests: Quest[]) {
  const questsList = $('#quests-list');
  questsList.empty();
  quests.forEach(quest => {
    questsList.append(createQuestElement(quest));
  });
}

async function initializeApp() {
  const username = localStorage.getItem('username') || prompt('Enter your username:');
  if (!username) return;

  localStorage.setItem('username', username);

  try {
    const user = await api.getUser(username);
    const quests = await api.getQuests();

    updateUserInfo(user);
    renderQuests(quests);
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
}

$(document).ready(() => {
  initializeApp();
});
