import { createDrawerNavigator } from '@react-navigation/drawer';
import { Slot } from 'expo-router';
import Account from './account';
import Settings from './settings';

const Drawer = createDrawerNavigator();

export default function AuthenticatedLayout() {
  return (
    <Drawer.Navigator>
      {/* Home Screen with Tabs */}
      <Drawer.Screen
        name="Home"
        options={{ headerShown: true, title: 'Home' }}
        component={HomeWrapper} // Use a wrapper to render nested routes
      />
      {/* Settings Screen */}
      <Drawer.Screen
        name="settings"
        options={{ title: 'Settings' }}
        component={Settings} // Load the settings screen
      />
      {/* Account Screen */}
      <Drawer.Screen
        name="account"
        options={{ title: 'Account' }}
        component={Account} // Load the account screen
      />
    </Drawer.Navigator>
  );
}

// Wrapper for the Home screen to render nested routes
function HomeWrapper() {
  return <Slot />;
}