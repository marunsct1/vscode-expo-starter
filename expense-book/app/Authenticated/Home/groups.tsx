import { StyleSheet, Text, View } from 'react-native';

export default function Groups() {
  return (
    <View style={styles.container}>
      <Text>Groups Screen</Text>
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