export class Cache<T> {
  private items: Map<string, { data: T; timestamp: number }>;
  private readonly ttl: number;

  constructor(ttlInSeconds: number = 300) { // 5 minutes par défaut
    this.items = new Map();
    this.ttl = ttlInSeconds * 1000;
  }

  set(key: string, value: T): void {
    this.items.set(key, {
      data: value,
      timestamp: Date.now()
    });
  }

  get(key: string): T | null {
    const item = this.items.get(key);

    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.items.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.items.clear();
  }

  delete(key: string): void {
    this.items.delete(key);
  }
} 