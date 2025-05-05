import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://expensebook-rea1.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to AsyncStorage
        await AsyncStorage.setItem('token', data.token);

        // Check if biometric authentication is available
        const hasBiometricHardware = await LocalAuthentication.hasHardwareAsync();
        const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasBiometricHardware && isBiometricEnrolled) {
          const enableBiometric = await new Promise((resolve) => {
            Alert.alert(
              'Enable Biometric Authentication',
              'Would you like to enable biometric authentication for future logins?',
              [
                { text: 'No', onPress: () => resolve(false) },
                { text: 'Yes', onPress: () => resolve(true) },
              ]
            );
          });

          if (enableBiometric) {
            await AsyncStorage.setItem('useBiometric', 'true');
            Alert.alert('Biometric Authentication Enabled', 'You can now use biometrics to log in.');
          }
        }

        Alert.alert('Login Successful', `Welcome!`);
        router.replace('/Authenticated/Home/personal'); // Redirect to tabs
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={() => router.push('/Unauthenticated/reset-password')}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
      <TouchableOpacity onPress={() => router.push('/Unauthenticated/signup')} style={styles.signupButton}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  link: {
    color: 'blue',
    textAlign: 'right',
    marginBottom: 16,
  },
  signupButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  signupText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});