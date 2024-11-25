import { Quest } from '@shared/Quest.interface';
import { User } from '@shared/User.interface';
import $ from 'jquery';
import { api } from './services/api';
import './style.css';

// Classe personnalisée pour les erreurs de l'application
class AppError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AppError';
  }
}

// Fonction pour afficher les notifications
function showNotification(message: string, type: 'success' | 'error' = 'success') {
  const toast = $('#notification-toast');
  toast
    .removeClass('hidden bg-green-600 bg-red-600')
    .addClass(type === 'success' ? 'bg-green-600' : 'bg-red-600')
    .text(message)
    .fadeIn();

  setTimeout(() => {
    toast.fadeOut(() => toast.addClass('hidden'));
  }, 3000);
}

async function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    showNotification(error.message, 'error');
  } else if (error instanceof Error) {
    showNotification('Une erreur inattendue est survenue', 'error');
  } else {
    showNotification('Une erreur inconnue est survenue', 'error');
  }
}

async function updateUserInfo(user: User) {
  try {
    $('#username').text(user.username);
    $('#level').text(user.level.toString());
    $('#xp').text(user.xp.toString());
  } catch (error) {
    throw new AppError('Erreur lors de la mise à jour des informations utilisateur');
  }
}

async function completeQuest(username: string, questId: number) {
  try {
    await api.completeQuest(username, questId);
    showNotification('Quête complétée avec succès !');
    await initializeApp();
  } catch (error) {
    await handleApiError(error);
  }
}

function createQuestElement(quest: Quest) {
  const rarityColors = {
    legendary: 'text-yellow-400',
    epic: 'text-purple-400',
    rare: 'text-blue-400',
    common: 'text-gray-400'
  };

  const questDiv = $('<div>')
    .addClass('bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors')
    .html(`
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-bold">${quest.name}</h3>
          <p class="text-sm ${rarityColors[quest.rarity]}">${quest.rarity}</p>
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
    const username = localStorage.getItem('username');
    if (!username) {
      showNotification('Veuillez d\'abord vous connecter', 'error');
      return;
    }

    await completeQuest(username, quest.id!);
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
  try {
    const username = localStorage.getItem('username');
    if (!username) {
      const newUsername = prompt('Entrez votre nom d\'utilisateur:');
      if (!newUsername) {
        throw new AppError('Un nom d\'utilisateur est requis');
      }
      localStorage.setItem('username', newUsername);
    }

    const [user, quests] = await Promise.all([
      api.getUser(username),
      api.getQuests()
    ]);

    await updateUserInfo(user);
    renderQuests(quests);
  } catch (error) {
    await handleApiError(error);
  }
}

$(() => {
  initializeApp();

  $('#username').on('input', function () {
    try {
      const username = $(this).val() as string;
      if (!username.trim()) {
        throw new AppError('Le nom d\'utilisateur ne peut pas être vide');
      }
      localStorage.setItem('username', username);
    } catch (error) {
      handleApiError(error);
    }
  });
});
