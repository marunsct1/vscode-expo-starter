import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { getUser, initializeDatabase } from '../database/db';
import fetchApiData from '../features/backend/initialDataAPIFetch';
import { setUserAndGetState } from '../features/context/contextThunks';
import { getApiKey } from './authContext';
import { store } from './store';
import {syncPendingActions} from '../features/backend/syncDevicetoDB';

function AppContent() {
  const router = useRouter();
  const user = useSelector((state: any) => state.context.user); // Fix typing
  const dispatch = useDispatch();

  const setUserInRedux = async () => {
    try {
      if (!user.userId && !user.user_id) {
        const dbUser = await getUser();
        if (dbUser) {
          console.log('User found in DB:', dbUser.userId || dbUser.user_id);
          // Set user in Redux store and get updated user
          const reduxUser = await dispatch<any>(setUserAndGetState(dbUser));
          console.log('User sent to Redux:', reduxUser.userId || reduxUser.user_id);
          // Fetch API data after setting user in Redux
          await fetchApiData(dispatch, reduxUser);
        } else {
          await fetchApiData(dispatch, user);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      console.log('opening DB...');
      await initializeDatabase(); // Initialize the database

      const token = await AsyncStorage.getItem('token'); // Check if token exists
      const useBiometric = await AsyncStorage.getItem('useBiometric'); // Check if biometric is enabled

      if (token) {
        await getApiKey(token);
        await setUserInRedux(); // Fetch the API key and set user

        if (useBiometric === 'true') {
          // Perform biometric authentication
          const hasBiometricHardware = await LocalAuthentication.hasHardwareAsync();
          const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
          const supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();

          if (hasBiometricHardware && isBiometricEnrolled) {
            // Check if Face ID is supported
            const isFaceIDSupported = supportedBiometrics.includes(
              LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
            );

            const biometricAuth = await LocalAuthentication.authenticateAsync({
              promptMessage: isFaceIDSupported
                ? 'Authenticate with Face ID'
                : 'Authenticate with Biometrics',
            });

            if (biometricAuth.success) {
              router.replace('/Authenticated/Home/personal'); // Redirect to tabs
              return;
            } else {
              Alert.alert('Authentication Failed', 'Please log in manually.');
              router.replace('/Unauthenticated/login'); // Redirect to login
              return;
            }
          } else {
            Alert.alert('Biometric Authentication Not Available', 'Please log in manually.');
            router.replace('/Unauthenticated/login'); // Redirect to login
            return;
          }
        } else {
          router.replace('/Unauthenticated/login'); // Redirect to login if biometric is not enabled
        }
      } else {
        router.replace('/Unauthenticated/login'); // Redirect to login if no token is found
      }
    };
    checkLoginStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncPendingActions(); // Try to sync when online
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});