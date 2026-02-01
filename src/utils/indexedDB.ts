import { Character } from '../types/character';

const DB_NAME = 'FuderationCharacterEditor';
const DB_VERSION = 1;
const STORE_NAME = 'characters';

interface CharacterRecord {
  id: string;
  character: Character;
  createdAt: number;
  updatedAt: number;
}

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('无法打开数据库'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  async saveCharacter(character: Character): Promise<string> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // 生成唯一 ID
      const id = character.id?.toString() || `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();

      const record: CharacterRecord = {
        id,
        character,
        createdAt: now,
        updatedAt: now
      };

      const request = store.put(record);

      request.onsuccess = () => {
        resolve(id);
      };

      request.onerror = () => {
        reject(new Error('保存角色失败'));
      };
    });
  }

  async updateCharacter(id: string, character: Character): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const record = getRequest.result as CharacterRecord;
        if (!record) {
          reject(new Error('角色不存在'));
          return;
        }

        record.character = character;
        record.updatedAt = Date.now();

        const updateRequest = store.put(record);

        updateRequest.onsuccess = () => {
          resolve();
        };

        updateRequest.onerror = () => {
          reject(new Error('更新角色失败'));
        };
      };

      getRequest.onerror = () => {
        reject(new Error('获取角色失败'));
      };
    });
  }

  async getCharacter(id: string): Promise<CharacterRecord | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('获取角色失败'));
      };
    });
  }

  async getAllCharacters(): Promise<CharacterRecord[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('updatedAt');
      const request = index.openCursor(null, 'prev'); // 按更新时间倒序

      const characters: CharacterRecord[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          characters.push(cursor.value);
          cursor.continue();
        } else {
          resolve(characters);
        }
      };

      request.onerror = () => {
        reject(new Error('获取角色列表失败'));
      };
    });
  }

  async deleteCharacter(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('删除角色失败'));
      };
    });
  }

  async clearAll(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('清空数据失败'));
      };
    });
  }
}

export const db = new IndexedDBService();
export type { CharacterRecord };
