import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithAuth } from '../../app/authContext';
import { getBalance, getFriends, saveBalance, saveFriends } from '../../database/db';
import { setFriends, setTotalExpenses } from '../context/contextSlice';

// Accept dispatch and user as arguments
const fetchApiData = async (dispatch, user) => {
  try {
    console.log('Fetching initial data...',user);
    const lastLogin = await AsyncStorage.getItem('lastLogin');
    console.log('Last login:', lastLogin);
    await AsyncStorage.setItem('lastLogin', new Date().toISOString());
    console.log('Updated last login:', new Date().toISOString());
    // Fetch friends
    const friends = await getFriends();
    console.log('Fetched friends:', friends.length);
    if (friends.length > 0 && lastLogin !== null) {
      console.log('Fetching updated friends after:', lastLogin);
      // If there are friends and lastLogin is not null, fetch updated friends
      // after the last login date
      const response = await fetchWithAuth('/users/updated-after/' + lastLogin, { method: 'GET' });
      const data = await response.json();
      await saveFriends(data);
    } else {
      console.log('Fetching all friends');
      // If there are no friends or lastLogin is null, fetch all friends
      // and save them to the database
      const response = await fetchWithAuth('/users/updated-after/1990-01-01', { method: 'GET' });
      const data = await response.json();
      console.log('Response from fetch:', data.length);
      await saveFriends(await data);
    }
    dispatch(setFriends(await getFriends()));

    // Fetch balance
    if (user && user.userId !== undefined) {
      const fetchBalanceSRV = await fetchWithAuth('/users/' + user.userId + '/balances', { method: 'GET' });
      if (fetchBalanceSRV.ok) {
        const data = await fetchBalanceSRV.json();
        console.log('Fetched balance:', data.length, user.userId);
        if (data.length > 0) {
          await saveBalance(data);
          dispatch(setTotalExpenses(await getBalance()));
        }
      }
    }
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }
};

export default fetchApiData;