import { TouchableOpacity, StyleSheet, Text, View, ImageBackground, Button, Image } from 'react-native';
import React from 'react';
import AuthButtons from '../components/AuthButtons';
import {imagenes} from '../assets/imagenes'

export default function WelcomeScreen({ navigation }: any) {
  return (
    <ImageBackground
      source={imagenes.background}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>

        <Image source={imagenes.logo} style={styles.logoImage} />

        <AuthButtons
          onLoginPress={() => navigation.navigate('Inciar_Secion')}
          onRegisterPress={() => navigation.navigate('Registro')}
        />

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 50,
  },
  title: {
    marginTop: 150,
    fontSize: 34,
    fontFamily: 'Pixel Emulator Font',
    marginBottom: 25,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logoImage: {
    width: 300,
    height: 80,
    marginBottom: 40,
  },
});