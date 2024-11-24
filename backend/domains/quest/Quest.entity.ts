import { Quest } from '@/domains/quest/Quest.interface';

export class QuestEntity implements Quest {
  constructor(
    public name: string,
    public xp: number,
    public description?: string,
    public id?: number
  ) { }

  static fromDatabase(data: any): QuestEntity {
    return new QuestEntity(
      data.name,
      data.xp,
      data.description,
      data.id
    );
  }
} 