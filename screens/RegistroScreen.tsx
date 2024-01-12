import React, { useState } from 'react';
import { View, Text, ImageBackground, Button, Image, TextInput, StyleSheet } from 'react-native';
import { guardarInfUser, registroUser } from '../components/FireBase';

const backgroundImage = require('../assets/fondo_tetris.jpg');
const logoImage = require('../assets/logo.png');

export default function RegistroScreen({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [nick, setNick] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [edad, setEdad] = useState('');
  const [camposLimpios, setCamposLimpios] = useState(false);

  const limpiarCampos = () => {
    setNombre('');
    setNick('');
    setCorreo('');
    setContrasenia('');
    setEdad('');
    setCamposLimpios(true);
  };

  const guadarUsuario = () => {
    registroUser(correo, contrasenia, { navigation });
    guardarInfUser(nick, correo, edad, nombre);
    limpiarCampos();
  };


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
        <TextInput
          style={styles.input}
          placeholder='Ingresa tu Contraseña'
          onChangeText={(texto) => setContrasenia(texto)}
          value={contrasenia}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder='Ingresa tu Edad'
          onChangeText={(texto) => setEdad(texto)}
          value={edad}
          keyboardType='numeric'
        />

        <View style={styles.buttonContainer}>
          <Button title='Regístrarse' onPress={() => guadarUsuario()} color='#c70f0f' />
          <View style={styles.buttonSpacer} />
          <Button title='Iniciar sesión' onPress={() => navigation.navigate('Inciar_Secion')} color='#0fc73a' />
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
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonSpacer: {
    width: 16,
  },
});