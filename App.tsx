import 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import StackNavigator from './navigators/MainNavigators';
import { StatusBar } from 'expo-status-bar';

export default function App() {

  // Carga de Fuentes Personalizadas
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
        // Manejo de error
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!fontLoaded) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <>
      <StatusBar hidden={true}/>
      <StackNavigator />
    </>
  );
}
