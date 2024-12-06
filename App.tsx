import 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import StackNavigator from './navigators/MainNavigators';

export default function App() {
  const [fontLoaded] = useFonts({
    'Pixel Emulator Font': require('./assets/fonts/PixelEmulator-xq08.ttf'),
    'OLD SPORT ATHLETIC Font': require('./assets/fonts/OldSport02AthleticNcv-E0gj.ttf'),
    'my-custom-font': require('./assets/fonts/Tetris.ttf'),
  });

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await SplashScreen.hideAsync();
      } catch (e) {
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!fontLoaded) {
    return <View><Text>Loading...</Text></View>;
  }

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
