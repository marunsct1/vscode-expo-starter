import { fetchWithAuth } from '../../app/authContext';
import { db } from '../../database/db';
import { fetchWithAuth } from '../app/authContext';

if (!SQLite.openDatabaseSync) {
  throw new Error("The 'openDatabaseSync' method is not available in the current version of expo-sqlite.");
}

//const db = SQLite.openDatabaseSync('expenseBook.db');

export const syncPendingActions = async () => {
  const actions = await db.getAllAsync(`SELECT * FROM sync_queue ORDER BY created_at ASC;`);
  for (const action of actions) {
    try {
      const options = JSON.parse(action.options);
      const response = await fetchWithAuth(action.url, options);
      if (response.ok) {
        await db.runAsync(`DELETE FROM sync_queue WHERE id = ?;`, [action.id]);
      } else {
        // Stop if backend returns error (to avoid repeated failures)
        break;
      }
    } catch (e) {
      // Stop on error (e.g., still offline)
      break;
    }
  }
};