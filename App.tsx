import 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import TopTabNavigator from './navigators/MainNavigators';

export default function App() {
  return (
      <TopTabNavigator/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
