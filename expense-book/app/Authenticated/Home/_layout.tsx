import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import { Tabs } from 'expo-router';
import { useTheme } from '../../ThemeContext'; // Import the theme context

export default function TabLayout() {
  const theme = useTheme(); // Access the theme

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.colors.background }, // Tab bar background color
        tabBarActiveTintColor: theme.colors.primary, // Active tab icon color
        tabBarInactiveTintColor: theme.colors.textSecondary, // Inactive tab icon color
      }}
    >
      <Tabs.Screen
        name="personal"
        options={{
          headerShown: false,
          title: "Personal",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="accountant"
        options={{
          title: "Accountant",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calculator-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}