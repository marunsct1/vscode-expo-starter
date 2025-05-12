import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../../ThemeContext';
import { fetchWithAuth } from '../../authContext';

// Example: totalBalance is now an array of objects
const totalBalance = [
  { Amount: 50, Currency: 'CAD' },
  { Amount: -50, Currency: 'USD' },
];

const expenses = {
  users: [
    {
      id: '1',
      name: 'Alice',
      balances: [
        { currency: 'USD', amount: 50 },
        { currency: 'EUR', amount: 20 },
      ],
    },
    {
      id: '2',
      name: 'Bob',
      balances: [
        { currency: 'USD', amount: -100 },
      ],
    },
    {
      id: '3',
      name: 'Charlie',
      balances: [
        { currency: 'EUR', amount: 200 },
      ],
    },
  ],
};

export default function Friends() {
  const theme = useTheme();
  const [balance, setBalance] = useState([]);
  const user = useSelector((state: any) => state.context.user);

  useEffect(() => {
    if (user) {
      console.log('User loaded in Friends:', user.userId);
    }
  }, []);

  useEffect(() => {
    try {
      const fetchData = async () => {
        console.log('Fetching data...', user.userId);
        if (user.userId !== undefined) {
          const fetchBalanceSRV = await fetchWithAuth('/users/' + user.userId + '/balances', {
            method: 'GET',
          });
          console.log('Balance fetch response:', fetchBalanceSRV);
          if (fetchBalanceSRV.ok) {
            const data = await fetchBalanceSRV.json();
            console.log('Balance data:', data);
            if (data.length > 0) {
              setBalance(data);
            }
          } else {
            console.log('Error fetching balance:', fetchBalanceSRV.status);
          }
        } else {
          console.log('User ID is undefined');
        }
      };
      fetchData();
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, [user]);

  // Helper to determine if the amount is owed or to be received
  const getLabel = (amount: number) => (amount > 0 ? 'You are Owed' : 'You Owe');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        {totalBalance.map((entry, idx) => (
          <View key={entry.Currency} style={styles.totalRow}>
            <Text style={styles.totalType}>
              {getLabel(entry.Amount)}
            </Text>
            <Text
              style={[
                styles.totalAmount,
                { color: entry.Amount > 0 ? theme.colors.primary : theme.colors.accent },
              ]}
            >
              {entry.Currency} {entry.Amount > 0 ? `+${entry.Amount}` : entry.Amount}
            </Text>
          </View>
        ))}
      </View>
      <FlatList
        data={expenses.users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItemContainer} activeOpacity={0.8}>
            <View style={styles.userNameContainer}>
              <Text style={[styles.userName, { color: theme.colors.textPrimary }]}>{item.name}</Text>
            </View>
            <View style={styles.userBalancesContainer}>
              {item.balances.map((bal) => (
                <View key={bal.currency} style={styles.balanceItem}>
                  <Text
                    style={[
                      styles.userAmount,
                      { color: bal.amount > 0 ? theme.colors.primary : theme.colors.accent },
                    ]}
                  >
                    {bal.currency} {bal.amount > 0 ? `+${bal.amount}` : bal.amount}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  totalContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#444',
  },
  totalRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  totalType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 0,
  },
  listContainer: {
    paddingVertical: 8,
  },
  userItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#bbb',
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  userNameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userBalancesContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  balanceItem: {
    marginLeft: 8,
  },
  userName: {
    fontSize: 16,
  },
  userAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});