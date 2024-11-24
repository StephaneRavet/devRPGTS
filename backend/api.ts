import { DatabaseConnection } from '@/DatabaseConnection';
import { QuestRepository } from '@/domains/quest/Quest.repository';
import { questRoutes } from '@/domains/quest/quest.routes';
import { userRoutes } from '@/domains/user/user.routes';
import cors from 'cors';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/quests', questRoutes);
app.use('/api/users', userRoutes);

async function startServer() {
  try {
    await DatabaseConnection.getInstance();
    const questRepo = await QuestRepository.getInstance();

    // Initialize with 3 quests if needed
    const quests = await questRepo.findAll();
    for (let i = quests.length; i < 3; i++) {
      await questRepo.feedRandomQuest();
    }

    app.listen(PORT, () => {
      console.log(`API Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('API Server startup error:', error);
    process.exit(1);
  }
}

startServer(); 