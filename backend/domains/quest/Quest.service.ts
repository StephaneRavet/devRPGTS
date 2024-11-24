import { QuestEntity } from '@/domains/quest/Quest.entity';
import { QuestRepository } from '@/domains/quest/Quest.repository';

export class QuestService {
  private static instance: QuestService;
  private questRepository: QuestRepository;

  private constructor(questRepository: QuestRepository) {
    this.questRepository = questRepository;
  }

  static async getInstance(): Promise<QuestService> {
    if (!QuestService.instance) {
      const repository = await QuestRepository.getInstance();
      QuestService.instance = new QuestService(repository);
    }
    return QuestService.instance;
  }

  async getAllQuests(): Promise<QuestEntity[]> {
    return this.questRepository.findAll();
  }

  async completeQuest(questId: number): Promise<QuestEntity | false> {
    const quest = await this.questRepository.findById(questId);
    if (!quest) return false;

    const deleted = await this.questRepository.delete(questId);
    if (deleted) {
      await this.questRepository.feedRandomQuest();
      return quest;
    }
    return false;
  }
} 