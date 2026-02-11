import { createClient } from '@supabase/supabase-js';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// localStorage adapter using expo-sqlite for native, localStorage for web
class SupabaseStorage {
  private db: SQLite.SQLiteDatabase | null = null;

  private async getDb() {
    if (this.db) return this.db;
    this.db = await SQLite.openDatabaseAsync('supabase-storage');
    await this.db.execAsync(
      'CREATE TABLE IF NOT EXISTS storage (key TEXT PRIMARY KEY, value TEXT);'
    );
    return this.db;
  }

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    const db = await this.getDb();
    const row = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM storage WHERE key = ?;',
      [key]
    );
    return row?.value ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    const db = await this.getDb();
    await db.runAsync(
      'INSERT OR REPLACE INTO storage (key, value) VALUES (?, ?);',
      [key, value]
    );
  }

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    const db = await this.getDb();
    await db.runAsync('DELETE FROM storage WHERE key = ?;', [key]);
  }
}

const storage = new SupabaseStorage();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key) => storage.getItem(key),
      setItem: (key, value) => storage.setItem(key, value),
      removeItem: (key) => storage.removeItem(key),
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
