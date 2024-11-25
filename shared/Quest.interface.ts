export type QuestRarity = "common" | "rare" | "epic" | "legendary";

export interface Quest {
  id: number;
  name: string;
  xp: number;
  rarity: QuestRarity;
}

// Constantes pour les taux d'apparition (optionnel, à placer dans un fichier de constantes si préféré)
export const QUEST_SPAWN_RATES = {
  common: 0.60,    // 60%
  rare: 0.25,      // 25%
  epic: 0.10,      // 10%
  legendary: 0.05  // 5%
} as const;
