import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Text } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import StackNavigator from './navigators/MainNavigators';

export default function App() {
  const [fontLoaded] = useFonts({
    'my-custom-font': require('./assets/fonts/Tetris.ttf'),
  });

  if (!fontLoaded) {
    return <AppLoading />;
  }

  return (
    <StackNavigator />
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