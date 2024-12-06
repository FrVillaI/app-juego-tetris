import React, { useState } from 'react';
import { Alert, StyleSheet, Text, ImageBackground, Image, KeyboardAvoidingView, Keyboard} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import { auth } from '../config/Config';
import CustomInput from '../components/CustomTextInput';
import PasswordInput from '../components/PasswordInput';
import AuthButtons from '../components/AuthButtons';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {imagenes} from '../assets/imagenes'

export default function RegistroScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [nick, setNick] = useState('');
  const [edad, setEdad] = useState('');
  const [nombre, setNombre] = useState('');
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);

  //Funcion para registrar nuevo usuario y guardar informacion en la base de datos. 
  async function register() {
    if (!validacionImputsForm()) return;
    try {
      const db = getDatabase();
      const usersRef = ref(db, `users/${nick}`);
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        Alert.alert('Error', 'El nick ya está en uso.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasenia);
      const user = userCredential.user;

      await set(ref(db, `users/${user.uid}`), {
        nick,
        correo,
        edad,
        nombre,
      });

      clearFields();
      navigation.navigate('Inciar_Secion');
      Alert.alert('Éxito', 'Registro exitoso');
    } catch (error) {
      handleFirebaseError(error);
    }
  }

  //Funcion para validar si los datos ingresados son validos
  function validacionImputsForm() {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(correo)) {
      Alert.alert('Error', 'Por favor ingresa un correo válido.');
      return false;
    }
    if (contrasenia.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    if (isNaN(Number(edad)) || Number(edad) <= 0) {
      Alert.alert('Error', 'Por favor ingresa una edad válida.');
      return false;
    }
    return true;
  }

  //Funcion para el manejo de errores por parte de Firebase
  function handleFirebaseError(error: any) {
    switch (error.code) {
      case 'auth/weak-password':
        Alert.alert('Error', 'La contraseña es débil.');
        break;
      case 'auth/email-already-in-use':
        Alert.alert('Error', 'El correo ya está en uso.');
        break;
      default:
        Alert.alert('Error', error.message);
        break;
    }
  }

  //Funcion para limpiar campos
  function clearFields() {
    setCorreo('');
    setContrasenia('');
    setNick('');
    setEdad('');
    setNick('');
    setNombre('');
  }

  //Funcion para ocultar o mostrar informacion de la contrasenia
  const toggleMostrarContrasenia = () => {
    setMostrarContrasenia(!mostrarContrasenia);
  };

  return (
    <ImageBackground source={imagenes.background} style={styles.backgroundImage}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>

            <Text style={styles.title}>Registro</Text>
            
            <Image source={imagenes.logo} style={styles.logoImage} />

            <CustomInput
              placeholder="Ingresa tu Nombre"
              onChangeText={setNombre}
              value={nombre}
            />

            <CustomInput
              placeholder="Ingresar tu Nick"
              onChangeText={setNick}
              value={nick}
            />

            <CustomInput
              placeholder="Ingresa tu Email"
              onChangeText={setCorreo}
              value={correo}
              keyboardType="email-address"
            />

            <PasswordInput
              value={contrasenia}
              onChangeText={setContrasenia}
              mostrarContrasenia={mostrarContrasenia}
              iconoMostrarContrasenia={toggleMostrarContrasenia}
            />

            <CustomInput
              placeholder="Ingresa tu Edad"
              onChangeText={setEdad}
              value={edad}
              keyboardType="numeric"
            />

            <AuthButtons
              onLoginPress={() => navigation.navigate('Inciar_Secion')}
              onRegisterPress={() => register()}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginTop: 75,
    fontSize: 30,
    fontFamily: 'Pixel Emulator Font',
    marginBottom: 25,
    color: '#ffffff',
  },
  logoImage: {
    width: 300,
    height: 80,
    marginBottom: 40,
  },
});
