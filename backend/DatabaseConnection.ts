import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

interface DatabaseConfig {
  filename: string;
  driver: any;
}

export class DatabaseConnection {
  private static instance: Database | null = null;

  static async getInstance(): Promise<Database> {
    if (!this.instance) {
      const config: DatabaseConfig = {
        filename: './data/database.sqlite',
        driver: sqlite3.Database
      };

      this.instance = await open(config);
      await this.initializeTables();
    }
    return this.instance;
  }

  private static async initializeTables(): Promise<void> {
    if (!this.instance) return;

    await this.instance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        level INTEGER,
        xp INTEGER
      )
    `);

    await this.instance.exec(`
      CREATE TABLE IF NOT EXISTS quests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        xp INTEGER
      )
    `);
  }
} 