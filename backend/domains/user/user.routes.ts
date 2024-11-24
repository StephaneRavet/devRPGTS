import { QuestService } from '@/domains/quest/Quest.service';
import { UserService } from '@/domains/user/User.service';
import { Request, Response, Router } from 'express';

const router = Router();

router.get('/:username', async (req, res) => {
  try {
    const userService = await UserService.getInstance();
    const user = await userService.getOrCreateUser(req.params.username);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post(
  '/:username/quests/:questId',
  async (
    req: Request<{ username: string; questId: string }>,
    res: Response
  ): Promise<void> => {
    const { username, questId } = req.params;

    try {
      const questService = await QuestService.getInstance();
      const userService = await UserService.getInstance();

      const quest = await questService.completeQuest(Number(questId));
      if (!quest) {
        res.status(400).json({ error: 'Quest not found' });
        return;
      }

      const updatedUser = await userService.addExperience(username, quest.xp);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

export { router as userRoutes };

