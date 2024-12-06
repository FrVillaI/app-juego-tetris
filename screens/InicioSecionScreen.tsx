import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View, ImageBackground, Image, TextInput } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/Config';
import { imagenes } from '../assets/imagenes';
import CustomInput from '../components/CustomTextInput';
import PasswordInput from '../components/PasswordInput';
import AuthButtons from '../components/AuthButtons';

export default function LoginScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);

  // Funcion Inicio de Sesión 
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

  // Funcion para ocultar o mostrar información de la contraseña
  const toggleMostrarContrasenia = () => {
    setMostrarContrasenia(!mostrarContrasenia);
  };

  return (
    <ImageBackground
      source={imagenes.background}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <Image source={imagenes.logo} style={styles.logoImage} />

        <CustomInput
          placeholder='Ingresa tu Email'
          onChangeText={setCorreo}
          value={correo}
          keyboardType='email-address'
        />

        <PasswordInput
          value={contrasenia}
          onChangeText={setContrasenia}
          mostrarContrasenia={mostrarContrasenia}
          iconoMostrarContrasenia={toggleMostrarContrasenia}
        />

        <AuthButtons
          onLoginPress={() => login()}
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
});
