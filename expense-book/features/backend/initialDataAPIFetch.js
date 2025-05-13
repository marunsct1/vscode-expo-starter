import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWithAuth } from '../../app/authContext';
import { getFriends, saveFriends } from '../../database/db'; // Adjust the import path as necessary
import { useDispatch, useSelector } from 'react-redux';
import { setFriends } from '../context/contextSlice';

const lastLogin = await AsyncStorage.getItem('lastLogin');
AsyncStorage.setItem('lastLogin', new Date().toISOString());

const dispatch = useDispatch()

const fetchFriends = async () => { 
    try {
      const friends = await getFriends();
      console.log('Friends:', friends.);
      if (friends.length > 0) { 
        const response = await fetchWithAuth('/users/updated-after/' + lastLogin, {
          method: 'GET'} );
          saveFriends(response.data);
      }else{
        console.log('No friends found');
        
        const response = await fetchWithAuth('/users/updated-after/1990-01-01', {
          method: 'GET'} );
          saveFriends(response.data);
      }
      
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
    useDispatch(setFriends(friends))
  }


  export default fetchApiData = async () => {
    try {
      
    }catch (error) {   
      console.error('Error fetching initial data:', error);
    }
  }