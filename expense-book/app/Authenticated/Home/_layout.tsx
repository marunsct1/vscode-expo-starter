import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="personal" options={{ headerShown: false, title : "Personal"}} />
      <Tabs.Screen name="friends" options={{  title : "Friends"}} />
      <Tabs.Screen name="groups" options={{  title : "Groups" }} />
      <Tabs.Screen name="accountant" options={{  title : "Accountant" }} />
    </Tabs>
  );
}