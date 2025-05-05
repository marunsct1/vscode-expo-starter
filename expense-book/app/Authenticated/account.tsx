import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
export default function Account() {
    const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token'); // Clear the token
    router.replace('/Unauthenticated/login'); // Redirect to login screen
  };
  return (
    <View style={styles.container}>
      <Text>Account Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
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