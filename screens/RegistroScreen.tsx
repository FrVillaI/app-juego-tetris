import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, ImageBackground, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, child, get } from 'firebase/database';
import { auth } from '../config/Config';
import { TouchableOpacity } from 'react-native-gesture-handler';

const backgroundImage = require('../assets/fondo_tetris.jpg');
const logoImage = require('../assets/logo.png');

export default function RegistroScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [nick, setNick] = useState('');
  const [edad, setEdad] = useState('');
  const [nombre, setNombre] = useState('');
  const [mostrarContrasenia, setMostrarContrasenia] = useState(false);
  const [camposIncompletos, setCamposIncompletos] = useState(false);

  function register() {
    // Check if the email is already in use
    if (!nombre || !nick || !correo || !contrasenia || !edad) {
      Alert.alert('Campos Incompletos', 'Por favor, completa todos los campos.');
      setCamposIncompletos(true);
      return;
    }

    const db = getDatabase();
    const usersRef = ref(db, 'users');
    const query = child(usersRef, nick);

    get(query)
      .then((snapshot) => {
        if (snapshot.exists()) {
          Alert.alert('Error', 'El nick ya está en uso por otra cuenta.');
        } else {
          createUserWithEmailAndPassword(auth, correo, contrasenia)
            .then((userCredential) => {
              const user = userCredential.user;
              const userRef = ref(db, `users/${user.uid}`);
              set(userRef, {
                nick: nick,
                correo: correo,
                edad: edad,
                nombre: nombre,
              });

              clearFields();
              navigation.navigate('Inciar_Secion');
              Alert.alert('Éxito', 'Registro exitoso');
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;

              switch (errorCode) {
                case 'auth/weak-password':
                  Alert.alert('Error', 'La contraseña es débil. Debe tener al menos 6 caracteres.');
                  break;

                case 'auth/email-already-in-use':
                  Alert.alert(
                    'Error',
                    'La dirección de correo electrónico ya está en uso por otra cuenta.'
                  );
                  break;

                default:
                  Alert.alert('Error', errorMessage);
                  break;
              }
            });
        }
      })
      .catch((error) => {
        console.error('Error checking nick availability:', error);
      });
  }

  function clearFields() {
    setCorreo('');
    setContrasenia('');
    setNick('');
    setEdad('');
    setNick('');
    setNombre('');
  }

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>
        <Image source={logoImage} style={styles.logoImage} />

        <TextInput
          style={styles.input}
          placeholder='Ingresa tu Nombre'
          onChangeText={(texto) => setNombre(texto)}
          value={nombre}
        />
        <TextInput
          style={styles.input}
          placeholder='Ingresar tu Nick'
          onChangeText={(texto) => setNick(texto)}
          value={nick}
        />
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
        <TextInput
          style={styles.input}
          placeholder='Ingresa tu Edad'
          onChangeText={(texto) => setEdad(texto)}
          value={edad}
          keyboardType='numeric'
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonI} onPress={() => register()}>
            <Text style={styles.buttonText}>Regístrarse</Text>
          </TouchableOpacity>
          <View style={styles.buttonSpacer} />
          <TouchableOpacity style={styles.buttonR} onPress={() => navigation.navigate('Inciar_Secion')}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#ffffff',
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
  inputPassword: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    opacity: 0.8,
    fontSize: 16,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    width: '80%',
    marginBottom: 20,
  },
  showPasswordIcon: {
    height: 40,
    backgroundColor: 'white',
    opacity: 0.8,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 20,
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
