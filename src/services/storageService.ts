import { get, set, del } from 'idb-keyval';
import { SpreadsheetPage } from '../types';

const PAGES_KEY = 'grid_finance_pages_v2';
const LEGACY_LOCAL_STORAGE_KEY = 'grid_finance_pages';

/**
 * Storage service to handle IndexedDB operations for spreadsheet pages.
 * Includes a migration path from legacy localStorage.
 */
export const storageService = {
  /**
   * Loads all spreadsheet pages from IndexedDB.
   * If not found, attempts to migrate from localStorage.
   */
  async loadPages(): Promise<SpreadsheetPage[] | null> {
    try {
      // 1. Try loading from IndexedDB (v2)
      const pages = await get<SpreadsheetPage[]>(PAGES_KEY);
      if (pages && pages.length > 0) {
        return pages;
      }

      // 2. If not in IndexedDB, check legacy localStorage
      const legacyData = localStorage.getItem(LEGACY_LOCAL_STORAGE_KEY);
      if (legacyData) {
        const parsedLegacy = JSON.parse(legacyData);
        if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
          // Migrate to IndexedDB
          await this.savePages(parsedLegacy);
          // Optional: Clear legacy data to avoid confusion, 
          // but keeping it for one more session might be safer
          // localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
          return parsedLegacy;
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to load pages from storage:', error);
      return null;
    }
  },

  /**
   * Saves all spreadsheet pages to IndexedDB.
   */
  async savePages(pages: SpreadsheetPage[]): Promise<void> {
    try {
      await set(PAGES_KEY, pages);
    } catch (error) {
      console.error('Failed to save pages to IndexedDB:', error);
      // Fallback to localStorage if IndexedDB fails (unlikely but safe)
      try {
        localStorage.setItem(LEGACY_LOCAL_STORAGE_KEY, JSON.stringify(pages));
      } catch (lsError) {
        console.error('Critical: Failed to save to both IndexedDB and localStorage', lsError);
      }
    }
  },

  /**
   * Clears all storage (useful for reset/debug).
   */
  async clearAll(): Promise<void> {
    await del(PAGES_KEY);
    localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
  }
};
