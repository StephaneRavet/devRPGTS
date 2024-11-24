import { DatabaseConnection } from '@/DatabaseConnection';
import { QuestEntity } from '@/domains/quest/Quest.entity';
import { Quest } from '@/domains/quest/Quest.interface';
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
    const randomQuest = this.defaultQuests[
      Math.floor(Math.random() * this.defaultQuests.length)
    ];

    await this.db.run(`INSERT INTO quests (name, description, xp) VALUES (?, ?, ?)`, [
      randomQuest.name,
      randomQuest.description || '',
      randomQuest.xp,
    ]);
  }
} 