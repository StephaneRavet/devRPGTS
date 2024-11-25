import { DatabaseConnection } from '@/DatabaseConnection';
import { QuestEntity } from '@/domains/quest/Quest.entity';
import { Quest, QUEST_SPAWN_RATES, QuestRarity } from '@shared/Quest.interface';
import { readFileSync } from 'fs';
import path from 'path';
import { Database } from 'sqlite';

export class QuestRepository {
  private static instance: QuestRepository;
  private db!: Database;
  private defaultQuests: Quest[];

  private constructor() {
    this.defaultQuests = JSON.parse(
      readFileSync(path.join(__dirname, '../../data/quests.json'), 'utf8')
    );
  }

  static async getInstance(): Promise<QuestRepository> {
    if (!QuestRepository.instance) {
      QuestRepository.instance = new QuestRepository();
      QuestRepository.instance.db = await DatabaseConnection.getInstance();
    }
    return QuestRepository.instance;
  }

  async findAll(): Promise<QuestEntity[]> {
    const quests = await this.db.all('SELECT * FROM quests');
    return quests.map(QuestEntity.fromDatabase);
  }

  async findById(id: number): Promise<QuestEntity | null> {
    const quest = await this.db.get('SELECT * FROM quests WHERE id = ?', [id]);
    return quest ? QuestEntity.fromDatabase(quest) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.run('DELETE FROM quests WHERE id = ?', [id]);
    return !!result.changes;
  }

  async feedRandomQuest(): Promise<void> {
    // Tirage au sort basé sur les taux de rareté
    const random = Math.random();
    let selectedRarity: QuestRarity;

    if (random < QUEST_SPAWN_RATES.legendary) {
      selectedRarity = "legendary";
    } else if (random < QUEST_SPAWN_RATES.legendary + QUEST_SPAWN_RATES.epic) {
      selectedRarity = "epic";
    } else if (random < QUEST_SPAWN_RATES.legendary + QUEST_SPAWN_RATES.epic + QUEST_SPAWN_RATES.rare) {
      selectedRarity = "rare";
    } else {
      selectedRarity = "common";
    }

    // Filtrer les quêtes par rareté
    const questsOfRarity = this.defaultQuests.filter(quest => quest.rarity === selectedRarity);

    // Sélectionner une quête aléatoire parmi celles de la rareté choisie
    const randomQuest = questsOfRarity[Math.floor(Math.random() * questsOfRarity.length)];

    await this.db.run(`INSERT INTO quests (name, xp, rarity) VALUES (?, ?, ?)`, [
      randomQuest.name,
      randomQuest.xp,
      randomQuest.rarity
    ]);
  }
} 