import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
import { clearUserData } from '../../database/db'; // Adjust the import path as necessary
import { useTheme } from '../ThemeContext'; // Import the theme context
import { removeToken } from '../authContext'; // Import the removeToken function

export default function Account() {
    const router = useRouter();
    const theme = useTheme(); // Access the theme
  const handleLogout = async () => {
    removeToken(); // Clear the token
    clearUserData(); // Clear user data from the database
    router.replace('/Unauthenticated/login'); // Redirect to login screen
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Account Screen</Text>
      <Button
        title="Logout"
        onPress={handleLogout}
        color={theme.colors.primary} // Apply theme color to the button
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});