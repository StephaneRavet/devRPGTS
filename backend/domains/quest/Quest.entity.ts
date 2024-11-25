import { Quest, QuestRarity } from '@shared/Quest.interface';

export class QuestEntity implements Quest {
  constructor(
    public id: number,
    public name: string,
    public xp: number,
    public rarity: QuestRarity,
  ) { }

  static fromDatabase(data: any): QuestEntity {
    return new QuestEntity(
      data.id,
      data.name,
      data.xp,
      data.rarity,
    );
  }
} 