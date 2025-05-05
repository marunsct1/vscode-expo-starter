import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ThemeProvider } from '../app/ThemeContext';

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token); // Set login status based on token presence
    };

    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    // Show a loading indicator while checking login status
    return (
      <LinearGradient
        colors={['#4CAF50', '#2196F3']} // Gradient colors (green to blue)
        style={styles.gradient}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <ThemeProvider>
      <LinearGradient
        colors={['#4CAF50', '#2196F3']} // Gradient colors (green to blue)
        style={styles.gradient}
      >
        <Slot />
      </LinearGradient>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
