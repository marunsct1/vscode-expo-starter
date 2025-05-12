// filepath: /workspaces/vscode-expo-starter/expense-book/database/db.ts
import * as SQLite from 'expo-sqlite';

if (!SQLite.openDatabaseSync) {
  throw new Error("The 'openDatabaseSync' method is not available in the current version of expo-sqlite.");
}

const db = SQLite.openDatabaseSync('expenseBook.db');

export const initializeDatabase = async () => {
  // await db.withTransactionAsync(async () => {
  console.log('Initializing database...');
  try {
    // Check if the database is already initialized
    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT UNIQUE,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        gender TEXT,
        phone TEXT,
        country TEXT,
        profile_picture TEXT,
        date_of_birth TEXT,
        token TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT UNIQUE,
        username TEXT,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        phone TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT,
        amount REAL,
        currency TEXT,
        date TEXT,
        description TEXT,
        FOREIGN KEY (userId) REFERENCES users (userId)
      );`
    ];

    for (const query of queries) {
      await db.execAsync(query);
    }
    console.log('Initializing database complete...');
  } catch (error) {
    console.error('Error initializing database:', error);

  }

  // });
};

export const saveUser = async (user: { id: string; username: string; first_name: string; last_name: string; email: string; gender: string; phone: string; country: string; profile_picture: string; date_of_birth: string; token: string }) => {
  console.log('Saving user to DB...', user);
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT OR REPLACE INTO users (userId , username,first_name,last_name,email,gender ,phone,country,profile_picture,date_of_birth, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [user.id, user.username, user.first_name, user.last_name, user.email, user.gender, user.phone, user.country, user.profile_picture, user.date_of_birth, user.token]
      );
    });
    console.log('User saved to DB successfully');

  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const saveFriends = async (friends: { userId: string; name: string; email: string }[]) => {
  await db.withTransactionAsync(async () => {
    for (const friend of friends) {
      await db.runAsync(
        `INSERT OR REPLACE INTO friends (userId, name, email) VALUES (?, ?, ?);`,
        [friend.userId, friend.name, friend.email]
      );
    }
  });
};
export const getFriends = async (): Promise<any[]> => {
  let friends: any[] = [];
  try {
    await db.withTransactionAsync(async () => {
      const result = await db.getAllAsync(`SELECT * FROM friends;`);
      friends = result;
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
  }
  return friends;
};


export const getUser = async (): Promise<any> => {
  let user = null;
  console.log('Fetching user from DB...');
  try {
    // await db.withTransactionAsync(async () => {
    const db = SQLite.openDatabaseSync('expenseBook.db');
    const result = await db.getFirstAsync(`SELECT * FROM users LIMIT 1;`);
    console.log('User fetched:', result);
    user = result || null;
    // });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

export const clearUserData = async () => {
  await db.withTransactionAsync(async () => {
    await db.execAsync(`DELETE FROM users;`);
    await db.execAsync(`DELETE FROM expenses;`);
  });
};