import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/Config';
import * as Font from 'expo-font';

const backgroundImage = require('../assets/fondo_tetris.jpg');
const logoImage = require('../assets/logo.png');
const fetchFonts = async () => {
  try {
    await Font.loadAsync({
      'Pixel Emulator Font': require('../assets/fonts/PixelEmulator-xq08.ttf'),
    });

    console.log('Font loaded successfully');
  } catch (error) {
    console.log('Error loading font', error);
  }
};

export default function LoginScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);

  function login() {
    signInWithEmailAndPassword(auth, correo, contrasenia)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.navigate('Tabs');
        setCorreo('');
        setContrasenia('');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        switch (errorCode) {
          case 'auth/invalid-credential':
            Alert.alert('Error', 'Credenciales Incorrectas');
            break;

          case 'auth/missing-password':
            Alert.alert('Error', 'Credenciales Perdidas');
            break;

          default:
            Alert.alert('Error', errorMessage);
            break;
        }
      });
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <Image source={logoImage} style={styles.logoImage} />

        <TextInput
          style={styles.input}
          placeholder='Ingresa tu Email'
          keyboardType='email-address'
          onChangeText={(texto) => setCorreo(texto)}
          value={correo}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder='Ingresa tu Contraseña'
            onChangeText={(texto) => setContrasenia(texto)}
            value={contrasenia}
            secureTextEntry={!mostrarContrasenia}
          />
          <TouchableOpacity
            onPress={() => setMostrarContrasenia(!mostrarContrasenia)}
            style={styles.showPasswordIcon}
          >
            <Text style={styles.eyeIcon}>{mostrarContrasenia ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonI} onPress={() => login()}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <View style={styles.buttonSpacer} />
          <TouchableOpacity style={styles.buttonR} onPress={() => navigation.navigate('Registro')}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: 100,
    fontSize: 30,
    fontFamily: 'Pixel Emulator Font',
    marginBottom: 25,
    color: 'white',
    justifyContent: 'center',
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
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    opacity: 0.8,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 20,
    position: 'relative',
  },
  inputPassword: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    opacity: 0.8,
    fontSize: 16,
  },
  showPasswordIcon: {
    position: 'absolute',
    right: 10,
  },
  eyeIcon: {
    fontSize: 20,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonSpacer: {
    width: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonI: {
    backgroundColor: '#c70f0f',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonR: {
    backgroundColor: '#0fc73a',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});