import { QuestService } from '@/domains/quest/Quest.service';
import { Router } from 'express';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const questService = await QuestService.getInstance();
    const quests = await questService.getAllQuests();
    res.json(quests);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export { router as questRoutes };

