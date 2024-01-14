import 'react-native-gesture-handler';

import { StyleSheet, Text, View } from 'react-native';

import StackNavigator from './navigators/MainNavigators';

export default function App() {
  return (
    <StackNavigator/>
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