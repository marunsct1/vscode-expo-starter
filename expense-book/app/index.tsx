import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { initializeDatabase } from '../database/db'; // Adjust the import path as necessary

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      console.log('opening DB...');
      initializeDatabase(); // Initialize the database
      const token = await AsyncStorage.getItem('token'); // Check if token exists
      const useBiometric = await AsyncStorage.getItem('useBiometric'); // Check if biometric is enabled

      if (token) {
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
  }, []);

  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});