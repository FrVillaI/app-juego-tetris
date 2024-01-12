import { TouchableOpacity, StyleSheet, Text, View, ImageBackground, Button, Image } from 'react-native';
import React from 'react';

const backgroundImage = require('../assets/fondo_tetris.jpg');
const logoImage = require('../assets/logo.png');

export default function WelcomeScreen({ navigation }: any) {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Image source={logoImage} style={styles.logoImage} />
        <Button title='Regístrarse' onPress={() => navigation.navigate('Registro')} color={'#c70f0f'}/>
        <View style={styles.es}/>
        <Button title='Iniciar sesión' onPress={() => navigation.navigate('Inciar_Secion')} color={'#0fc73a'}/>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginTop: 150,
    fontSize: 24,
    fontWeight: 'bold',
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
  es:{
    marginBottom: 30,
  }
});