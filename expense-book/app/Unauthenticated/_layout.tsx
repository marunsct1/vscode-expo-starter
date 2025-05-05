import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './login';
import ResetPassword from './reset-password';
import Signup from './signup';

const Drawer = createDrawerNavigator();

export default function UnauthenticatedLayout() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="login"
        options={{ headerShown: true,  title: 'Login' }}
        component={Login} // Load the login screen
      />
      <Drawer.Screen
        name="signup"
        options={{ title: 'Sign Up' }}
        component={Signup} // Load the sign-up screen
      />
      <Drawer.Screen
        name="reset-password"
        options={{ title: 'Reset Password' }}
        component={ResetPassword} // Load the reset-password screen
      />
    </Drawer.Navigator>
  );
}