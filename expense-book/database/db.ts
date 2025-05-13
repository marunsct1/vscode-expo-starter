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
      `CREATE TABLE IF NOT EXISTS balance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT UNIQUE,
        name TEXT,
        currency TEXT,
        balance REAL
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

export const saveFriends = async (friends: { id: string; first_name: string; last_name: string; username: string; phone: string; email: string }[]) => {
  await db.withTransactionAsync(async () => {
    for (const friend of friends) {
      await db.runAsync(
        `INSERT OR REPLACE INTO friends (userId, username, first_name, last_name, email, phone) VALUES (?, ?, ?,?,?,?);`,
        [friend.id, friend.username, friend.first_name, friend.last_name, friend.email, friend.phone]
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
export const saveBalance = async (balances: { user_id: string; currency: string; balance: number }[]) => {
  try {
    await db.withTransactionAsync(async () => {
      for (const balance of balances) {
        // Fetch the name from the friends table using the user_id
        const result:{name:string} = (await db.getFirstAsync(
          `SELECT first_name || ' ' || last_name AS name FROM friends WHERE userId = ?;`,
          [balance.user_id]
        )) || { name: '' };

        const name = result.name || ''; // Default to 'Unknown' if no name is found

        // Insert or replace the balance with the fetched name
        await db.runAsync(
          `INSERT OR REPLACE INTO balance (userId, name, currency, balance) VALUES (?, ?, ?, ?);`,
          [balance.user_id, name, balance.currency, balance.balance]
        );
      }
    });
    console.log('Balances saved successfully');
  } catch (error) {
    console.error('Error saving balances:', error);
  }
};
export const getBalance = async (): Promise<{ totalBalance: { Amount: number; Currency: string }[]; userBalance: { id: string; name: string; balances: { currency: string; amount: number }[] }[] }> => {
  let balance: { totalBalance: { Amount: number; Currency: string }[]; userBalance: { id: string; name: string; balances: { currency: string; amount: number }[] }[] } = { totalBalance: [], userBalance: [] };
  try {
    await db.withTransactionAsync(async () => {
      const result = await db.getAllAsync(`SELECT * FROM balance;`) as { id: string; userId:string; name: string; currency: string; amount: number }[];
      balance = await convertToBalanceFormat(result) as { totalBalance: { Amount: number; Currency: string }[]; userBalance: { id: string; name: string; balances: { currency: string; amount: number }[] }[] };
    });
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
  return balance;
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

const convertToBalanceFormat = async (data: { id: string; userId: string; name: string; currency: string; amount: number }[]) =>{
  // Group by user for userBalance
  const userMap: Record<string, { id: string; name: string; balances: { currency: string; amount: number }[] }> = {};
  // Group by currency for totalBalance
  const currencyMap: Record<string, number> = {};

  data.forEach(item => {
    // Build userBalance
    if (!userMap[item.userId]) {
      userMap[item.userId] = { id: item.userId, name: item.name, balances: [] };
    }
    userMap[item.userId].balances.push({ currency: item.currency, amount: item.amount });

    // Build totalBalance
    if (!currencyMap[item.currency]) {
      currencyMap[item.currency] = 0;
    }
    currencyMap[item.currency] += item.amount;
  });

  const userBalance = Object.values(userMap);
  const totalBalance = Object.entries(currencyMap).map(([Currency, Amount]) => ({ Amount, Currency }));

  return { totalBalance, userBalance };
}